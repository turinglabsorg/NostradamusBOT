<?php
	class PricesAPI extends API {

	    public function __construct($request, $origin) {
	        parent::__construct($request);
	        
	        if (!array_key_exists('apiKey', $this->request)) {
	            throw new Exception('No API Key provided');
	        } else if ($this->request['apiKey']!='00xzcvY59zL2MvZ4NnZzd3cl5SaqQ') {
	            throw new Exception('Invalid API Key');
	        } 
	        
	    }

	    protected function ETH() {
	        $response='ETH PRICE!';
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }

	    protected function BTC() {
	        $response='BTC PRICE!';
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }

	    protected function LTC() {
	        $response='LTC PRICE!';
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }
	}
?>