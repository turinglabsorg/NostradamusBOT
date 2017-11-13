<?php
	class WalletsAPI extends API {

	    public function __construct($request, $origin) {
	        parent::__construct($request);
	        
	        if (!array_key_exists('apiKey', $this->request)) {
	            throw new Exception('No API Key provided');
	        } else if ($this->request['apiKey']!='00xzcvY59zL2MvZ4NnZzd3cl5SaqQ') {
	            throw new Exception('Invalid API Key');
	        } 
	        
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