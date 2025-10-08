<?php

//Función envía correo de log de error al administrador de la web
function SDNW_EnvioLogErrorCorreo($correo, $origen_error, $pagina_error, $funcion, $response){
    
     
    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
    );
 
    $asunto = "Error en {$pagina_error} ";
    $str_resp = json_encode($response);
    $mensaje = "
    {$pagina_error} acaba de dar un error al ejecutar la función
    {$funcion} , {$origen_error} devolvió el siguiente error :
    {$str_resp}
    ";
    // Usamos la función de WordPress wp_mail para enviar el correo electrónico
    $wp_mail_result = wp_mail($correo, $asunto, $mensaje, $headers); 

 }
