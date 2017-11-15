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
	              
	}
?>