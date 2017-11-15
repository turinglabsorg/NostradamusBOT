<?php
	class WalletsAPI extends API {

	    public function __construct($request, $origin, $isAngular) {
	        parent::__construct($request, $isAngular);
	    }

	    protected function create() {
	        $response='WALLET CREATED!';
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }

	    protected function balance() {
	        $response='BALANCE WALLET!';
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }
	              
	}
?>