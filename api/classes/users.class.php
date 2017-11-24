<?php
	class UsersAPI extends API {

	    public function __construct($request, $origin, $isAngular) {
	        parent::__construct($request,$isAngular);
	    }

	    protected function check() {
	    	$check=$this->request;
	    	$checkUUID=returnDBObject("app","SELECT * FROM users WHERE uuid=? AND password=?",array($check['uuid'],$check['password']));
	    	if($checkUUID['uuid']!=''){
	    		return $this->data=array('response'=>$checkUUID,'status'=>'200');
	    	}else{
	    		return $this->data=array('response'=>'NOPE','status'=>'404');
	    	}
	    }

	    protected function login() {
	    	$check=$this->request;
	    	$checkUUID=returnDBObject("app","SELECT * FROM users WHERE email=? AND password=?",array($check['email'],encryptPassword($check['password'])));
	    	if($checkUUID['uuid']!=''){
	    		return $this->data=array('response'=>$checkUUID,'status'=>'200');
	    	}else{
	    		return $this->data=array('response'=>'NOPE','status'=>'404');
	    	}
	    }
	    
	    protected function register() {
	    	$user=$this->request;
	    	if($user['user']['email']!=''){
		    	$checkUUID=returnDBObject("app","SELECT * FROM users WHERE email=?",array($user['user']['email']));
		    	$currentWallet=strtolower($user['wallet']['currency']);

		    	if($checkUUID['uuid']==''){
			    	$uuid=uniqid();
					$checkUUID=returnDBObject("app","SELECT * FROM users WHERE uuid=?",array($uuid));
					
					while(isset($checkUUID['uuid'])){
						$uuid=uniqid();
						$checkUUID=returnDBObject("app","SELECT * FROM users WHERE uuid=?",array($uuid));
					}
					
					$password=generate_pwd();

					runDBQuery(
						"app",
						"INSERT INTO users (uuid,refresh_token_".$currentWallet.",name,country,coinbase_id,native_currency,email,password,created,last_token_".$currentWallet.") VALUES (?,?,?,?,?,?,?,?,?,?)",
						array(
							$uuid,
							$user['refresh_token'],
							$user['user']['name'],
							$user['user']['country']['code'],
							$user['user']['id'],
							$user['user']['native_currency'],
							$user['user']['email'],
							encryptPassword($password),
							date('Y-m-d H:i:s'),
							$user['access_token']
						)
					);

					runDBQuery(
						"app",
						"INSERT INTO wallets (uuid_user,currency,balance,id_wallet,name) VALUES (?,?,?,?,?)",
						array(
							$uuid,
							$user['wallet']['currency'],
							$user['wallet']['balance'],
							$user['wallet']['id'],
							$user['wallet']['name']
						)
					);

			        if($user['user']['country']['code']=='IT'){
			        	sendMail(
			        		array(
			        			"name"=>"NostradamusBOT",
			        			"email"=>"noreply@nostradamusbot.com"
			        		),
			        		array(
			        			"name"=>$user['user']['name'],
			        			"email"=>$user['user']['email']
			        		), 
			        		'Benvenuto su Nostradamus', 
			        		'Benvenuto su Nostradamus!<br><br>Ecco le tue credenziali:<br>E-Mail: '.$user['user']['email'].'<br>Password: '.$password.'<br><br>Buona fortuna!<br>Nostradamus Team'
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
			        		'Welcome on Nostradamus', 
			        		'Welcome on Nostradamus!<br><br>These are your credentials:<br>E-Mail: '.$user['user']['email'].'<br>Password: '.$password.'<br><brGood luck!<br>Nostradamus Team'
			        	);
			        }
		        	$password=encryptPassword($password);
				}else{
					$uuid=$checkUUID['uuid'];
					$password=$checkUUID['password'];
					runDBQuery(
						"app",
						"UPDATE users SET refresh_token_".$currentWallet."=?, last_token_".$currentWallet."=? WHERE uuid=?",
						array(
							$user['refresh_token'],
							$user['access_token'],
							$checkUUID['uuid']
						)
					);

					$checkWALLET=returnDBObject("app","SELECT * FROM wallets WHERE uuid_user=? AND currency=?",array($uuid, $user['wallet']['currency']));
					if(!isset($checkWALLET['id']) || $checkWALLET['id']==''){
						runDBQuery(
							"app",
							"INSERT INTO wallets (uuid_user,currency,balance,id_wallet,name) VALUES (?,?,?,?,?)",
							array(
								$uuid,
								$user['wallet']['currency'],
								$user['wallet']['balance'],
								$user['wallet']['id'],
								$user['wallet']['name']
							)
						);
					}else{
						runDBQuery(
							"app",
							"UPDATE wallets SET balance=?, name=? WHERE id=?",
							array(
								$user['wallet']['balance'],
								$user['wallet']['name'],
								$checkWALLET['id']
							)
						);
					}
				}

		        $response=array(
		        	"uuid" => $uuid,
		        	"password" => $password
		        );

		        
		        return $this->data=array('response'=>$response,'status'=>'200');
		   	}else{
		   		return $this->data=array('response'=>'No user info','status'=>'200');
		   	}
	    }

	    public function refreshTokens($user,$wallet){
	    	$urlPOST='https://api.coinbase.com/oauth/token';
	    	$refreshToken=$user['refresh_token_'.$wallet];
			$fields = array(
				'grant_type' => urlencode('refresh_token'),
				'client_id' => urlencode('8a7cbffab1d011558b80731428985953b5758308fa1db27a3548420b4e6abbfa'),
				'client_secret' => urlencode('b01858df10ae0806196c9e96ce7df280ddc15f6a5b65e82f23c8332acc64baea'),
				'refresh_token' => urlencode($refreshToken)
			);
			$fields_string='';
			foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
			rtrim($fields_string, '&');

			$ch = curl_init();
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
			curl_setopt($ch,CURLOPT_URL, $urlPOST);
			curl_setopt($ch,CURLOPT_POST, count($fields));
			curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
			$result = json_decode(curl_exec($ch),1);
			
			$accessToken=$result['access_token'];
			$refreshToken=$result['refresh_token'];

			runDBQuery(
				"app",
				"UPDATE users SET refresh_token_".$wallet."=?, last_token_".$wallet."=? WHERE uuid=?",
				array(
					$result['refresh_token'],
					$result['access_token'],
					$user['uuid']
				)
			);
			curl_close($ch);

			$tokens=array("access_token"=>$accessToken,"refresh_token"=>$refreshToken);

	    	return $tokens;
	    }
	              
	}
?>