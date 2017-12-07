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
				
    			$urlPOST='https://api.coinbase.com/v2/prices/'.$wallet['currency'].'-'.$user['native_currency'].'/'.$action['action'];
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
	    			$lastAction=returnDBObject("app","SELECT * FROM actions WHERE id_rule=? ORDER BY id DESC LIMIT 1",array($action['id_rule']));
	    			if(isset($lastAction['id']) && $lastAction['id']!=''){
	    				if($action['price_var']=='less'){
		    				if($lastAction['price']<=$action['price']){	
		    					$proceed='Y';
		    				}
		    			}elseif($action['price_var']=='more'){
		    				if($lastAction['price']>=$action['price']){
		    					$proceed='Y';
		    				}
		    			}
	    			}
	    		}

    			if($proceed=='Y'){								
					if($user['virtual_wallet']=='y'){
						$walletMode='quote';
						$walletValue='true';
					}else{
						$walletMode='commit';
						if($action['auto']=='y'){
							$walletValue='true';
						}else{
							$walletValue='false';
						}
					}
					if($action['included_fees']=='y'){
						$fees='total';
					}else{
						$fees='amount';
					}
					if($tokens['access_token']!='' && $tokens['refresh_token']!=''){
						if($action['action']=='buy'){
							echo '<br>ROLE #'.$action['id'].' | BUY | '.$price['data']['amount'].' | ';
							$urlPOST='https://api.coinbase.com/v2/accounts/'.$wallet['id_wallet'].'/buys';
							
							if($action['amount_eur']>0){
								$total=$action['amount_eur'];
								$currency=$user['native_currency'];
							}elseif($action['amount_crypto']>0){
								$total=$action['amount_crypto'];
								$currency=$wallet['currency'];
							}else{
	    						echo 'INVALID AMOUNT';
							}

							if(isset($total)){
	    						$data=array(
									$fees => $total,
									'currency' => $currency,
									$walletMode => $walletValue
	 							);
								$result=parent::coinbaseAPI($tokens,$urlPOST,$data);
								echo 'BUY DONE';
							}
						}elseif($action['action']=='sell'){
							echo '<br>ROLE #'.$action['id'].' | SELL | '.$price['data']['amount'].' | ';
							$urlPOST='https://api.coinbase.com/v2/accounts/'.$wallet['id_wallet'].'/sells';
							
							if($action['amount_eur']>0){
								$total=$action['amount_eur'];
								$currency=$user['native_currency'];
							}elseif($action['amount_crypto']>0){
								$total=$action['amount_crypto'];
								$currency=$wallet['currency'];
							}else{
	    						echo 'INVALID AMOUNT';
							}

							if(isset($total)){
	    						$data=array(
									$fees => $total,
									'currency' => $currency,
									$walletMode => $walletValue
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
							if($action['id_rule']!=0){
								//runDBQuery("app","UPDATE rules SET active=? WHERE id=?",array('y',$action['id']));
							}else{
								runDBQuery("app","UPDATE rules SET active=? WHERE id=?",array('y',$action['id']));
							}
						}

						if($user['country']=='IT'){							

							sendMail(
				        		array(
				        			"name"=>"NostradamusBOT",
				        			"email"=>"noreply@nostradamusbot.com"
				        		),
				        		array(
				        			"name"=>$user['name'],
				        			"email"=>$user['email']
				        		), 
				        		'La tua regola #'.$action['id'].' sul portafoglio '.$wallet['currency'].' è partita!', 
				        		'La tua regola è partita amico!<br>Questi i dettagli dell\'operazione:<br>
				        		> Prezzo: '.print_money($price['data']['amount'],$user['native_currency']).'<br>
				        		> Commissioni: '.print_money($result['data']['fee']['amount'],$user['native_currency']).'<br>
				        		> Subtotale: '.print_money($result['data']['subtotal']['amount'],$user['native_currency']).'<br>
				        		> Totale: '.print_money($result['data']['total']['amount'],$user['native_currency']).'<br><br>
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
				        			"name"=>$user['name'],
				        			"email"=>$user['email']
				        		), 
				        		'You rule #'.$action['id'].' on wallet '.$wallet['currency'].' ran!', 
				        		'Your rule ran man!<br>These are the details:<br>
				        		> Price: '.print_money($price['data']['amount'],$user['native_currency']).'<br>
				        		> Fee: '.print_money($result['data']['fee']['amount'],$user['native_currency']).'<br>
				        		> Subtotal: '.print_money($result['data']['subtotal']['amount'],$user['native_currency']).'<br>
				        		> Total: '.print_money($result['data']['total']['amount'],$user['native_currency']).'<br><br>
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

	    protected function get() {
	        $_POST=$this->request;
			$checkUUID=returnDBObject("app","SELECT * FROM users WHERE uuid=? AND password=?",array($_POST['uuid'],$_POST['password']));

	    	if($checkUUID['uuid']!=''){
	    		
	    		$actions=returnDBObject("app","SELECT * FROM actions WHERE uuid_user=? ORDER BY running_date DESC",array($_POST['uuid']),1);
	    		return $this->data=array('response'=>$actions,'status'=>'200');

			}else{
				return $this->data=array('response'=>'NOPE','status'=>'404');
			}
	    }
	              
	}
?>