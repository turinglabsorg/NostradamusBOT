<?php
	class FeesAPI extends API {

	    public function __construct($request, $origin, $isAngular) {
	        parent::__construct($request, $isAngular);
	    }

	    protected function get() {
	        $_POST=$this->request;
			$checkUUID=returnDBObject("app","SELECT * FROM users WHERE uuid=? AND password=?",array($_POST['uuid'],$_POST['password']));

	    	if($checkUUID['uuid']!=''){
	    		
	    		$feesDB=returnDBObject("app","SELECT * FROM fees WHERE uuid_user=? ORDER BY fee_date DESC",array($_POST['uuid']),1);
	    		$fees=array();
	    		$f=0;
	    		foreach($feesDB as $fee){
	    			$dataexp=explode('-',$fee['fee_date']);
	    			if(!isset($fees[$dataexp[0].'-'.$dataexp[1]]['fees'])){
	    				$fees[$dataexp[0].'-'.$dataexp[1]]['fees']=array();
	    				$fees[$dataexp[0].'-'.$dataexp[1]]['total']=0;
	    			}
	    			$wallet=returnDBObject("app","SELECT * FROM wallets WHERE id=?",array($fee['id_wallet']));
	    			$rule=returnDBObject("app","SELECT * FROM rules WHERE id=?",array($fee['id_rule']));
	    			$action=returnDBObject("app","SELECT * FROM actions WHERE id=?",array($fee['id_action']));
	    			
	    			$fee['wallet']=$wallet;
	    			$fee['rule']=$rule;
	    			$fee['action']=$action;
	    			unset($fee['id_wallet']);
	    			unset($fee['id_rule']);
	    			unset($fee['id_action']);

	    			array_push($fees[$dataexp[0].'-'.$dataexp[1]]['fees'], $fee);
	    			if($fee['fee_paid']=='n'){
	    				$fees[$dataexp[0].'-'.$dataexp[1]]['total']++;
	    			}
	    			$f++;
	    		}

	    		return $this->data=array('response'=>$fees,'status'=>'200');

			}else{
				return $this->data=array('response'=>'NOPE','status'=>'404');
			}
	    }

	}
?>