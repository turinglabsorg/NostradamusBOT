<?php
	error_reporting(E_ALL); ini_set('display_errors', 'On');
	include('vendor/autoload.php');
	include('connect_eth.php');
	include('core.php');
	include('functions.php');
?>
<link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">
<style>body{font-family: 'VT323', monospace;background:#000; color:#00FF00; font-size: 12px;}</style>
<?php
	$apiKey='v4rQx4G8cTMEbIA5';
	$apiSecret='XpJeaBLZ3xs3SxfIDwySstcrM3cCQlf6';
	//echo '<pre>';
	use Coinbase\Wallet\Client;
	use Coinbase\Wallet\Configuration;
	use Coinbase\Wallet\Resource\Sell;
	use Coinbase\Wallet\Resource\Buy;
	use Coinbase\Wallet\Enum\Param;
	use Coinbase\Wallet\Enum\CurrencyCode;
	use Coinbase\Wallet\Value\Money;

	$configuration = Configuration::apiKey($apiKey, $apiSecret);
	$client = Client::create($configuration);
	
	/*STORING BTC SPOT PRICE */
        $buy_object = $client->getSpotPrice('BTC-EUR');
        $spot_price =  (array) $buy_object;
         
        $i=0;
        foreach($spot_price as $val){
            if($i==0){
                $spotPrice['btc']=$val;
            }
            $i++;
        }
        $sellPrice['btc']=$spotPrice['btc']-1.7;
        $buyPrice['btc']=$spotPrice['btc']+1.7;
        echo 'BTC SPOT PRICE '.$spotPrice['btc'].' EUR<br>';
		echo 'BTC SELL PRICE '.$sellPrice['btc'].' EUR<br>';
        echo 'BTC BUY PRICE '.$buyPrice['btc'].' EUR<br><br>';
        runDBQuery("INSERT INTO btc_prices (price,currency,price_type,price_update) VALUES (?,?,?,?)",
            array($spotPrice['btc'],'EUR','SPOT',date('Y-m-d H:i:s')));
    /*STORING BTC SPOT PRICE*/

    /*STORING ETH SPOT PRICE*/
        $buy_object = $client->getSpotPrice('ETH-EUR');
        $spot_price =  (array) $buy_object;
         
        $i=0;
        foreach($spot_price as $val){
            if($i==0){
                $spotPrice['eth']=$val;
            }
            $i++;
        }
        $sellPrice['eth']=$spotPrice['eth']-1.7;
        $buyPrice['eth']=$spotPrice['eth']+1.7;
        echo 'ETH SPOT PRICE '.$spotPrice['eth'].' EUR<br>';
		echo 'ETH SELL PRICE '.$sellPrice['eth'].' EUR<br>';
        echo 'ETH BUY PRICE '.$buyPrice['eth'].' EUR<br><br>';
        runDBQuery("INSERT INTO eth_prices (price,currency,price_type,price_update) VALUES (?,?,?,?)",
            array($spotPrice['eth'],'EUR','SPOT',date('Y-m-d H:i:s')));
        die();
    /*STORING ETH SPOT PRICE*/
	
	/*TROVO ACCOUNT ETH
		$accountArray=returnAccount($client,'ETH');
		$actualBalance=$accountArray['balance'];
		$account=$accountArray['account'];
	/*TROVO ACCOUNT ETH*/

	$periods=array(
		array(
			"start" =>'now -1 hour',
			"end" => 'now'
		),
		array(
			"start" =>'now -2 hour',
			"end" => 'now -1 hour'
		),
		array(
			"start" =>'now -3 hour',
			"end" => 'now -2 hour'
		),
		array(
			"start" =>'now -4 hour',
			"end" => 'now -3 hour'
		),
		array(
			"start" =>'now -5 hour',
			"end" => 'now -4 hour'
		)
	);
	$maxPricesAverage=0;
	$maxPricesCount=0;
	$minPricesAverage=0;
	$minPricesCount=0;

	foreach($periods as $period){
		//echo 'EVALUATING PERIOD: '.str_replace('NOW ','',strtoupper($period['start'])).' '.str_replace('NOW ','',strtoupper($period['end'])).'<br>';
		$prices=returnPricesFromPeriod($period['start'],$period['end'],'btc');
		//echo 'AVERAGE PRICE: '.round($prices['average'],2).' '.'EUR<br>';
		//echo 'PRICE MIN: '.$prices['pricemin'].' EUR<br>';
		//echo 'PRICE MAX: '.$prices['pricemax'].' EUR<br>';
		//echo 'DELTA: '.$prices['delta'].' EUR<br><br>';
		if($prices['pricemax']!=''){
			$maxPricesAverage+=$prices['pricemax'];
			$maxPricesCount++;
		}
		if($prices['pricemin']!=''){
			$minPricesAverage+=$prices['pricemin'];
			$minPricesCount++;
		}
	}
	$maxPricesAverage=round($maxPricesAverage/$maxPricesCount,2);
	$minPricesAverage=round($minPricesAverage/$minPricesCount,2);
	$deltaPricesAverage=$maxPricesAverage-$minPricesAverage;

	echo 'BTC PRICE MAX AVERAGE LAST 4H: '.$maxPricesAverage.' EUR<br>';
	echo 'BTC PRICE MIN AVERAGE LAST 4H: '.$minPricesAverage.' EUR<br>';
	echo 'BTC DELTA AVERAGE LAST 4H: '.$deltaPricesAverage.' EUR<br><br>';

	$maxPricesAverage=0;
	$maxPricesCount=0;
	$minPricesAverage=0;
	$minPricesCount=0;
	foreach($periods as $period){
		//echo 'EVALUATING PERIOD: '.str_replace('NOW ','',strtoupper($period['start'])).' '.str_replace('NOW ','',strtoupper($period['end'])).'<br>';
		$prices=returnPricesFromPeriod($period['start'],$period['end'],'eth');
		//echo 'AVERAGE PRICE: '.round($prices['average'],2).' '.'EUR<br>';
		//echo 'PRICE MIN: '.$prices['pricemin'].' EUR<br>';
		//echo 'PRICE MAX: '.$prices['pricemax'].' EUR<br>';
		//echo 'DELTA: '.$prices['delta'].' EUR<br><br>';
		if($prices['pricemax']!=''){
			$maxPricesAverage+=$prices['pricemax'];
			$maxPricesCount++;
		}
		if($prices['pricemin']!=''){
			$minPricesAverage+=$prices['pricemin'];
			$minPricesCount++;
		}
	}
	$maxPricesAverage=round($maxPricesAverage/$maxPricesCount,2);
	$minPricesAverage=round($minPricesAverage/$minPricesCount,2);
	$deltaPricesAverage=$maxPricesAverage-$minPricesAverage;

	echo 'ETH PRICE MAX AVERAGE LAST 4H: '.$maxPricesAverage.' EUR<br>';
	echo 'ETH PRICE MIN AVERAGE LAST 4H: '.$minPricesAverage.' EUR<br>';
	echo 'ETH DELTA AVERAGE LAST 4H: '.$deltaPricesAverage.' EUR<br><br>';

	echo 'CHECKING BTC LAST 5 MINUTES PRICE: ';
	$lastMinutesPrices=returnSpotFromPeriod('now -5 minute','now','btc');
	$deltaLastFive['btc']=returnVariazione($spotPrice['btc'],reset($lastMinutesPrices));
	if(floatval($deltaLastFive['btc'])>0){
		echo '<BR>BTC PRICE IS ASCENDING SINCE 5 MINUTES';
	}else{
		echo '<BR>BTC PRICE IS DESCENDING SINCE 5 MINUTES';
	}
	echo '<BR>THIS IS THE DELTA WITH THE SPOT PRICE '.$deltaLastFive['btc'].'<br><br>';

	echo 'CHECKING BTC LAST 4 HOUR PRICE: ';
	$lastMinutesPrices=returnSpotFromPeriod('now -4 hour','now','btc');
	$deltaLastHour['btc']=returnVariazione($spotPrice['btc'],reset($lastMinutesPrices));
	if(floatval($deltaLastHour['btc'])>0){
		echo '<BR>BTC PRICE IS ASCENDING SINCE 4 HOUR';
	}else{
		echo '<BR>BTC PRICE IS DESCENDING SINCE 4 HOUR';
	}
	echo '<BR>THIS IS THE DELTA WITH THE SPOT PRICE '.$deltaLastHour['btc'].'<br><br>';

	/*echo 'CHECKING BTC LAST 8 HOUR PRICE: ';
	$lastMinutesPrices=returnSpotFromPeriod('now -8 hour','now','btc');
	$deltaLast8Hour=returnVariazione($spotPrice['btc'],reset($lastMinutesPrices));
	if(floatval($deltaLast8Hour)>0){
		echo '<BR>BTC PRICE IS ASCENDING SINCE 8 HOUR';
	}else{
		echo '<BR>BTC PRICE IS DESCENDING SINCE 8 HOUR';
	}
	echo '<BR>THIS IS THE DELTA WITH THE SPOT PRICE '.$deltaLast8Hour.'<br><br>';*/

	echo 'CHECKING ETH LAST 5 MINUTES PRICE: ';
	$lastMinutesPrices=returnSpotFromPeriod('now -5 minute','now','eth');
	$deltaLastFive['eth']=returnVariazione($spotPrice['eth'],reset($lastMinutesPrices));
	if(floatval($deltaLastFive['eth'])>0){
		echo '<BR>ETH PRICE IS ASCENDING SINCE 5 MINUTES';
	}else{
		echo '<BR>ETH PRICE IS DESCENDING SINCE 5 MINUTES';
	}
	echo '<BR>THIS IS THE DELTA WITH THE SPOT PRICE '.$deltaLastFive['eth'].'<br><br>';

	echo 'CHECKING ETH LAST 4 HOUR PRICE: ';
	$lastMinutesPrices=returnSpotFromPeriod('now -4 hour','now','eth');
	$deltaLastHour['eth']=returnVariazione($spotPrice['eth'],reset($lastMinutesPrices));
	if(floatval($deltaLastHour['eth'])>0){
		echo '<BR>ETH PRICE IS ASCENDING SINCE 4 HOUR';
	}else{
		echo '<BR>ETH PRICE IS DESCENDING SINCE 4 HOUR';
	}
	echo '<BR>THIS IS THE DELTA WITH THE SPOT PRICE '.$deltaLastHour['eth'].'<br><br>';

	/*echo 'CHECKING ETH LAST 8 HOUR PRICE: ';
	$lastMinutesPrices=returnSpotFromPeriod('now -8 hour','now','eth');
	$deltaLast8Hour=returnVariazione($spotPrice['eth'],reset($lastMinutesPrices));
	if(floatval($deltaLast8Hour)>0){
		echo '<BR>ETH PRICE IS ASCENDING SINCE 8 HOUR';
	}else{
		echo '<BR>ETH PRICE IS DESCENDING SINCE 8 HOUR';
	}
	echo '<BR>THIS IS THE DELTA WITH THE SPOT PRICE '.$deltaLast8Hour.'<br><br>';*/

	$lastSell=returnDBObject("SELECT * FROM sells WHERE sell_buy_id IS NULL ORDER BY id DESC LIMIT 1",array());
	if(!isset($lastSell['id'])){
		$lastBuy=returnDBObject("SELECT * FROM buys ORDER BY id DESC LIMIT 1",array());
		echo 'NO SELLS, NEED TO CREATE ONE<BR>';
		echo 'EVALUATING LAST PRICE FOR BUY<BR>';
		if($lastBuy['buy_sell_id']!=''){
			echo 'NEED IMPLEMENTATION, WE\'VE TO SELL WHEN THE PRICE IS TOO HIGH FOR THE EARN';
		}else{
			if($spotPrice[$lastBuy['coin']]>=$maxPricesAverage){
				echo 'CHECKING IF PRICE IS ASCENDING MORE OR NOT<BR>';
				
				if($deltaLastHour[$lastBuy['coin']]>0 && $deltaLastFive[$lastBuy['coin']]<0){
					$accountArray=returnAccount($client,strtoupper($lastBuy['coin']));
					$actualBalance=$accountArray['balance'];
					$account=$accountArray['account'];
					$sellAmount=500;
					echo 'THIS PRICE IS A GOOD CANDIDATE, SELLING '.$sellAmount.' EUR<br>';
					/*$sell = new Sell([
					    'amount' => new Money($sellAmount, CurrencyCode::EUR),
					    'currency' => 'EUR'
					]);
					$client->createAccountSell($account, $sell);*/
					runDBQuery("INSERT INTO sells (price,amount,sell_date,balance,coin) VALUES (?,?,?,?,?)",
						array($sellPrice['eth'],$sellAmount,date('Y-m-d H:i:s'),$actualBalance,'eth'));
					
				}else{
					echo 'THE PRICE IS ASCENDING, MAYBE WE\'VE TO WAIT<BR>';
				}

			}else{
				echo 'THIS PRICE IS TOO LOW FOR SELLING<BR>';
				echo $spotPrice[$lastBuy['coin']].' EUR VS '.$maxPricesAverage.' EUR';
			}
		}
	}else{
		echo 'EVALUATING BUY<br>';
		echo 'SELL WAS '.$lastSell['amount'].' EUR AT '.$lastSell['price'].' EUR<br>';
		echo 'SELL WAS '.intervallo_completo($lastSell['sell_date']).'<br>';
		$elapsed= strtotime("now")-strtotime($lastSell['sell_date']);
		$elapsed=$elapsed/60/60;
		
		$deltaNow=$lastSell['price']-$buyPrice[$lastSell['coin']];
		echo 'DELTA WITH ACTUAL PRICE: '.$deltaNow.' EUR<br>';
		$ethSells=round(1/$lastSell['price']*$lastSell['amount'],4);
		echo strtoupper($lastSell['coin']).' SELLS: '.$ethSells.' '.strtoupper($lastSell['coin']).'<br>';
		echo 'TOTAL COMMISSIONS FOR SELL: 7.45 EUR<br>';
		$sellRemaining=$lastSell['amount']-7.45;
		echo 'EUR REMAINING: '.$sellRemaining.' EUR<br>';
		$buyingCommission=$sellRemaining/100*1.5;
		echo 'EUR COMMISSIONS FOR BUYING NOW AT 1.5%: '.$buyingCommission.' EUR<br>';
		$commissionRemaining=$sellRemaining-$buyingCommission;
		echo 'EUR REMAINING: '.$commissionRemaining.' EUR<BR>';
		$ethBuying=round(1/$buyPrice[$lastSell['coin']]*$commissionRemaining,4);
		echo 'I CAN BUY WITH THE ACTUAL CHANGE: '.$ethBuying.' '.strtoupper($lastSell['coin']).'<br>';
		$ethResult=$ethBuying-$ethSells;
		$earnExpected=0.002;
		echo 'IT WILL RESULT: '.$ethResult.' '.strtoupper($lastSell['coin']).'<BR>';
		$eurBuying=$ethResult*$spotPrice[$lastSell['coin']];
		echo 'WHICH MEANS: '.$eurBuying.' EUR<br>';

		if($elapsed>24){
			echo 'TRYING TO MINIMIZE LOSSES<br>';
			$lossAcceptable=2.5;
			$forceString=(string)$deltaNow;
			$forcePositiveDelta=floatval(substr($forceString,-1));

			if($forcePositiveDelta <= $lossAcceptable){
				echo 'WE\'VE TO BUY, THE LOSS IS NOW '.$lossAcceptable.' EUR FOR '.$lastSell['coin'].'<br>';
				$accountArray=returnAccount($client,strtoupper($lastSell['coin']));
				$actualBalance=$accountArray['balance'];
				$account=$accountArray['account'];
				$buyAmount=$commissionRemaining;
				/*$buy = new Buy([
				    'amount' => new Money($buyAmount, CurrencyCode::EUR),
				    'currency' => 'EUR'
				]);
				$client->createAccountBuy($account, $buy);*/
				$newBalance=$actualBalance+$ethBuying;
				runDBQuery("INSERT INTO buys (price,amount,buy_date,balance,coin) VALUES (?,?,?,?,?)",
					array($buyPrice[$lastSell['coin']],$buyAmount,date('Y-m-d H:i:s'),$newBalance,$lastSell['coin']));
				$lastBuy=returnDBObject("SELECT * FROM buys ORDER BY id DESC LIMIT 1",array());
				runDBQuery("UPDATE sells SET sell_buy_id=? WHERE id=?",array($lastBuy['id'],$lastSell['id']));
			}else{
				echo 'LOSS IS STILL TO HIGH';
			}
		}else{
			echo 'WE WANT TO EARN : '.$earnExpected.' ETH<BR>';
			$eurBuying=$earnExpected*$spotPrice[$lastSell['coin']];
			echo 'WHICH MEANS: '.$eurBuying.' EUR<br>';
			if($ethResult>0){
				if($ethResult>=$earnExpected){
					echo 'FUCKING YEAH WE CAN BUY NOW<br>';
					$buyAmount=$commissionRemaining;
					/*$buy = new Buy([
					    'amount' => new Money($buyAmount, CurrencyCode::EUR),
					    'currency' => 'EUR'
					]);
					$client->createAccountBuy($account, $buy);*/
					$newBalance=$actualBalance+$ethBuying;
					runDBQuery("INSERT INTO buys (price,amount,buy_date,balance,coin) VALUES (?,?,?,?,?)",
						array($buyPrice[$lastSell['coin']],$buyAmount,date('Y-m-d H:i:s'),$newBalance,'eth'));
					$lastBuy=returnDBObject("SELECT * FROM buys ORDER BY id DESC LIMIT 1",array());
					runDBQuery("UPDATE sells SET sell_buy_id=? WHERE id=?",array($lastBuy['id'],$lastSell['id']));
				}
			}else{
				echo 'WE\'RE LOSING NOW WITH ETH<br><br>';

				if($lastSell['coin']=='btc'){
					$tryChange='eth';
				}else{
					$tryChange='btc';
				}

				echo 'TRYING TO BUY '.strtoupper($tryChange).' AT '.$buyPrice[$tryChange].' WITH '.$commissionRemaining.'<BR>';
				$changeCrypto=round(1/$buyPrice[$tryChange]*$commissionRemaining,4);
				echo 'WE CAN BUY '.$changeCrypto.' '.strtoupper($tryChange).'<br>';
				$eurChange=$changeCrypto*$spotPrice[$tryChange];
				echo 'WITCH MEANS '.$eurChange.' EUR<br>';
				echo 'CHECKING '.strtoupper($tryChange).' LAST 12 HOUR PRICE: ';
				$lastPrices=returnSpotFromPeriod('now -12 hour','now',$tryChange);
				$deltaLast8Hour[$tryChange]=returnVariazione($spotPrice[$tryChange],reset($lastPrices));
				if(floatval($deltaLast8Hour[$tryChange])>0){
					echo '<BR>'.strtoupper($tryChange).' PRICE IS ASCENDING SINCE 12 HOUR';
					echo ' WAS '.reset($lastPrices).' EUR';
					$forceString=(string)$deltaLast8Hour[$tryChange];
					$forcePositiveDelta=floatval(str_replace('-','',$forceString));
					echo '<BR>THIS IS THE DELTA WITH THE SPOT PRICE '.$deltaLast8Hour[$tryChange].' ('.$forcePositiveDelta.')<br><br>';
				}else{
					echo '<BR>'.strtoupper($tryChange).' PRICE IS DESCENDING SINCE 12 HOUR';
					echo ' WAS '.reset($lastPrices).' EUR';
					$forceString=(string)$deltaLast8Hour[$tryChange];
					$forcePositiveDelta=floatval(str_replace('-','',$forceString));

					echo '<BR>THIS IS THE DELTA WITH THE SPOT PRICE '.$deltaLast8Hour[$tryChange].' ('.$forcePositiveDelta.')<br><br>';
					$lossAcceptable['eth']=2;
					$lossAcceptable['btc']=2.8;

					if($forcePositiveDelta>=$lossAcceptable[$tryChange]){
						echo 'FUCKING YEAH WE CAN BUY NOW<br>';
						$accountArray=returnAccount($client,strtoupper($tryChange));
						$actualBalance=$accountArray['balance'];
						$account=$accountArray['account'];
						$buyAmount=$commissionRemaining;
						/*$buy = new Buy([
						    'amount' => new Money($buyAmount, CurrencyCode::EUR),
						    'currency' => 'EUR'
						]);
						$client->createAccountBuy($account, $buy);*/
						$newBalance=$actualBalance+$changeCrypto;
						runDBQuery("INSERT INTO buys (price,amount,buy_date,balance,coin,buy_sell_id) VALUES (?,?,?,?,?,?)",
							array($buyPrice[$tryChange],$buyAmount,date('Y-m-d H:i:s'),$newBalance,$tryChange,$lastSell['id']));
						$lastBuy=returnDBObject("SELECT * FROM buys ORDER BY id DESC LIMIT 1",array());
						runDBQuery("UPDATE sells SET sell_buy_id=? WHERE id=?",array($lastBuy['id'],$lastSell['id']));
					}else{
						echo 'THE PRICE IS TOO HIGH FOR BUY';
					}
				}
			}
		}
	}

?>
