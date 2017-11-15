<?php
	class WalletsAPI extends API {

	    public function __construct($request, $origin, $isAngular) {
	        parent::__construct($request, $isAngular);
	    }

	    protected function balance() {
	        $response='BALANCE CREATED!';
	        return $this->data=array('response'=>$response,'status'=>'200');
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