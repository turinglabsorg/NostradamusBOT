<?php
	class RulesAPI extends API {

	    public function __construct($request, $origin, $isAngular) {
	        parent::__construct($request, $isAngular);
	    }

	    protected function create() {
	        $response='RULE CREATED!';
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }
	              
	}
?>