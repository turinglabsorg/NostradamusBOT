<?php	
	//error_reporting(E_ALL); ini_set('display_errors', 'On'); 
	header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: *");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    header("Content-Type: application/json");
    
    //declarations
	require_once('connect.php');
	include('core.php');
	include('classes/api.class.php');
	include('classes/users.class.php');
	include('classes/prices.class.php');
	include('classes/rules.class.php');
	include('classes/wallets.class.php');

	try {
		if(isset($_GET['area'])){
			$requestAngular=json_decode(file_get_contents('php://input'),1);
			switch ($_GET['area']) {
				case 'users':
					$API = new UsersAPI($requestAngular, $_SERVER['REQUEST_URI']);
				break;
				case 'prices':
					$API = new PricesAPI($requestAngular, $_SERVER['REQUEST_URI']);
				break;
				case 'rules':
					$API = new RulesAPI($requestAngular, $_SERVER['REQUEST_URI']);
				break;
				case 'wallets':
					$API = new WalletsAPI($requestAngular, $_SERVER['REQUEST_URI']);
				break;
			}
		}else{
	    	$API = new DefaultAPI($requestAngular, $_SERVER['REQUEST_URI']);
		}
	    echo $API->processAPI();
	} catch (Exception $e) {
	    echo json_encode(Array('error' => $e->getMessage()));
	}

?>