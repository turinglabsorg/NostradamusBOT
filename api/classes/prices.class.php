<?php
	class PricesAPI extends API {

	    public function __construct($request, $origin) {
	        parent::__construct($request);
	    }

	    protected function ETH() {
	        $price=returnDBObject("prices","SELECT * FROM eth_prices ORDER BY id DESC LIMIT 1",array());
	        $response=array(
	        	"price"=>$price['price'],
	        	"updated"=>$price['price_update']
	        );
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }

	    protected function BTC() {
	        $price=returnDBObject("prices","SELECT * FROM btc_prices ORDER BY id DESC LIMIT 1",array());
	        $response=array(
	        	"price"=>$price['price'],
	        	"updated"=>$price['price_update']
	        );
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }

	    protected function LTC() {
	        $price=returnDBObject("prices","SELECT * FROM ltc_prices ORDER BY id DESC LIMIT 1",array());
	        $response=array(
	        	"price"=>$price['price'],
	        	"updated"=>$price['price_update']
	        );
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }
	}
?>