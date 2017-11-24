<?php
	use Coinbase\Wallet\Client;
	use Coinbase\Wallet\Configuration;
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
					$tokens=$usersAPI->refreshTokens($checkUUID,$currentWallet);
					
					$configuration = Configuration::oauth($tokens['access_token'], $tokens['refresh_token']);
					$client = Client::create($configuration);
					
					$accounts = $client->getAccounts();
					$address = $client->decodeLastResponse();
					$response=$address['data'][0]['balance']['amount'];
					
					$checkWALLET=returnDBObject("app","SELECT * FROM wallets WHERE uuid_user=? AND currency=?",array($_POST['uuid'], $_POST['wallet']));

					if($checkWALLET['id']!=''){
						runDBQuery(
							"app",
							"UPDATE wallets SET balance=? WHERE id=?",
							array(
								$address['data'][0]['balance']['amount'],
								$checkWALLET['id']
							)
						);
					}

					return $this->data=array('response'=>$response,'status'=>'200');
				}else{
					return $this->data=array('response'=>'WALLET NOT FOUND','status'=>'404');
				}
			}else{
				return $this->data=array('response'=>'NOPE','status'=>'404');
			}
	    }

	    protected function buy() {
	        $response='BUY WALLET!';
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }

	    protected function sell() {
	        $response='SELL WALLET!';
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }         
	}
?>