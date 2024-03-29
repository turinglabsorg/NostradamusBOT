<?php
	
	class WalletsAPI extends API {
	    
	    public function __construct($request, $origin, $isAngular) {
	        parent::__construct($request, $isAngular);
	    }

	    protected function balance() {
	    	$_POST=$this->request;
			$usersAPI = new UsersAPI($this->request, $this->origin, $this->isAngular);
			$checkUUID=returnDBObject("app","SELECT * FROM users WHERE uuid=? AND password=?",array($_POST['uuid'],$_POST['password']));

	    	if($checkUUID['uuid']!=''){
				$currentWallet=strtolower($_POST['wallet']);
				
				if($checkUUID['refresh_token_'.$currentWallet]!=''){
					$checkWALLET=returnDBObject("app","SELECT * FROM wallets WHERE uuid_user=? AND currency=?",array($_POST['uuid'], $_POST['wallet']));
						if($checkWALLET['id']!=''){
							$tokens=$usersAPI->refreshTokens($checkUUID,$currentWallet);
            				$urlPOST='https://api.coinbase.com/v2/accounts/'.$checkWALLET['id_wallet'];
            				
            				$result=parent::coinbaseAPI($tokens,$urlPOST);

							runDBQuery(
								"app",
								"UPDATE wallets SET balance=? WHERE id=?",
								array(
									$result['data']['balance']['amount'],
									$checkWALLET['id']
								)
							);
							
							$response=$result['data']['balance']['amount'];

						}else{
							return $this->data=array('response'=>'WALLET NOT FOUND','status'=>'404');
						}
					return $this->data=array('response'=>$response,'status'=>'200');
				}else{
					return $this->data=array('response'=>'WALLET NOT FOUND','status'=>'404');
				}
			}else{
				return $this->data=array('response'=>'NOPE','status'=>'404');
			}
	    }

	    protected function get() {
	        $_POST=$this->request;
			$checkUUID=returnDBObject("app","SELECT * FROM users WHERE uuid=? AND password=?",array($_POST['uuid'],$_POST['password']));

	    	if($checkUUID['uuid']!=''){
	    		
	    		$wallets=returnDBObject("app","SELECT * FROM wallets WHERE uuid_user=?",array($_POST['uuid']),1);
	    		
	    		return $this->data=array('response'=>$wallets,'status'=>'200');

			}else{
				return $this->data=array('response'=>'NOPE','status'=>'404');
			}
	    }   

	    protected function delete() {
	        $_POST=$this->request;
			$checkUUID=returnDBObject("app","SELECT * FROM users WHERE uuid=? AND password=?",array($_POST['uuid'],$_POST['password']));

	    	if($checkUUID['uuid']!=''){
	    		$wallet=returnDBObject("app","SELECT * FROM wallets WHERE uuid_user=? AND currency=?",array($_POST['uuid'],$_POST['currency']));
	    		if($wallet['id']!=''){
	    			runDBQuery("app","DELETE FROM wallets WHERE id=?",array($wallet['id']));
	    			$rules=returnDBObject("app","SELECT * FROM rules WHERE id_wallet=?",array($wallet['id']),1);
	    			if(count($rules)>0){
	    				foreach($rules as $rule){
		    				$actions=returnDBObject("app","SELECT * FROM actions WHERE id_rule=?",array($rule['id']),1);
		    				if(count($actions)>0){
		    					foreach($actions as $action){
	    							runDBQuery("app","DELETE FROM actions WHERE id=?",array($action['id']));
		    					}
		    				}
		    			}
	    				runDBQuery("app","DELETE FROM rules WHERE id_wallet=?",array($wallet['id']));
	    			}
	    			runDBQuery("app","UPDATE users SET last_token_".strtolower($_POST['currency'])."=?, refresh_token_".strtolower($_POST['currency'])."=? WHERE uuid=?",array('','',$checkUUID['uuid']));
	    			return $this->data=array('response'=>'WALLET DELETED','status'=>'200');

	    		}else{
	    			return $this->data=array('response'=>'WALLET NOT FOUND','status'=>'200');
	    		}
			}else{
				return $this->data=array('response'=>'NOPE','status'=>'404');
			}
	    }      
	}
?>