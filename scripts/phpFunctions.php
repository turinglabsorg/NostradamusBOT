<?php
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
										<td align="center" style="text-align:center; padding-top:5px">
											<img src="https://api.nostradamusbot.com/assets/headerMail.jpg" width="100%"/>
										</td>
									</tr>
									<tr>
										<td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
											<table border="0" cellpadding="0" cellspacing="0" width="100%">';
																	
								$mailHTML.='		<tr>
													<td style="padding: 20px 0 30px 0; color: #9F9F9F; font-family: Helvetica, sans-serif; font-size: 16px; line-height: 20px;">'.$testo.'</td>
												</tr>
											</table>
										</td>
									</tr>
									<tr>
										<td bgcolor="#fff" style="padding: 30px 30px 30px 30px;">
											<table border="0" cellpadding="0" cellspacing="0" width="100%">
												<tr>
													<td style="color: #4E4E4E; font-family: Helvetica, sans-serif; text-align:center; font-size: 11px;" width="100%">
														©'.date('Y').' NostradamusBOT
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
	if(isset($_POST['sendMail'])){
		$oggetto='Richiesta di contatto, NostradamusBOT';
		$posted='';
		$i=0;
		
		foreach ($_POST as $name => $value){
			if($name!='sendMail'){
				if($i!=0){
					$posted.='<br>';
				}
				
				$posted.='> '.ucfirst($name).': '.$value;
				
				$i++;	
			}
		}
		
		$testo=$posted;
		
						
		sendMail(
			array('email'=>'sebastiano@wearefuturing.com', 'name'=>$oggetto),
			array('email'=>$_POST['email'], 'name'=>$_POST['nome']), 
			$oggetto, 
			$testo);
			
			$success=$locales['richiesta_mandata'];
		?>
			<script>alert('<?php echo $success; ?>');</script>
		<?php
	} 
	/*MAIL FUNCTIONS*/
?>