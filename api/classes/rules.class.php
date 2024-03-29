<?php
	class RulesAPI extends API {

	    public function __construct($request, $origin, $isAngular) {
	        parent::__construct($request, $isAngular);
	    }

	    protected function get() {
	        $_POST=$this->request;
			$checkUUID=returnDBObject("app","SELECT * FROM users WHERE uuid=? AND password=?",array($_POST['uuid'],$_POST['password']));

	    	if($checkUUID['uuid']!=''){
	    		
	    		$rules=returnDBObject("app","SELECT * FROM rules WHERE uuid_user=? AND hidden=?",array($_POST['uuid'],'n'),1);
	    		$r=0;
	    		foreach($rules as $rule){
	    			$wallet=returnDBObject("app","SELECT * FROM wallets WHERE id=?",array($rule['id_wallet']));
	    			$actions=returnDBObject("app","SELECT * FROM actions WHERE id_rule=?",array($rule['id']),1);
	    			$rules[$r]['wallet']=$wallet;
	    			$rules[$r]['ran']=count($actions);
	    			unset($rules[$r]['id_wallet']);
	    			$r++;
	    		}
	    		return $this->data=array('response'=>$rules,'status'=>'200');

			}else{
				return $this->data=array('response'=>'NOPE','status'=>'404');
			}
	    }

	    protected function archive() {
	        $_POST=$this->request;
			$checkUUID=returnDBObject("app","SELECT * FROM users WHERE uuid=? AND password=?",array($_POST['uuid'],$_POST['password']));

	    	if($checkUUID['uuid']!=''){
	    		
	    		$rules=returnDBObject("app","SELECT * FROM rules WHERE uuid_user=? AND hidden=?",array($_POST['uuid'],'y'),1);
	    		$r=0;
	    		foreach($rules as $rule){
	    			$wallet=returnDBObject("app","SELECT * FROM wallets WHERE id=?",array($rule['id_wallet']));
	    			$actions=returnDBObject("app","SELECT * FROM actions WHERE id_rule=?",array($rule['id']),1);
	    			$rules[$r]['wallet']=$wallet;
	    			$rules[$r]['ran']=count($actions);
	    			unset($rules[$r]['id_wallet']);
	    			$r++;
	    		}
	    		return $this->data=array('response'=>$rules,'status'=>'200');

			}else{
				return $this->data=array('response'=>'NOPE','status'=>'404');
			}
	    }

	    protected function create() {
	        $_POST=$this->request;
			$checkUUID=returnDBObject("app","SELECT * FROM users WHERE uuid=? AND password=?",array($_POST['uuid'],$_POST['password']));

	    	if($checkUUID['uuid']!=''){
	    		$checkWALLET=returnDBObject("app","SELECT * FROM wallets WHERE uuid_user=? AND currency=?",array($_POST['uuid'], $_POST['wallet']));

	    		if($checkWALLET['id']!=''){
					runDBQuery(
						"app",
						"INSERT INTO rules (uuid_user,name,action,id_wallet,price,var_action,var_perc,id_rule,auto,active,public,amount_eur,amount_crypto,type,price_var,included_fees,loop_rule,hidden) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
						array(
							$_POST['uuid'],
							$_POST['name'],
							$_POST['action'],
							$checkWALLET['id'],
							$_POST['price'],
							$_POST['var_action'],
							$_POST['var_perc'],
							$_POST['id_rule'],
							$_POST['auto'],
							$_POST['active'],
							$_POST['public'],
							$_POST['amount_eur'],
							$_POST['amount_crypto'],
							$_POST['type'],
							$_POST['price_var'],
							$_POST['included_fees'],
							$_POST['loop_rule'],
							'n'
						)
					);

					return $this->data=array('response'=>'RULE CREATED','status'=>'200');
				}else{
					return $this->data=array('response'=>'WALLET NOT FOUND','status'=>'404');
				}
				
			}else{
				return $this->data=array('response'=>'NOPE','status'=>'404');
			}
	    }

	    protected function delete() {
	        $_POST=$this->request;
			$checkUUID=returnDBObject("app","SELECT * FROM users WHERE uuid=? AND password=?",array($_POST['uuid'],$_POST['password']));

	    	if($checkUUID['uuid']!=''){
	    		$checkRULE=returnDBObject("app","SELECT * FROM rules WHERE uuid_user=? AND id=?",array($_POST['uuid'], $_POST['id']));

	    		if($checkRULE['id']!=''){
					runDBQuery(
						"app",
						"UPDATE rules SET hidden=? WHERE id=?",
						array(
							'y',
							$_POST['id'],
						)
					);
					$checkRULES=returnDBObject("app","SELECT * FROM rules WHERE uuid_user=? AND id_rule=?",array($_POST['uuid'], $_POST['id']),1);
					if(count($checkRULES)>0){
						foreach($checkRULES as $rule){
							runDBQuery(
								"app",
								"UPDATE rules SET hidden=? WHERE id=?",
								array(
									'y',
									$rule['id'],
								)
							);
						}
					}

					return $this->data=array('response'=>'RULE DELETED','status'=>'200');
				}else{
					return $this->data=array('response'=>'RULE NOT FOUND','status'=>'404');
				}
				
			}else{
				return $this->data=array('response'=>'NOPE','status'=>'404');
			}
	    }

	    protected function toggle() {
	        $_POST=$this->request;
			$checkUUID=returnDBObject("app","SELECT * FROM users WHERE uuid=? AND password=?",array($_POST['uuid'],$_POST['password']));

	    	if($checkUUID['uuid']!=''){
	    		$checkRULE=returnDBObject("app","SELECT * FROM rules WHERE uuid_user=? AND id=?",array($_POST['uuid'], $_POST['id']));

	    		if($checkRULE['id']!=''){
					runDBQuery(
						"app",
						"UPDATE rules SET active=? WHERE id=?",
						array(
							$_POST['active'],
							$_POST['id'],
						)
					);

					return $this->data=array('response'=>'RULE TOGGLED','status'=>'200');
				}else{
					return $this->data=array('response'=>'RULE NOT FOUND','status'=>'404');
				}
				
			}else{
				return $this->data=array('response'=>'NOPE','status'=>'404');
			}
	    }

	    protected function edit() {
	        $_POST=$this->request;
			$checkUUID=returnDBObject("app","SELECT * FROM users WHERE uuid=? AND password=?",array($_POST['uuid'],$_POST['password']));
	    	if($checkUUID['uuid']!=''){
	    		$checkWALLET=returnDBObject("app","SELECT * FROM wallets WHERE uuid_user=? AND currency=?",array($_POST['uuid'], $_POST['wallet']));

	    		if($checkWALLET['id']!=''){
	    			$checkRULE=returnDBObject("app","SELECT * FROM rules WHERE uuid_user=? AND id=?",array($_POST['uuid'], $_POST['id']));

	    			if($checkWALLET['id']!=''){
	    				if(isset($_POST['id_rule'])){
	    					$idRULE=$_POST['id_rule'];
	    				}else{
	    					$idRULE='';
	    				}
						runDBQuery(
							"app",
							"UPDATE rules SET uuid_user=?,name=?,action=?,id_wallet=?,price=?,var_action=?,var_perc=?,id_rule=?,auto=?,active=?,public=?,amount_eur=?,amount_crypto=?,type=?,price_var=?,included_fees=?,loop_rule=? WHERE id=?",
							array(
								$_POST['uuid'],
								$_POST['name'],
								$_POST['action'],
								$checkWALLET['id'],
								$_POST['price'],
								$_POST['var_action'],
								$_POST['var_perc'],
								$idRULE,
								$_POST['auto'],
								$_POST['active'],
								$_POST['public'],
								$_POST['amount_eur'],
								$_POST['amount_crypto'],
								$_POST['type'],
								$_POST['price_var'],
								$_POST['included_fees'],
								$_POST['loop_rule'],
								$_POST['id']
							)
						);

						return $this->data=array('response'=>'RULE EDITED','status'=>'200');
					}else{
						return $this->data=array('response'=>'RULE NOT FOUND','status'=>'404');
					}
				}else{
					return $this->data=array('response'=>'WALLET NOT FOUND','status'=>'404');
				}
				
			}else{
				return $this->data=array('response'=>'NOPE','status'=>'404');
			}
	    }
	              
	}
?>