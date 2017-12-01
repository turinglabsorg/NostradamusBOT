<?php

	class ActionsAPI extends API {

	    public function __construct($request, $origin, $isAngular) {
	        parent::__construct($request, $isAngular);
	    }

	    protected function search() {
	    	$actions=returnDBObject("app","SELECT * FROM rules WHERE active=? ORDER BY id ASC",array('y'),1);
	    	echo 'STARTING SEARCH';
	    	foreach($actions as $action){
	    		$proceed='N';
				$wallet=returnDBObject("app","SELECT * FROM wallets WHERE id=?",array($action['id_wallet']));
				$user=returnDBObject("app","SELECT * FROM users WHERE uuid=?",array($action['uuid_user']));
				$usersAPI = new UsersAPI($this->request, $this->origin, $this->isAngular);
				$tokens=$usersAPI->refreshTokens($user,strtolower($wallet['currency']));
				
    			$urlPOST='https://api.coinbase.com/v2/prices/'.$wallet['currency'].'-EUR/'.$action['action'];
    			$price=parent::coinbaseAPI($tokens,$urlPOST,$data);
	    		
	    		if($action['type']=='fixed'){
	    			if($action['price_var']=='less'){
	    				if($price['data']['amount']<=$action['price']){	
	    					$proceed='Y';
	    				}
	    			}elseif($action['price_var']=='more'){
	    				if($price['data']['amount']>=$action['price']){
	    					$proceed='Y';
	    				}
	    			}
	    		}elseif($action['type']=='variable'){

	    		}

    			if($proceed=='Y'){								
					
					if($wallet['included_fees']=='y'){
						$fees='total';
					}else{
						$fees='amount';
					}

					if($tokens['access_token']!='' && $tokens['refresh_token']!=''){
						if($action['action']=='buy'){
							echo '<br>ROLE #'.$action['id'].' | BUY | ';
							$urlPOST='https://api.coinbase.com/v2/accounts/'.$wallet['id_wallet'].'/buys';
							
							if($action['amount_eur']>0){
								$total=$action['amount_eur'];
								$currency='EUR';
							}elseif($action['amount_crypto']>0){
								$total=$action['amount_crypto'];
								$currency=$wallet['currency'];
							}else{
	    						return $this->data=array('response'=>'INVALID AMOUNT','status'=>'500');
							}

							if(isset($total)){
	    						$data=array(
									$fees => $total,
									'currency' => $currency,
									'commit' => 'false'
	 							);
								$result=parent::coinbaseAPI($tokens,$urlPOST,$data);
								echo 'BUY DONE';
							}
						}elseif($action['action']=='sell'){
							echo '<br>ROLE #'.$action['id'].' | SELL | ';
							$urlPOST='https://api.coinbase.com/v2/accounts/'.$wallet['id_wallet'].'/sells';
							
							if($action['amount_eur']>0){
								$total=$action['amount_eur'];
								$currency='EUR';
							}elseif($action['amount_crypto']>0){
								$total=$action['amount_crypto'];
								$currency=$wallet['currency'];
							}else{
	    						return $this->data=array('response'=>'INVALID AMOUNT','status'=>'500');
							}

							if(isset($total)){
	    						$data=array(
									$fees => $total,
									'currency' => $currency,
									'commit' => 'false'
	 							);
								$result=parent::coinbaseAPI($tokens,$urlPOST,$data);
								echo 'SELL DONE';
							}
						}
						runDBQuery(
							"app",
							"INSERT INTO actions (running_date,uuid_user,id_rule,id_sell,price,amount,fees,total,subtotal) VALUES (?,?,?,?,?,?,?,?,?)",
							array(
								date('Y-m-d H:i:s'),
								$user['uuid'],
								$action['id'],
								$result['data']['id'],
								$price['data']['amount'],
								$result['data']['amount']['amount'],
								$result['data']['fee']['amount'],
								$result['data']['total']['amount'],
								$result['data']['subtotal']['amount']
							)
						);
						runDBQuery("app","UPDATE rules SET active=? WHERE id=?",array('n',$action['id']));
						$searchRule=returnDBObject("app","SELECT * FROM rules WHERE id_rule=?",array($action['id']));
						if(isset($searchRule['id']) && $searchRule['id']!=''){
							runDBQuery("app","UPDATE rules SET active=? WHERE id=?",array('y',$searchRule['id']));
						}elseif($action['loop_rule']=='y'){
							runDBQuery("app","UPDATE rules SET active=? WHERE id=?",array('y',$action['id']));
						}

						if($user['country']=='IT'){							

							sendMail(
				        		array(
				        			"name"=>"NostradamusBOT",
				        			"email"=>"noreply@nostradamusbot.com"
				        		),
				        		array(
				        			"name"=>$user['user']['name'],
				        			"email"=>$user['user']['email']
				        		), 
				        		'La tua regola è partita!', 
				        		'La tua regola è partita amico!<br>Questi i dettagli dell\'operazione:<br>
				        		> Prezzo: '.$price['data']['amount'].'<br>
				        		> Commissioni: '.$result['data']['fee']['amount'].'<br>
				        		> Totale: '.$result['data']['total']['amount'].'<br>
				        		> Subtotale: '.$result['data']['subtotal']['amount'].'<br><br>
				        		Buona fortuna!<br>
				        		Nostradamus Team
				        		'
				        	);

						}else{

							sendMail(
				        		array(
				        			"name"=>"NostradamusBOT",
				        			"email"=>"noreply@nostradamusbot.com"
				        		),
				        		array(
				        			"name"=>$user['user']['name'],
				        			"email"=>$user['user']['email']
				        		), 
				        		'Your rule ran!', 
				        		'Your rule ran man!<br>These are the details:<br>
				        		> Price: '.$price['data']['amount'].'<br>
				        		> Fee: '.$result['data']['fee']['amount'].'<br>
				        		> Total: '.$result['data']['total']['amount'].'<br>
				        		> Subtotal: '.$result['data']['subtotal']['amount'].'<br><br>
				        		Good luck!<br>
				        		Nostradamus Team
				        		'
				        	);

						}
					}else{
		   				echo '<br>NO VALID TOKENS FOR USER '.$user['uuid'];
					}
				}
	    	}
	    	return '<br>DONE';
	    }
	              
	}
?>