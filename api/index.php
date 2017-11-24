<?php	
	error_reporting(E_ALL); ini_set('display_errors', 'On'); 
	header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: *");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    header("Content-Type: application/json");
    
    //declarations
	require_once('connect.php');
	include('core.php');
	include('classes/class.phpmailer.php');
	include('classes/class.smtp.php');
	include('classes/api.class.php');
	include('classes/users.class.php');
	include('classes/prices.class.php');
	include('classes/rules.class.php');
	include('classes/wallets.class.php');
	include('classes/actions.class.php');
	include('classes/miners.class.php');
	include('vendor/autoload.php');
	
	try {
		if(isset($_GET['area'])){
			$check_angular=json_decode(file_get_contents('php://input'),1);
			if(is_array($check_angular)){
				$isAngular='Y';
				$server_request=json_decode(file_get_contents('php://input'),1);
			}else{
				$isAngular='N';
				$server_request=$_REQUEST['request'];
			}
			switch ($_GET['area']) {
				case 'users':
					$API = new UsersAPI($server_request, $_SERVER['REQUEST_URI'], $isAngular);
				break;
				case 'prices':
					$API = new PricesAPI($server_request, $_SERVER['REQUEST_URI'], $isAngular);
				break;
				case 'rules':
					$API = new RulesAPI($server_request, $_SERVER['REQUEST_URI'], $isAngular);
				break;
				case 'wallets':
					$API = new WalletsAPI($server_request, $_SERVER['REQUEST_URI'], $isAngular);
				break;
				case 'actions':
					$API = new ActionsAPI($server_request, $_SERVER['REQUEST_URI'], $isAngular);
				break;
				case 'miners':
					$API = new MinersAPI($server_request, $_SERVER['REQUEST_URI'], $isAngular);
				break;
			}
		}else{
	    	$API = new DefaultAPI($server_request, $_SERVER['REQUEST_URI']);
		}
	    echo $API->processAPI();
	} catch (Exception $e) {
	    echo json_encode(Array('error' => $e->getMessage()));
	}

?>