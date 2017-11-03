<?php
	error_reporting(E_ALL); ini_set('display_errors', 'On');
	include('vendor/autoload.php');
	include('connect_btc.php');
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
	
    /*STORING SPOT PRICE*/
        $buy_object = $client->getSpotPrice('BTC-EUR');
        $spot_price =  (array) $buy_object;
         
        $i=0;
        foreach($spot_price as $val){
            if($i==0){
                $spotPrice=$val;
            }
            $i++;
        }
        $sellPrice=$spotPrice-1.7;
        $buyPrice=$spotPrice+1.7;
        echo 'BTC SPOT PRICE '.$spotPrice.' EUR<br>';
		echo 'BTC SELL PRICE '.$sellPrice.' EUR<br>';
        echo 'BTC BUY PRICE '.$buyPrice.' EUR<br><br>';
        runDBQuery("INSERT INTO prices (price,currency,price_type,price_update) VALUES (?,?,?,?)",
            array($spotPrice,'EUR','SPOT',date('Y-m-d H:i:s')));

    /*STORING SPOT PRICE*/
	
	/*TROVO ACCOUNT BTC*/
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
						if($value=='BTC'){
							$accountFound='Y';
						}
					}
					if($i==8 && $accountFound=='Y'){
						$BTCID=$value;
					}
					if($i==11 && $accountFound=='Y'){
						$balance=(array) $value;
						$actualBalance= $balance['balance']['amount'];
					}
					$i++;
				}
			}
		}
		$account = $client->getAccount($BTCID);
	/*TROVO ACCOUNT BTC*/

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
		),
		array(
			"start" =>'now -6 hour',
			"end" => 'now -5 hour'
		),
		array(
			"start" =>'now -7 hour',
			"end" => 'now -6 hour'
		),
		array(
			"start" =>'now -8 hour',
			"end" => 'now -7 hour'
		)
	);
	$maxPricesAverage=0;
	$maxPricesCount=0;
	$minPricesAverage=0;
	$minPricesCount=0;

	foreach($periods as $period){
		echo 'EVALUATING PERIOD: '.str_replace('NOW ','',strtoupper($period['start'])).' '.str_replace('NOW ','',strtoupper($period['end'])).'<br>';
		$prices=returnPricesFromPeriod($period['start'],$period['end']);
		echo 'AVERAGE PRICE: '.round($prices['average'],2).' '.'EUR<br>';
		echo 'PRICE MIN: '.$prices['pricemin'].' EUR<br>';
		echo 'PRICE MAX: '.$prices['pricemax'].' EUR<br>';
		echo 'DELTA: '.$prices['delta'].' EUR<br><br>';
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

	echo 'PRICE MAX AVERAGE LAST 12H: '.$maxPricesAverage.' EUR<br>';
	echo 'PRICE MIN AVERAGE LAST 12H: '.$minPricesAverage.' EUR<br>';
	echo 'DELTA AVERAGE LAST 12H: '.$deltaPricesAverage.' EUR<br><br>';

	echo 'LAST 5 MINUTES PRICES: ';
	$lastMinutesPrices=returnSpotFromPeriod('now -5 minute','now');
	foreach($lastMinutesPrices as $lastMinutesPrice){
		echo $lastMinutesPrice.' ';
	}
	$deltaLastFive=returnVariazione($spotPrice,reset($lastMinutesPrices));

	echo '<BR>THIS IS THE DELTA WITH THE SPOT PRICE '.$deltaLastFive.'<br><br>';
	$lastSell=returnDBObject("SELECT * FROM sells WHERE sell_buy_id IS NULL ORDER BY id DESC LIMIT 1",array());
	if(!isset($lastSell['id'])){
		echo 'NO SELLS, NEED TO CREATE ONE<BR>';
		echo 'EVALUATING LAST PRICE FOR BUY<BR>';
		
		if($spotPrice>=$maxPricesAverage){
			echo 'SIMLUATING BUY WITH AVERAGE LOW PRICE<BR>';
			$sellAmount=500;
			$hipBuyPrice=$minPricesAverage+1.7;
			$deltaNow=$sellAmount-$hipBuyPrice;
			$btcSells=round(1/$sellPrice*$sellAmount,4);
			$sellRemaining=$sellAmount-7.45;
			$buyingCommission=$sellRemaining/100*1.5;
			$commissionRemaining=$sellRemaining-$buyingCommission;
			$btcBuying=round(1/$hipBuyPrice*$commissionRemaining,4);
			$btcResult=$btcBuying-$btcSells;

			if($btcResult>0){
				echo 'THIS PRICE IS A GOOD CANDIDATE, SELLING '.$sellAmount.' EUR<br>';
				/*$sell = new Sell([
				    'amount' => new Money($sellAmount, CurrencyCode::EUR),
				    'currency' => 'EUR'
				]);
				$client->createAccountSell($account, $sell);*/
				runDBQuery("INSERT INTO sells (price,amount,sell_date,btc_balance) VALUES (?,?,?,?)",
					array($sellPrice,$sellAmount,date('Y-m-d H:i:s'),$actualBalance));
			}else{
				echo 'THE AVERAGE DELTA OF THE LAST PERIOD IS TOO LOW, THE RISK IS TOO HIGH.';
			}

		}else{
			echo 'THIS PRICE IS TOO LOW FOR SELLING';
		}
	}else{
		echo 'EVALUATING BUY<br>';
		echo 'SELL WAS '.$lastSell['amount'].' EUR AT '.$lastSell['price'].' EUR<br>';
		echo 'SELL WAS '.intervallo_completo($lastSell['sell_date']).'<br>';
		$elapsed= strtotime("now")-strtotime($lastSell['sell_date']);
		$elapsed=$elapsed/60/60;
		
		$deltaNow=$lastSell['price']-$buyPrice;
		echo 'DELTA WITH ACTUAL PRICE: '.$deltaNow.' EUR<br>';
		$btcSells=round(1/$lastSell['price']*$lastSell['amount'],4);
		echo 'BTC SELLS: '.$btcSells.' BTC<br>';
		echo 'TOTAL COMMISSIONS FOR SELL: 7.45 EUR<br>';
		$sellRemaining=$lastSell['amount']-7.45;
		echo 'EUR REMAINING: '.$sellRemaining.' EUR<br>';
		$buyingCommission=$sellRemaining/100*1.5;
		echo 'EUR COMMISSIONS FOR BUYING NOW AT 1.5%: '.$buyingCommission.' EUR<br>';
		$commissionRemaining=$sellRemaining-$buyingCommission;
		echo 'EUR REMAINING: '.$commissionRemaining.' EUR<BR>';
		$btcBuying=round(1/$buyPrice*$commissionRemaining,4);
		echo 'I CAN BUY WITH THE ACTUAL CHANGE: '.$btcBuying.' BTC<br>';
		$btcResult=$btcBuying-$btcSells;
		$earnExpected=0.002;
		echo 'IT WILL RESULT: '.$btcResult.' BTC<BR>';
		$eurBuying=$btcResult*$spotPrice;
		echo 'WHICH MEANS: '.$eurBuying.' EUR<br>';

		if($elapsed>24){
			echo 'TRYING TO MINIMIZE LOSSES<br>';
			$lossAcceptable=50;
			$forceString=(string)$deltaNow;
			$forcePositiveDelta=floatval(substr($forceString,-1));

			if($forcePositiveDelta <= $lossAcceptable){
				echo 'WE\'VE TO BUY, THE LOSS IS NOW '.$lossAcceptable.' EUR FOR BTC<br>';
				$buyAmount=$commissionRemaining;
				$buy = new Buy([
				    'amount' => new Money($buyAmount, CurrencyCode::EUR),
				    'currency' => 'EUR'
				]);
				$client->createAccountBuy($account, $buy);
				$newBalance=$actualBalance+$btcBuying;
				runDBQuery("INSERT INTO buys (price,amount,buy_date,btc_balance) VALUES (?,?,?,?)",
					array($buyPrice,$buyAmount,date('Y-m-d H:i:s'),$newBalance));
				$lastBuy=returnDBObject("SELECT * FROM buys ORDER BY id DESC LIMIT 1",array());
				runDBQuery("UPDATE sells SET sell_buy_id=? WHERE id=?",array($lastBuy['id'],$lastSell['id']));
			}else{
				echo 'LOSS IS STILL TO HIGH';
			}
		}else{
			echo 'WE WANT TO EARN : '.$earnExpected.' BTC<BR>';
			$eurBuying=$earnExpected*$spotPrice;
			echo 'WHICH MEANS: '.$eurBuying.' EUR<br>';
			if($btcResult>0){
				if($btcResult>=$earnExpected){
					echo 'FUCKING YEAH WE CAN BUY NOW<br>';
					$buyAmount=$commissionRemaining;
					/*$buy = new Buy([
					    'amount' => new Money($buyAmount, CurrencyCode::EUR),
					    'currency' => 'EUR'
					]);
					$client->createAccountBuy($account, $buy);*/
					$newBalance=$actualBalance+$btcBuying;
					runDBQuery("INSERT INTO buys (price,amount,buy_date,btc_balance) VALUES (?,?,?,?)",
						array($buyPrice,$buyAmount,date('Y-m-d H:i:s'),$newBalance));
					$lastBuy=returnDBObject("SELECT * FROM buys ORDER BY id DESC LIMIT 1",array());
					runDBQuery("UPDATE sells SET sell_buy_id=? WHERE id=?",array($lastBuy['id'],$lastSell['id']));
				}
			}
		}
	}

?>
