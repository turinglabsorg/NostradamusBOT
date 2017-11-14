<?php
	class UsersAPI extends API {

	    public function __construct($request, $origin, $isAngular) {
	        parent::__construct($request,$isAngular);
	    }

	    protected function register() {
	    	$user=$this->request;
	    	if($user['user']['email']!=''){
		    	$checkUUID=returnDBObject("app","SELECT * FROM users WHERE email=?",array($user['user']['email']));
		    	
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
						"INSERT INTO users (uuid,refresh_token,name,country,coinbase_id,native_currency,email,password,created,last_token) VALUES (?,?,?,?,?,?,?,?,?,?)",
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
						"UPDATE users SET refresh_token=?, last_token=? WHERE uuid=?",
						array(
							$user['refresh_token'],
							$user['access_token'],
							$checkUUID['uuid']
						)
					);
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