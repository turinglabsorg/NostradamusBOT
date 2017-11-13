<?php
	class UsersAPI extends API {

	    public function __construct($request, $origin) {
	        parent::__construct($request);
	    }

	    protected function register() {
	        $response=json_encode($this->request);
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }
	              
	}
?>