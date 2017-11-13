<?php	
	error_reporting(E_ALL); ini_set('display_errors', 'On'); 
	header("Access-Control-Allow-Orgin: *");
    header("Access-Control-Allow-Methods: *");
    header("Content-Type: application/json");
    
    //declarations
	require_once('connect.php');
	include('core.php');
	include('api.class.php');
	//
	
	//zcvY59zL2MvZ4NnZzd3cl5SaqQ==
	
	try {
	    $API = new MyAPI($_REQUEST['request'], $_SERVER['HTTP_ORIGIN']);
	    echo $API->processAPI();
	} catch (Exception $e) {
	    echo json_encode(Array('error' => $e->getMessage()));
	}

?>