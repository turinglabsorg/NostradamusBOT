<?php
	class MinersAPI extends API {

	    public function __construct($request, $origin, $isAngular) {
	        parent::__construct($request, $isAngular);
	    }

	    protected function state() {
	        $miner=$this->request;
	        $response=file_get_contents('http://dwarfpool.com/eth/api?wallet='.$miner['wallet']);
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }
	              
	}
?>