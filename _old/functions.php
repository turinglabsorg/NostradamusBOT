<?php

	function returnPricesFromPeriod($start,$end,$coin){
		$prices=returnDBObject("SELECT * FROM ".$coin."_prices WHERE price_type=? ORDER BY id ASC",array('SPOT'));
		$sumPrices=0;
		$countPrices=0;
		$pricesMid=array();
		foreach($prices as $price){
			if(strtotime($price['price_update']) >= strtotime($start) && strtotime($price['price_update']) <= strtotime($end)){
				$sumPrices+=$price['price'];
				$countPrices++;
				array_push($pricesMid, $price['price']);
			}
		}
		asort($pricesMid);
		//print_r($pricesMid);

		$toReturn=array();
		$toReturn['pricemax']=end($pricesMid);
		$toReturn['pricemin']=reset($pricesMid);
		$toReturn['delta']=$toReturn['pricemax']-$toReturn['pricemin'];
		if($countPrices>0){
			$toReturn['average']=$sumPrices/$countPrices;
		}else{
			$toReturn['average']='';
		}
		return $toReturn;
	}

	function returnSpotFromPeriod($start,$end,$coin){
		$prices=returnDBObject("SELECT * FROM ".$coin."_prices WHERE price_type=? ORDER BY id ASC",array('SPOT'));
		$sumPrices=0;
		$countPrices=0;
		$toReturn=array();
		foreach($prices as $price){
			if(strtotime($price['price_update']) >= strtotime($start) && strtotime($price['price_update']) <= strtotime($end)){
				array_push($toReturn, $price['price']);
			}
		}
		return $toReturn;
	}

	function returnAccount($client,$what){
		$accounts_api = $client->getAccounts();
		$accounts_objects =  (array) $accounts_api;
		foreach($accounts_objects as $accounts_object){
			$accounts =  (array) $accounts_object;
			foreach($accounts as $account_object){
				$account =  (array) $account_object;
				$i=0;
				$accountFound='N';
				foreach($account as $name => $value){
					if($i==3){
						if($value==$what){
							$accountFound='Y';
						}
					}
					if($i==8 && $accountFound=='Y'){
						$ETHID=$value;
					}
					if($i==11 && $accountFound=='Y'){
						$balance=(array) $value;
						$actualBalance= $balance['balance']['amount'];
					}
					$i++;
				}
			}
		}
		$account = $client->getAccount($ETHID);
		$toreturn['account']=$account;
		$toreturn['balance']=$actualBalance;

		return $toreturn;
	}
?>