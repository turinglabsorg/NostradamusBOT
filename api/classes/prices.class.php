<?php
	class PricesAPI extends API {

	    public function __construct($request, $origin, $isAngular) {
	        parent::__construct($request, $isAngular);
	    }

	    protected function ETH() {
	    	$_POST=$this->request;
	        $price=returnDBObject("prices","SELECT * FROM eth_prices WHERE currency=? ORDER BY id DESC LIMIT 1",array($_POST['native_currency']));
	        $response=array(
	        	"price"=>$price['price'],
	        	"updated"=>$price['price_update']
	        );
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }

	    protected function BTC() {
	    	$_POST=$this->request;
	        $price=returnDBObject("prices","SELECT * FROM btc_prices WHERE currency=? ORDER BY id DESC LIMIT 1",array($_POST['native_currency']));
	        $response=array(
	        	"price"=>$price['price'],
	        	"updated"=>$price['price_update']
	        );
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }

	    protected function LTC() {
	    	$_POST=$this->request;
	        $price=returnDBObject("prices","SELECT * FROM ltc_prices WHERE currency=?  ORDER BY id DESC LIMIT 1",array($_POST['native_currency']));
	        $response=array(
	        	"price"=>$price['price'],
	        	"updated"=>$price['price_update']
	        );
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }

	    protected function history() {
	    	$_POST=$this->request;
	        $prices=returnDBObject("prices","SELECT * FROM ".strtolower($_POST['currency'])."_prices WHERE price_type=? AND currency=? ORDER BY id ASC",array('SPOT',$_POST['native_currency']),1);
	        return $this->data=array('response'=>$prices,'status'=>'200');
	    }

	    protected function search() {
	    	$_POST=$this->request;
	    	$limit_date=date('Y-m-d H:i:s',strtotime("now -2 week"));

	    	if($_POST['type']=='down'){
	        	$prices=returnDBObject("prices","SELECT * FROM ".strtolower($_POST['currency'])."_prices WHERE price_type=? AND currency=? AND price<=? AND price_update > ? AND price!=? ORDER BY id DESC",array('SPOT',$_POST['native_currency'],$_POST['value'],$limit_date,0),1);
	    	}else{
	        	$prices=returnDBObject("prices","SELECT * FROM ".strtolower($_POST['currency'])."_prices WHERE price_type=? AND currency=? AND price>=?  AND price_update > ? AND price!=? ORDER BY id DESC",array('SPOT',$_POST['native_currency'],$_POST['value'],$limit_date,0),1);
	    	}
	    	$response=array(
	    		"times"=>count($prices),
	    		"last_time"=>$prices[0]['price_update']
	    	);
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }

	    protected function lower() {
	    	$_POST=$this->request;
	    	$limit_date=date('Y-m-d H:i:s',strtotime("now -2 week"));

	    	$price=returnDBObject("prices","SELECT * FROM ".strtolower($_POST['currency'])."_prices WHERE price_type=? AND currency=? AND price_update > ? AND price!=? ORDER BY price ASC LIMIT 1",array('SPOT',$_POST['native_currency'],$limit_date,0));

	    	$response=array(
	    		"price"=>$price['price'],
	    		"last_time"=>$price['price_update']
	    	);
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }

	    protected function higher() {
	    	$_POST=$this->request;
	    	$limit_date=date('Y-m-d H:i:s',strtotime("now -2 week"));

	    	$price=returnDBObject("prices","SELECT * FROM ".strtolower($_POST['currency'])."_prices WHERE price_type=? AND currency=? AND price_update > ? AND price!=? ORDER BY price DESC LIMIT 1",array('SPOT',$_POST['native_currency'],$limit_date,0));

	    	$response=array(
	    		"price"=>$price['price'],
	    		"last_time"=>$price['price_update']
	    	);
	        return $this->data=array('response'=>$response,'status'=>'200');
	    }
	}
?>