<?php
	class RulesAPI extends API {

	    public function __construct($request, $origin) {
	        parent::__construct($request);
	    }

	    protected function create() {
	        $response='RULE CREATED!';
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }
	              
	}
?>