<?php
	class ActionsAPI extends API {

	    public function __construct($request, $origin, $isAngular) {
	        parent::__construct($request, $isAngular);
	    }

	    protected function search() {
	    	$actions=returnDBObject("app","SELECT * FROM rules WHERE active=?",array('y'),1);
	    	foreach($actions as $action){
	    		$wallet=returnDBObject("app","SELECT * FROM wallets WHERE id=?",array($action['id_wallet']));
	    		
	    	}

	        $response='ACTIONS CHECKED!';
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }
	              
	}
?>