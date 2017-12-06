<?php

/*TRACKING FUNCTIONS*/
function detect_ie(){
	if (isset($_SERVER['HTTP_USER_AGENT']) && 
		(strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false))
			return '1';
		else
			return '0';
}
function getUserIp(){
	 if (!empty($_SERVER['HTTP_CLIENT_IP'])){
	 	$ip=$_SERVER['HTTP_CLIENT_IP'];
	 }elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
		$ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
	 }else{
	 	$ip=$_SERVER['REMOTE_ADDR'];
	 }
	 return $ip;
 }
function getUserStats(){
	 $browser = get_browser(null, true);
	 $referrer = @$HTTP_REFERER;
	 $ip=getUserIp();
 }
function returnConnectivityStat(){
	if(($_SERVER["REMOTE_ADDR"]=='127.0.0.1')||($_SERVER["REMOTE_ADDR"]=='::1')){
		$mode='offline';
	}else{	
		$mode='online';
	}
	return $mode;
}
/*TRACKING FUNCTIONS*/

/*PASSWORD FUNCTIONS*/
function generate_pwd(){
	
	$length=15;
	$strength=8;

	$vowels = 'aeuy';
	$consonants = 'bdghjmnpqrstvz';
	if ($strength & 1) {
		$consonants .= 'BDGHJLMNPQRSTVWXZ';
	}
	if ($strength & 2) {
		$vowels .= "AEUY";
	}
	if ($strength & 4) {
		$consonants .= '23456789';
	}
	if ($strength & 8) {
		$consonants .= '@#$%';
	}
 
	$password = '';
	$alt = time() % 2;
	for ($i = 0; $i < $length; $i++) {
		if ($alt == 1) {
			$password .= $consonants[(rand() % strlen($consonants))];
			$alt = 0;
		} else {
			$password .= $vowels[(rand() % strlen($vowels))];
			$alt = 1;
		}
	}

	return $password;		
}
function strToStar($password){
	
	$ln=strlen($password);
	
	for($i=0; $i<=$ln; $i++){
		echo '*';	
	}
	
}
/*PASSWORD FUNCTIONS*/

/*GEO FUNCTIONS*/
function getCoordinates($address){
 	$address = str_replace(" ", "+", $address); 
 	$url = "http://maps.google.com/maps/api/geocode/json?sensor=false&address=$address";
 	$response = file_get_contents($url);
 	$json = json_decode($response,TRUE);
 	if( ($json['results'][0]['geometry']['location']['lat']!='')&&($json['results'][0]['geometry']['location']['lng']!='') ){
 		return ($json['results'][0]['geometry']['location']['lat'].",".$json['results'][0]['geometry']['location']['lng']); 
 	}else{
	 	return 'NONE';
 	}
}
/*GEO FUNCTIONS*/

/*CRYPT FUNCTIONS*/
function encryptText($text){
     
    return atom_crypt($text, 'encrypt');
         
    }
function decryptText($text){

      return  atom_crypt($text, 'decrypt');
        
    }
function encryptPassword($text){
	$password=hash('sha512', $text);
	return $password;
}
function atom_crypt($string, $action = 'encrypt'){
            $res = '';
            if($action !== 'encrypt'){
                $string = base64_decode($string);
            } 
            for( $i = 0; $i < strlen($string); $i++){
                    $c = ord(substr($string, $i));
                    if($action == 'encrypt'){
                        $c += ord(substr(salt, (($i + 1) % strlen(salt))));
                        $res .= chr($c & 0xFF);
                    }else{
                        $c -= ord(substr(salt, (($i + 1) % strlen(salt))));
                        $res .= chr(abs($c) & 0xFF);
                    }
            }
            if($action == 'encrypt'){
                $res = base64_encode($res);
            } 
            
            return $res;
        
    }
function intero($v){//per essere sicuro che i valori per mktime siano degli interi 
        return (int)$v; 
    } 
/*CRYPT FUNCTIONS*/

/*CALC FUNCTIONS*/
function returnVariazione($first,$second){
		if(($second!='')&&($second!=0)){
			$variazione=$first/$second*100; 	
			return round($variazione-100,2).'%';
		}else{
			return 'NdN';
		}
	}
function returnPercentuale($first,$second){
		if($second!=''){
			$variazione=$first/$second*100; 	
			return round($variazione,2).'%';
		}else{
			return 'NaN';
		}
	}
function fixFloat($number){
	return str_replace(',','.',$number);
}
/*CALC FUNCTIONS*/

/*TIME FUNCTIONS*/
function intervallo($data){ 
    //LA DATA DEVE ESSERE IN FORMATO Y m d (anno mese giorno) con o senza H i s 
    //indipendente dagli usuali separatori 
    //riduco la data ad un solo separatore 
    $pat=array('/ /','/\//','/:/','/\./');//separatori più comuni 
    $data=preg_replace($pat, '-', $data); 
    $d=explode("-", $data);//$d[0]=>"Y", $d[1]=>"m",$d[2]=>"d",$d[3]=>"H",$d[4]=>"i",$d[5]=>"s" 
    $d=array_map("intero",$d); 
    //qui si potrebbero mettere delle verifiche sulla correttezza della data 
    //soprattutto se la data proviene da un campo di input di un form es. 
    if(!checkdate($d[1],$d[2],$d[0])){ 
        return ""; 
    } 
    //potrebbero comunque mancare uno o piu dei H:i:s 
    //comunque li forzo 
    if(!isset($d[3]) || ($d[3]<0 || $d[3]>23)){$d[3]=0;} 
    if(!isset($d[4]) || ($d[4]<0 || $d[4]>59)){$d[4]=0;} 
    if(!isset($d[5]) || ($d[5]<0 || $d[5]>59)){$d[5]=0;} 
    //trasformo la data in timestamp 
    $data=mktime($d[3],$d[4],$d[5],$d[1],$d[2],$d[0]); 
    $data_ora=time();//data attuale in timestamp 
    //si potrebbe mettere la verifica se $delta è maggiore o minore di zero 
    //in modo da avere o "passate" o "mancano" 
    $quando= " da "; 
    $delta=$data_ora-$data;//intervallo 
    if($delta < 0){$quando = " tra ";} 
    $delta=abs($delta); 
    //calcolo giorni 
    $giorni=(int)($delta/(24*3600)); 
    $avanzo=$delta%(24*3600);//resto in secondi 
    //calcolo ore 
    $ore=(int)($avanzo/3600); 
    $avanzo=$avanzo%3600;//resto in secondi 
    //calcolo minuti 
    $minuti=(int)($avanzo/60); 
    //se trascorso meno di un minuto dico adesso 
    if($giorni==o && $ore==0 && $minuti==0){ 
        return " adesso "; 
    } 
    $passato=""; 
    if($giorni > 0){ 
        $passato.=" $giorni giorni "; 
    }else{
	    $passato.=" meno di un giorno";
    }
    /*if($ore > 0){ 
        $passato.=" $ore<sup>h</sup> "; 
    } 
    if($minuti > 0){ 
        $passato.=" $minuti<sup>m</sup> "; 
    } */
    return " $quando ".$passato; 
} 
function intervallo_int($data){ 
    //LA DATA DEVE ESSERE IN FORMATO Y m d (anno mese giorno) con o senza H i s 
    //indipendente dagli usuali separatori 
    //riduco la data ad un solo separatore 
    $pat=array('/ /','/\//','/:/','/\./');//separatori più comuni 
    $data=preg_replace($pat, '-', $data); 
    $d=explode("-", $data);//$d[0]=>"Y", $d[1]=>"m",$d[2]=>"d",$d[3]=>"H",$d[4]=>"i",$d[5]=>"s" 
    $d=array_map("intero",$d); 
    //qui si potrebbero mettere delle verifiche sulla correttezza della data 
    //soprattutto se la data proviene da un campo di input di un form es. 
    if(!checkdate($d[1],$d[2],$d[0])){ 
        return ""; 
    } 
    //potrebbero comunque mancare uno o piu dei H:i:s 
    //comunque li forzo 
    if(!isset($d[3]) || ($d[3]<0 || $d[3]>23)){$d[3]=0;} 
    if(!isset($d[4]) || ($d[4]<0 || $d[4]>59)){$d[4]=0;} 
    if(!isset($d[5]) || ($d[5]<0 || $d[5]>59)){$d[5]=0;} 
    //trasformo la data in timestamp 
    $data=mktime($d[3],$d[4],$d[5],$d[1],$d[2],$d[0]); 
    $data_ora=time();//data attuale in timestamp 
    //si potrebbe mettere la verifica se $delta è maggiore o minore di zero 
    //in modo da avere o "passate" o "mancano" 
    $quando= " da "; 
    $delta=$data_ora-$data;//intervallo 
    if($delta < 0){$quando = " tra ";} 
    $delta=abs($delta); 
    //calcolo giorni 
    $giorni=(int)($delta/(24*3600)); 
    $avanzo=$delta%(24*3600);//resto in secondi 
    //calcolo ore 
    $ore=(int)($avanzo/3600); 
    $avanzo=$avanzo%3600;//resto in secondi 
    //calcolo minuti 
    $minuti=(int)($avanzo/60); 
    //se trascorso meno di un minuto dico adesso 
    if($giorni==0 && $ore==0 && $minuti==0){ 
        return " adesso "; 
    } 
    $passato=""; 
    if($giorni > 0){ 
        $passato.=" $giorni"; 
    }else{
	    $passato.="0";
    }
    /*if($ore > 0){ 
        $passato.=" $ore<sup>h</sup> "; 
    } 
    if($minuti > 0){ 
        $passato.=" $minuti<sup>m</sup> "; 
    } */
    return $passato; 
} 
function intervallo_completo($data){ 
    //LA DATA DEVE ESSERE IN FORMATO Y m d (anno mese giorno) con o senza H i s 
    //indipendente dagli usuali separatori 
    //riduco la data ad un solo separatore 
    $pat=array('/ /','/\//','/:/','/\./');//separatori più comuni 
    $data=preg_replace($pat, '-', $data); 
    $d=explode("-", $data);//$d[0]=>"Y", $d[1]=>"m",$d[2]=>"d",$d[3]=>"H",$d[4]=>"i",$d[5]=>"s" 
    $d=array_map("intero",$d); 
    //qui si potrebbero mettere delle verifiche sulla correttezza della data 
    //soprattutto se la data proviene da un campo di input di un form es. 
    if(!checkdate($d[1],$d[2],$d[0])){ 
        return ""; 
    } 
    //potrebbero comunque mancare uno o piu dei H:i:s 
    //comunque li forzo 
    if(!isset($d[3]) || ($d[3]<0 || $d[3]>23)){$d[3]=0;} 
    if(!isset($d[4]) || ($d[4]<0 || $d[4]>59)){$d[4]=0;} 
    if(!isset($d[5]) || ($d[5]<0 || $d[5]>59)){$d[5]=0;} 
    //trasformo la data in timestamp 
    $data=mktime($d[3],$d[4],$d[5],$d[1],$d[2],$d[0]); 
    $data_ora=time();//data attuale in timestamp 
    //si potrebbe mettere la verifica se $delta è maggiore o minore di zero 
    //in modo da avere o "passate" o "mancano" 
    $quando= " da "; 
    $delta=$data_ora-$data;//intervallo 
    if($delta < 0){$quando = " tra ";} 
    $delta=abs($delta); 
    //calcolo giorni 
    $giorni=(int)($delta/(24*3600)); 
    $avanzo=$delta%(24*3600);//resto in secondi 
    //calcolo ore 
    $ore=(int)($avanzo/3600); 
    $avanzo=$avanzo%3600;//resto in secondi 
    //calcolo minuti 
    $minuti=(int)($avanzo/60); 
    //se trascorso meno di un minuto dico adesso 
    if($giorni==0 && $ore==0 && $minuti==0){ 
        return " adesso "; 
    } 
    $passato=""; 
    if($giorni > 0){ 
	   	$passato.=" $giorni<sup>g</sup>  "; 	
    }
    if($ore > 0){ 
        $passato.=" $ore<sup>h</sup> "; 
    } 
    if($minuti > 0){ 
        $passato.=" $minuti<sup>m</sup> "; 
    } 
    return $passato; 
} 
function returnDaysRemaning($first, $last){
	$date1 = new DateTime($first);
	$date2 = new DateTime($last);
					
	$diff = $date2->diff($date1)->format("%a");
	
	return $diff;
}
function data_it($data){
	$data_ex=explode('-',$data);
	return $data_ex[2].'.'.$data_ex[1].'.'.$data_ex[0];
}
function data_month_it($data){
	$data_ex=explode('-',$data);
	return $data_ex[2].' '.month_it($data_ex[1]).' '.$data_ex[0];
}
function data_month_day_it($data){
	$data_ex=explode('-',$data);
	$dateW=date('l',strtotime($data));
	
	echo day_it($dateW).' '.$data_ex[2].' ';
	echo ' '.month_it($data_ex[1]);
}
function returnDayMonth($data){
	$data_ex=explode('/',$data);
	return $data_ex[0].' '.month_short_it($data_ex[1]);
}
function month_it($month){
$month=strval($month);
	 switch ($month) {
		 case '01':
		 	$ret= 'Gennaio';
		 break; 
		 case '02':
		 	$ret= 'Febbraio';
		 break; 
		 case '03':
		 	$ret= 'Marzo';
		 break; 
		 case '04':
		 	$ret= 'Aprile';
		 break; 
		 case '05':
		 	$ret= 'Maggio';
		 break; 
		 case '06':
		 	$ret= 'Giugno';
		 break; 
		 case '07':
		 	$ret= 'Luglio';
		 break; 
		 case '08':
		 	$ret= 'Agosto';
		 break; 
		 case '09':
		  	$ret= 'Settembre';
		 break; 
		 case '10':
		 	$ret= 'Ottobre';
		 break; 
		 case '11':
		 	$ret= 'Novembre';
		 break; 
		 case '12':
		 	$ret= 'Dicembre';
		 break;    
	}
	return $ret;
}
function month_short_it($month){
$month=strval($month);
	 switch ($month) {
		 case '01':
		 	return 'GEN';
		 break; 
		 case '02':
		 	return 'FEB';
		 break; 
		 case '03':
		 	return 'MAR';
		 break; 
		 case '04':
		 	return 'APR';
		 break; 
		 case '05':
		 	return 'MAG';
		 break; 
		 case '06':
		 	return 'GIU';
		 break; 
		 case '07':
		 	return 'LUG';
		 break; 
		 case '08':
		 	return 'AGO';
		 break; 
		 case '09':
		  	return 'SET';
		 break; 
		 case '10':
		 	return 'OTT';
		 break; 
		 case '11':
		 	return 'NOV';
		 break; 
		 case '12':
		 	return 'DIC';
		 break;    
}
}
function datetime_it($data){
	$data_ex=explode(' ',$data);
	$data_d=explode('-',$data_ex[0]);
	return $data_d[2].'/'.$data_d[1].'/'.$data_d[0].' > '.$data_ex[1];
}
function day_it($day){
	 switch ($day) {
		 case 'Sunday':
		 	return 'Domenica';
		 break; 
		 case 'Monday':
		 	return 'Luned&iacute;';
		 break; 
		 case 'Tuesday':
		 	return 'Marted&iacute;';
		 break; 
		 case 'Wednesday':
		 	return 'Mercoled&iacute;';
		 break; 
		 case 'Thursday':
		 	return 'Gioved&iacute;';
		 break; 
		 case 'Friday':
		 	return 'Venerd&iacute;';
		 break; 
		 case 'Saturday':
		 	return 'Sabato';
		 break;  
}
}
function data_store($dataToStore){
	if($dataToStore!=''){
		$data=explode('/',$dataToStore);
		return $data[2].'-'.$data[1].'-'.$data[0];
	}
}
function datetime_store($dataToStore){
	if($dataToStore!=''){
	 $data_ora=explode(' ',$dataToStore);
	 $data=explode('/',$data_ora[0]);
	 
	 return $data[2].'-'.$data[1].'-'.$data[0].' '.$data_ora[1];
	 }
}
function data_store_print($dataToStore){
	if($dataToStore!=''){
		$data=explode('-',$dataToStore);
		return $data[2].'/'.$data[1].'/'.$data[0];
	}
}
function datetime_store_print($dataToStore){
	 $data_ora=explode(' ',$dataToStore);
	 $data=explode('-',$data_ora[0]);
	 
	 return $data[2].'/'.$data[1].'/'.$data[0].' '.$data_ora[1];
}
/*TIME FUNCTIONS*/

/*STRING MANIPULATION*/
function sanitize($string, $force_lowercase = true, $anal = false) {
				$strip = array("~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "=", "+", "[", "{", "]",
							   "}", "\\", "|", ";", ":", "\"", "'", "&#8216;", "&#8217;", "&#8220;", "&#8221;", "&#8211;", "&#8212;",
							   "â€”", "â€“", ",", "<", ">", "/", "?");
				$clean = trim(str_replace($strip, "", strip_tags($string)));
				$clean = preg_replace('/\s+/', "-", $clean);
				$clean = ($anal) ? preg_replace("/[^a-zA-Z0-9]/", "", $clean) : $clean ;
				return ($force_lowercase) ?
					(function_exists('mb_strtolower')) ?
						mb_strtolower($clean, 'UTF-8') :
						strtolower($clean) :
					$clean;
			}
function cleanText($str){

$str = str_replace("Ñ" ,"&#209;", $str);
$str = str_replace("ñ" ,"&#241;", $str);
$str = str_replace("ñ" ,"&#241;", $str);
$str = str_replace("Á","&#193;", $str);
$str = str_replace("á","&#225;", $str);
$str = str_replace("à","&agrave;", $str);
$str = str_replace("É","&#201;", $str);
$str = str_replace("é","&#233;", $str);
$str = str_replace("ú","&#250;", $str);
$str = str_replace("ù","&#249;", $str);
$str = str_replace("Í","&#205;", $str);
$str = str_replace("í","&#237;", $str);
$str = str_replace("Ó","&#211;", $str);
$str = str_replace("ó","&#243;", $str);
$str = str_replace("“","&#8220;", $str);
$str = str_replace("”","&#8221;", $str);

$str = str_replace("‘","&#8216;", $str);
$str = str_replace("’","&#8217;", $str);
$str = str_replace("—","&#8212;", $str);

$str = str_replace("–","&#8211;", $str);
$str = str_replace("™","&trade;", $str);
$str = str_replace("ü","&#252;", $str);
$str = str_replace("Ü","&#220;", $str);
$str = str_replace("Ê","&#202;", $str);
$str = str_replace("ê","&#238;", $str);
$str = str_replace("Ç","&#199;", $str);
$str = str_replace("ç","&#231;", $str);
$str = str_replace("È","&#200;", $str);
$str = str_replace("è","&#232;", $str);
$str = str_replace("•","&#149;" , $str);

$str = str_replace("¼","&#188;" , $str);
$str = str_replace("½","&#189;" , $str);
$str = str_replace("¾","&#190;" , $str);
$str = str_replace("½","&#189;" , $str);

return $str;

}
function print_money($number,$currency){
	if($number!=''){
		$number=round($number,2);
		//return str_replace('EUR ','',money_format('%.'.$decimal.'n',$number)).'&euro;';
		if($currency=='EUR'){
			return number_format($number, 2, ',', '.').'&euro;';
		}else{
			return number_format($number, 2, ',', '.').' '.$currency;
		}
	}else{
		return '0,00'.' &euro;';
	}
}
function clean($str) {
	$clean = preg_replace("/[^a-zA-Z0-9\/_|+. -]/", '', $str);
	$clean = strtolower(trim($clean, '-'));
	$clean = preg_replace("/[\/_|+ -]+/", '-', $clean);

	return $clean;
}
function toAscii($str) {
	$str=str_replace('.','-',$str);
	$clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', trim($str));
	$clean = strtolower(trim($clean, '-'));
	$clean = preg_replace("/[\/_|+ -]+/", '-', $clean);

	return $clean;
}
function deAscii($str) {
	$clean=str_replace('-',' ', $str);
	return $clean;
}
/*STRING MANIPULATION*/

/*FILES MANIPULATION*/
function deleteDir($dirPath) {
    if (! is_dir($dirPath)) {
        throw new InvalidArgumentException("$dirPath must be a directory");
    }
    if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
        $dirPath .= '/';
    }
    $files = glob($dirPath . '*', GLOB_MARK);
    foreach ($files as $file) {
        if (is_dir($file)) {
            deleteDir($file);
        } else {
            unlink($file);
        }
    }
    rmdir($dirPath);
}
function correctEncFilename($name){
	return str_replace('/','#',$name);
}
function correctDecFilename($name){
	return str_replace('#','/',$name);
}
function dirToArray($dir) { 
   $result = array(); 
   $cdir = scandir($dir); 
   foreach ($cdir as $key => $value) { 
      if (!in_array($value,array(".",".."))){ 
         if (is_dir($dir . DIRECTORY_SEPARATOR . $value)){ 
            $result[$value] = dirToArray($dir . DIRECTORY_SEPARATOR . $value); 
         } 
         else{ 
            $result[] = $value; 
         } 
      } 
   } 
	   
   return $result;	
} 
/*FILES MANIPULATION*/

/*ARRAY MANIPULATION*/
function aasort (&$array, $key) {
    $sorter=array();
    $ret=array();
    $i=0;
    reset($array);
    foreach ($array as $ii => $va) {
        $sorter[$ii]=$va[$key];
    }
    asort($sorter);
    foreach ($sorter as $ii => $va) {
        $ret[$i]=$array[$ii];
        $i++;
    }
    $array=$ret;
}
function aarsort (&$array, $key) {
    $sorter=array();
    $ret=array();
    $i=0;
    reset($array);
    foreach ($array as $ii => $va) {
        $sorter[$ii]=$va[$key];
    }
    arsort($sorter);
    foreach ($sorter as $ii => $va) {
        $ret[$i]=$array[$ii];
        $i++;
    }
    $array=$ret;
}
/*ARRAY MANIPULATION*/

/*USER FUNCTIONS*/
function getLevelName($valore){
	switch ($valore){
		case 1:
			echo "Cliente";
		break;
		case 2:
			echo "Amministratore";
		break;
		case 5:
			echo "Super Amministratore";
		break;
	}
}
function getUserLevel($valore){
	switch ($valore){
		case "CLIENT":
			return 1;
		break;
		case "ADMIN":
			return 2;
		break;
		case "SUPERUSER":
			return 5;
		break;
	}
}
/*USER FUNCTIONS*/

/*MAIL FUNCTIONS*/
function returnMailTextHTML($testo,$titolo){
$mailHTML='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
			<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
			<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
			<title>'.$titolo.'</title>
			<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
			</head>
			<body style="margin: 0; padding: 0;">
				<table border="0" cellpadding="0" cellspacing="0" width="100%">	
					<tr>
						<td style="padding: 10px 0 30px 0;">
							<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
								<tr>
									<td align="center" style="">
										<img src="https://api.nostradamusbot.com/assets/headerMail.jpg" width="100%" style="display: block;" />
									</td>
								</tr>
								<tr>
									<td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
										<table border="0" cellpadding="0" cellspacing="0" width="100%">';
								
								if($titolo!=''){
								$mailHTML.='<tr>
												<td style="color: #153643; font-family: Arial, sans-serif; font-size: 20px;">
													<b>'.$titolo.'</b>
												</td>
											</tr>';
											}
											
							$mailHTML.='		<tr>
												<td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px;">'.$testo.'
												
												</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td bgcolor="#000000" style="padding: 30px 30px 30px 30px;">
										<table border="0" cellpadding="0" cellspacing="0" width="100%">
											<tr>
												<td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
													Nostradamus<br/>
												</td>
												<td align="right" width="25%">
													
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</body>
</html>';

return $mailHTML;
}
function sendMail($from, $to,  $object, $text){
	$mail= new PHPMailer();
	$mail->CharSet="UTF-8";
	$mail->SetFrom($from['email'], $from['name']);
	$mail->AddAddress($to['email'], $to['name']);
	$mail->AddReplyTo($to['email'], $to['name']);
	$mail->Subject  = $object;
	$mail->MsgHTML(returnMailTextHTML($text, $object));
	$mail->Send(); 
}
/*MAIL FUNCTIONS*/

/*DB FUNCTIONS*/
function returnDBObject($db,$queryString,$params,$forceArray=0){
	switch($db){
		case "app":
			$pdo = new PDO("mysql:host=".hostname_app.";dbname=".database_app, username_app, password_app);
		break;
		case "prices":
			$pdo = new PDO("mysql:host=".hostname_prices.";dbname=".database_prices, username_prices, password_prices);
		break;
	}
	$pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
	$query=$pdo->prepare($queryString);
	$resArray=array();
	
	if(isset($params)){
		$query->execute($params);
	}else{
		$query->execute();
	}
	$errors = $query->errorInfo();
	if($errors[2]==''){
		$resArray=$query->fetchAll();
		if($forceArray==0){
			if(count($resArray)==1){
				return $resArray[0];
			}else{
				return $resArray;
			}
		}else{
			return $resArray;
		}
	}else{
		print_r($errors);
	}
}
function runDBQuery($db,$queryString,$params){
	switch($db){
		case "app":
			$pdo = new PDO("mysql:host=".hostname_app.";dbname=".database_app, username_app, password_app);
		break;
		case "prices":
			$pdo = new PDO("mysql:host=".hostname_prices.";dbname=".database_prices, username_prices, password_prices);
		break;
	}
	$pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
	$query=$pdo->prepare($queryString);
	$resArray=array();
	
	if(isset($params)){
		$query->execute($params);
	}else{
		$query->execute();
	}
	$errors = $query->errorInfo();
	if($errors[2]==''){
		return 'OK';
	}else{
		print_r($errors);
	}
}
function GetSQLValueString($theValue, $theType) {
  if (PHP_VERSION < 6) {
    $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;
  }

  $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);

  switch ($theType) {
    case "text":
      $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
      break;    
    case "long":
    case "int":
      $theValue = ($theValue != "") ? intval($theValue) : "NULL";
      break;
    case "double":
      $theValue = ($theValue != "") ? doubleval($theValue) : "NULL";
      break;
    case "date":
      $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
      break;
  }
  return $theValue;
}
function backupDB($tables=false, $backup_name=false){
	$mysqli = new mysqli(hostname_app,username_app,password_app,database_app); 
	$mysqli->select_db(database_app); $mysqli->query("SET NAMES 'utf8'");
	$queryTables = $mysqli->query('SHOW TABLES'); 
	while($row = $queryTables->fetch_row()) { 
		$target_tables[] = $row[0]; 
	}	
	if($tables !== false) { 
		$target_tables = array_intersect( $target_tables, $tables); 
	}
	foreach($target_tables as $table){
		$result	= $mysqli->query('SELECT * FROM '.$table); 	
		$fields_amount=$result->field_count;  
		$rows_num=$mysqli->affected_rows; 	
		$res = $mysqli->query('SHOW CREATE TABLE '.$table);	
		$TableMLine=$res->fetch_row();
		$content = (!isset($content) ?  '' : $content) . "\n\n".$TableMLine[1].";\n\n";
		for ($i = 0, $st_counter = 0; $i < $fields_amount; $i++, $st_counter=0) {
			while($row = $result->fetch_row())	{ 
				if ($st_counter%100 == 0 || $st_counter == 0 ){
					$content .= "\nINSERT INTO ".$table." VALUES";
				}
				$content .= "\n(";
				for($j=0; $j<$fields_amount; $j++)  { 
					$row[$j] = str_replace("\n","\\n", addslashes($row[$j]) ); 
					if (isset($row[$j])){
						$content .= '"'.$row[$j].'"' ;
					}else{$content .= '""';}	   
					
					if ($j<($fields_amount-1)){$content.= ',';}		
				}
				$content .=")";
				if ( (($st_counter+1)%100==0 && $st_counter!=0) || $st_counter+1==$rows_num) {$content .= ";";} else {$content .= ",";}	
				$st_counter=$st_counter+1;
			}
		} $content .="\n\n\n";
	}
	$backup_name = $backup_name ? $backup_name : $name."___(".date('H-i-s')."_".date('d-m-Y').")__rand".rand(1,11111111).".sql";
	file_put_contents($backup_name, $content);
	return 'Export done.';
}
function importDB($sql_file){
	$return='';
	if (!file_exists($sql_file)) {return;} 
	$allLines = file($sql_file);
	$mysqli = new mysqli(hostname_app,username_app,password_app,database_app);
	if (mysqli_app_errno()){echo "Failed to connect to MySQL: " . mysqli_app_error();} 
		$zzzzzz = $mysqli->query('SET foreign_key_checks = 0');
		preg_match_all("/\nCREATE TABLE(.*?)\`(.*?)\`/si", "\n".file_get_contents($sql_file), $target_tables); 
		foreach ($target_tables[2] as $table){
			$mysqli->query('DROP TABLE IF EXISTS '.$table);
		}         
		$zzzzzz = $mysqli->query('SET foreign_key_checks = 1');
		$mysqli->query("SET NAMES 'utf8'");							
		$templine = '';	
		foreach ($allLines as $line){							
			if (substr($line, 0, 2) != '--' && $line != '') {$templine .= $line; 
				if (substr(trim($line), -1, 1) == ';') {
					$mysqli->query($templine) or $return.='Error performing query \'<strong>' . $templine . '\': ' . $mysqli->error . '<br /><br />';  
					$templine = '';
				}
			}
		}	
		$return.='Importing finished.';
		return $return;
}
/*DB FUNCTIONS*/

/*CUSTOM DATATYPES*/
function returnFieldInstructions($instructions){
	if($instructions!=''){
		$instructions=$instructions;
	}else{
		$instructions='print=>1;type=>text;order=>0;required=>;multiple=>;';
	}
	
	$array=explode(';',$instructions);
	
	foreach ($array as $field){
		$details=explode('=>',$field);
		$inst[$details[0]]=$details[1];
	}
	
	return $inst;
}
function returnFieldLabel($field_name){
	return cleanText(ucwords(str_replace('_',' ',str_replace('id_','',strtolower($field_name)))));
}
function returnCorrectPostDatatype($value, $type, $multiple){
	if($value!=''){
		if($multiple!=''){
			$returnValue="'".implode(',',$value)."'";
		}else{
			switch ($type){
				case "money":
					$returnValue="'".str_replace("'","\'",fixFloat($value))."'";
				break;

				case "date":
					$returnValue="'".data_store($value)."'";
				break;
				
				case "datetime":
					$returnValue="'".datetime_store($value)."'";
				break;
				
				case "tag":
					$returnValue="'".str_replace("'","\'",stripslashes($value))."'";
				break;
				
				case "password":
					$returnValue="'".encryptText($value)."'";
				break;
				
				default:
					$returnValue="'".str_replace("'","\'",stripslashes($value))."'";
				break;
			}
		}
	}else{
		$returnValue='NULL';
	}
	
	return $returnValue;
}
function returnCorrectInputField($field_type, $field_name, $required, $specs, $value, $multiple){

	$returnField='<div class="control-group">
					<label class="control-label">'.returnFieldLabel($field_name).'</label>
					<div class="controls">';
						
	switch($field_type){
		case "text":
			$returnField.='<input type="text" '.$required.' value="'.$value.'" class="form-control formInput" id="'.$field_name.'" name="'.$field_name.'">';
		break;
		case "email":
			$returnField.='<input type="email" '.$required.' value="'.$value.'" class="form-control formInput" id="'.$field_name.'" name="'.$field_name.'">';
		break;
		case "tag":
			$returnField.='<input type="text" '.$required.' value="'.$value.'" class="form-control tagsinput" id="'.$field_name.'" name="'.$field_name.'">';
		break;
		case "password":
			$returnField.='<input type="password" '.$required.' value="'.decryptText($value).'" class="form-control formInput" id="'.$field_name.'" name="'.$field_name.'">';
		break;
		case "file":
			$returnField.='<input type="file" '.$required.' class="form-control formInput" id="'.$field_name.'" name="'.$field_name.'">';
			if($value!=''){
				$returnField.='<input type="hidden" name="old_'.$field_name.'" value="'.$value.'">';
			}
		break;
		case "money":
			$returnField.='
					<div class="input-group right">
						<div class="input-group-addon"><i class="fa fa-euro"></i></div>
						<input type="text" class="form-control formInput" value="'.$value.'" '.$required.' id="'.$field_name.'" name="'.$field_name.'">
					</div>';
		break;
		case "date":
			$returnField.='
					<div class="input-group"> 
						<input type="text" '.$required.' value="'.data_store_print($value).'" class="form-control date-picker formInput" id="'.$field_name.'" name="'.$field_name.'">
					</div>';
		break;
		case "datetime":
			$returnField.='
					<div class="input-group date datetimepicker">
						<input type="text" class="form-control formInput" value="'.datetime_store_print($value).'" '.$required.' id="'.$field_name.'" name="'.$field_name.'">
						<span class="input-group-btn">
							<button class="btn default" type="button"><i class="fa fa-calendar"></i></button>
						</span>
					</div>';
		break;
		case "textarea":
			if($specs=='html'){
				$returnField.='<textarea id="'.$field_name.'" name="'.$field_name.'" '.$required.' '.$multiple.' class="form-control formInput">'.$value.'</textarea>';
			}else{
				$returnField.='<textarea id="'.$field_name.'" name="'.$field_name.'" '.$required.' '.$multiple.' class="form-control textarea-control formInput">'.$value.'</textarea>';
			}
		break;
		case "select":
			$returnField.='
				<select class="form-control select-chosen formInput" id="'.$field_name.'" '.$required.' '.$multiple.' name="'.$field_name;
					if($multiple=='multiple'){
						$returnField.='[]';
					}
					$returnField.='" placeholder="Seleziona un valore">';
					
					if($multiple!='multiple'){
						$returnField.='<option value="">Seleziona un valore</option>';
					}
					if(strpos($specs,'[')!==false){
						//array definito
						$definedArray=str_replace(']','',str_replace('[','',$specs));	
						$defined=explode(',',$definedArray);
						foreach($defined as $definedField){
							$returnField.='<option ';
								if($definedField==$value){$returnField.= ' selected ';}
								if($multiple=='multiple'){
									$toCheck=explode(',',$value);
									if(in_array($definedField, $toCheck)){
										$returnField.=' selected ';
									}
								}
							$returnField.=' value="'.$definedField.'">'.strtoupper($definedField).'</option>';
						}
					}else{
						$specsDetails=explode('->',$specs);
						mysql_select_db(database_app, connect);
						$query_rs_db = "SELECT * FROM ".str_replace('"','',$specsDetails[0]);
						$rs_db = mysql_query($query_rs_db, connect);
						$row_rs_db = mysql_fetch_assoc($rs_db);
						
						$printFields=explode(',',str_replace(')','',str_replace('(','',$specsDetails[1])));
						$storeField=str_replace(')','',str_replace('(','',$specsDetails[2]));
						
						if($storeField==''){
							$storeField='id';
						}
												
						do{
							$returnField.='<option ';
							if($row_rs_db[$storeField]==$value){$returnField.= ' selected ';}
							
							if($multiple=='multiple'){
								$toCheck=explode(',',$value);
								if(in_array($row_rs_db[$storeField], $toCheck)){
									$returnField.=' selected ';
								}
							}
							
							$returnField.=' value="'.$row_rs_db[$storeField].'">';
								foreach($printFields as $printField){
									$returnField.=strtoupper($row_rs_db[$printField]).' ';
								}
							$returnField.='</option>';
						}while($row_rs_db = mysql_fetch_assoc($rs_db));
					}			
					
			$returnField.='</select>';
		break;
		
	}
	
	$returnField.='</div>
				</div><!--form-group-->	';
	return $returnField;
}
function returnCorrectDatatypePrintField($field_type, $value, $specs, $multiple){
	if($value!=''){			
		switch($field_type){
			case "text":
				$returnField=$value;
			break;
			case "tag":
				$returnField=$value;
			break;
			case "password":
				$returnField=decryptText($value);
			break;
			case "file":
				$returnField='<a href="/contents/'.$specs.'/'.$value.'" target="_blank">'.$value.'</a>';
			break;
			case "money":
				$returnField=print_money($value);
			break;
			case "date":
				$returnField='<div class="hidden">'.strtotime($value).'</div>'.data_store_print($value);
			break;
			case "datetime":
				$returnField=datetime_store_print($value);
			break;
			case "textarea":
				$returnField=$value;
			break;
			case "select":
						if(strpos($specs,'[')!==false){
							//array definito
							$returnField=$value;
						}else{
							$specsDetails=explode('->',$specs);
							
							$storeField=str_replace(')','',str_replace('(','',$specsDetails[2]));
							if($storeField==''){
								$storeField='id';
							}
							
							if($multiple=='multiple'){
								$allValues=explode(',',$value);
								$i=0;
								foreach ($allValues as $value){
									if($i!=0){
										$returnField.='<br>';
									}
									$returnField.='- ';
									mysql_select_db(database_app, connect);
									$query_rs_db = "SELECT * FROM ".str_replace('"','',$specsDetails[0]);
									
									if(strpos($specsDetails[0], 'WHERE')!==false){
										$query_rs_db.=" AND ";
									}else{
										$query_rs_db.=" WHERE ";
									}
									
									$query_rs_db.=$storeField."='".$value."'";
									$rs_db = mysql_query($query_rs_db, connect);
									$row_rs_db = mysql_fetch_assoc($rs_db);
									
									$printFields=explode(',',str_replace(')','',str_replace('(','',$specsDetails[1])));
									foreach($printFields as $printField){
										$returnField.=strtoupper($row_rs_db[$printField]).' ';
									}
									$i++;
								}
							}else{
								mysql_select_db(database_app, connect);
								$query_rs_db = "SELECT * FROM ".str_replace('"','',$specsDetails[0]);
								
								if(strpos($specsDetails[0], 'WHERE')!==false){
									$query_rs_db.=" AND ";
								}else{
									$query_rs_db.=" WHERE ";
								}
								
								$query_rs_db.=$storeField."='".$value."'";
								$rs_db = mysql_query($query_rs_db, connect);
								$row_rs_db = mysql_fetch_assoc($rs_db);
								
								$printFields=explode(',',str_replace(')','',str_replace('(','',$specsDetails[1])));
								foreach($printFields as $printField){
									$returnField.=strtoupper($row_rs_db[$printField]).' ';
								}
							}
						}			
						
				$returnField.='</select>';
			break;
			
		}
	}else{
		$returnField='-';
	}
	return $returnField;
}
function returnAccountName($id){
	$db = returnDBObject("SELECT * FROM datatype_account WHERE id=?",array($id)); 
	return $db['nome'].' '.$db['cognome'];
}
/*CUSTOM DATATYPES*/

/*UPDATE FUNCTIONS*/
function checkFolderFiles($name, $check, $subfolder){
		$exclude=array("configurations.php","connect_online.php", "locales.php", "control.access.php", "connect_offline.php");
		if(is_array($check)){
			foreach($check as $sub => $contents){
				if($subfolder!=''){
					checkFolderFiles($sub, $contents, $subfolder.'/'.$name);
				}else{
					checkFolderFiles($sub, $contents, $name);
				}
			}
		}else{
			if(is_file('../../../bmt/'.$subfolder.'/'.$check) && !in_array($check, $exclude)){
				$oldFile=stat('../../../bmt/'.$subfolder.'/'.$check);
				$newFile=stat('update/bmt/'.$subfolder.'/'.$check);
				if($newFile['size']!=$oldFile['size']){
					if($subfolder!=''){
						$filePath=$subfolder.'/'.$check;
					}else{
						$filePath=$check;
					}
					echo '<tr>';
						echo '<td>'.$filePath.'</td>';
						echo '<td>'.$oldFile['size'].' bytes</td>';
						echo '<td>'.$newFile['size'].' bytes</td>';
						echo '<td style="text-align:center"><input type="checkbox" checked name="fileToChange[]" value="'.$filePath.'"></td>';
					echo '</tr>';
				}
			}
		}
	}
/*UPDATE FUNCTIONS*/

/*NOTIFICHE*/
function sendNotification($id_datatype, $datatype, $notifica, $sender, $id_sender, $tipo_azione){
	
			$insertSQL = sprintf("INSERT INTO datatype_notifiche (data_notifica, id_datatype, datatype, notifica, sender, id_sender, tipo_azione) VALUES (%s, %s, %s, %s,%s, %s, %s)",
                       GetSQLValueString(date("Y-m-d H:i:s"), "date"),
                       GetSQLValueString($id_datatype, "text"),
                       GetSQLValueString($datatype, "text"),
                       GetSQLValueString($notifica, "text"),
                       GetSQLValueString($sender, "text"),
                       GetSQLValueString($id_sender, "text"),
                       GetSQLValueString($tipo_azione, "text"));
					   
					   mysql_select_db(database_app, connect);
					   mysql_query($insertSQL, connect);
			
			if($sender=='system'){
					$gestione = returnDBObject("SELECT * FROM datatype_account WHERE livello=? AND sendNotifications='1' ORDER BY id DESC",array('gestione'),1);
					
					foreach($gestione as $account){
						sendMail(
							array("name"=>"Sistema di notifiche", "email"=>"notifiche@dcmanager.bestudio.it"),
							array("name"=>$account['nome'].' '.$account['cognome'], "email" => $account['email']),
							"Notifica dal sistema: ".$tipo_azione,
							"<strong>Dettagli</strong><br><br>
							".$notifica
						);
					}
			}
			
}
function returnNotificationObject($id_notifica){
		mysql_select_db(database_app, connect);
		$query_rs_db = "SELECT * FROM datatype_notifiche WHERE id='".$id_notifica."'";
		$rs_db = mysql_query($query_rs_db, connect) or die(mysql_error());
		$notifica = mysql_fetch_assoc($rs_db);
		
		mysql_select_db(database_app, connect);
		$query_rs_db = "SELECT * FROM datatype_pratiche_".$notifica['tipo_pratica']." WHERE id='".$notifica['id_pratica']."'";
		$rs_db = mysql_query($query_rs_db, connect) or die(mysql_error());
		$pratica = mysql_fetch_assoc($rs_db);
				
		if($notifica['id_cliente']!=''){
						
			mysql_select_db(database_app, connect);
			$query_rs_db = "SELECT * FROM datatype_account WHERE id='".$notifica['id_cliente']."'";
			$rs_db = mysql_query($query_rs_db, connect) or die(mysql_error());
			$cliente = mysql_fetch_assoc($rs_db);
			
			return $cliente['nome']." ".$cliente['cognome']." ha ".$notifica['tipo_azione']." la pratica [#".$pratica['id']."] ".strtoupper($pratica['ragionesociale_debitore']);
		}
			
		if($notifica['id_gestione']!=''){
			
			$cliente=$pratica['id_cliente'];
			
			mysql_select_db(database_app, connect);
			$query_rs_db = "SELECT * FROM datatype_account WHERE id='".$notifica['id_gestione']."'";
			$rs_db = mysql_query($query_rs_db, connect) or die(mysql_error());
			$gestione = mysql_fetch_assoc($rs_db);
				
			mysql_select_db(database_app, connect);
			$query_rs_db = "SELECT * FROM datatype_account WHERE id='".$cliente."'";
			$rs_db = mysql_query($query_rs_db, connect) or die(mysql_error());
			$cliente = mysql_fetch_assoc($rs_db);
				
			return $gestione['nome']." ".$gestione['cognome']." ha ".$notifica['tipo_azione']." la pratica [#".$pratica['id']."] ".strtoupper($pratica['ragionesociale_debitore']);
			
		}
		
		if($notifica['id_gestione']=='' && $notifica['id_cliente']==''){
			mysql_select_db(database_app, connect);
			$query_rs_db = "SELECT * FROM datatype_account WHERE livello='gestione'";
			$rs_db = mysql_query($query_rs_db, connect) or die(mysql_error());
			$gestione = mysql_fetch_assoc($rs_db);
				
			mysql_select_db(database_app, connect);
			$query_rs_db = "SELECT * FROM datatype_account WHERE id='".$id_cliente."'";
			$rs_db = mysql_query($query_rs_db, connect) or die(mysql_error());
			$cliente = mysql_fetch_assoc($rs_db);
				
			do{
				sendMail(
					array("name"=>"Sistema di notifiche", "email"=>"notifiche@distallo.bestudio.it"),
					array("name"=>$gestione['nome'].' '.$gestione['cognome'], "email" => $gestione['email']),
					"Il sistema ha generato una notifica per la pratica [#".$pratica['id']."] ".strtoupper($pratica['ragionesociale_debitore']),
					"<strong>Dettagli</strong><br><br>
					".$notifica
				);
			}while($gestione = mysql_fetch_assoc($rs_db));	
		}
}
function returnCorrectNotificationIcon($tipo_azione, $daLeggere){
	if($daLeggere==1){
		$daLeggereIcon='<div class="to-read-icon">!</div>';
	}else{
		$daLeggereIcon='';
	}
	switch($tipo_azione){ 
		case "inserito": 
			return '<div class="label label-sm label-info wrap-notification-icon" style="margin-top:8px"><i class="fa fa-edit"></i>'.$daLeggereIcon.'</div>';
		break;
		case "modificato":
			return '<div class="label label-sm label-info wrap-notification-icon" style="margin-top:8px"><i class="fa fa-edit"></i>'.$daLeggereIcon.'</div>';
		break; 
		case "aggiunto una nuova spesa per": 
			return '<div class="label label-sm label-success wrap-notification-icon" style="margin-top:8px"><i class="fa fa-euro"></i>'.$daLeggereIcon.'</div>';
		break;
		case "modificato una spesa per": 
			return '<div class="label label-sm label-success wrap-notification-icon" style="margin-top:8px"><i class="fa fa-euro"></i>'.$daLeggereIcon.'</div>';
		break;
		case "inserito un nuovo evento per": 
			return '<div class="label label-sm label-warning wrap-notification-icon" style="margin-top:8px"><i class="fa fa-calendar"></i>'.$daLeggereIcon.'</div>';
		break;
	} 
}
function returnNotificationReadStatus($id_notifica, $id_utente, $livello_utente){
	
	mysql_select_db(database_app, connect);
	$query_rs_db = "SELECT * FROM datatype_notifiche WHERE id='".$id_notifica."'";
	$rs_db = mysql_query($query_rs_db, connect) or die(mysql_error());
	$notifica = mysql_fetch_assoc($rs_db);
		
	if($notifica['id_cliente']!=''){
		if($livello_utente=='gestione'){
			if($notifica['letta']==''){
				$daLeggere=1;
			}else{
				$letta_da=json_decode($notifica['letta_da'],1);
				$daLeggere=1;
				foreach ($letta_da as $lettore){
					if($lettore['livello']=='gestione' && $lettore['id']==$id_utente){
						$daLeggere=0;
					}
				}
			}
		}else{
			$daLeggere=0;
		}
	}else{
		if($livello_utente=='cliente'){
			if($notifica['letta']==''){
				$daLeggere=1;
			}else{
				$letta_da=json_decode($notifica['letta_da'],1);
				$daLeggere=1;
				foreach ($letta_da as $lettore){
					if($lettore['livello']=='cliente' && $lettore['id']==$id_utente){
						$daLeggere=0;
					}
				}
			}
		}else{
			$daLeggere=0;
		}
	}
	return $daLeggere;
}
/*NOTIFICHE*/

?>