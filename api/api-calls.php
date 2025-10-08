<?php

$path = __DIR__ . '/..';

require_once $path . "/utils/token-utils.php";
require_once $path . "/utils/response-utils.php";

/**
 * Funcion que hace un POST a la API de NIBW
 * recibe la ruta , el body , si necesita seguridad y los query oarams
 */
function SDNW_wp_madePostAPI(string $apiRoute,string $body, bool $secured, array $Qparams = array(), string $body_type = 'json' )
{
   $apiRequest= SDNW_commonApiRequest($apiRoute,$secured,$body , $Qparams, $body_type);
   if(is_null($apiRequest)){
      return null;
   }else {
      $response = wp_remote_post($apiRequest['apiendpoint'], $apiRequest['apiargs']);
      return $response;
   }

}


/**
 * Funcion que hace un GET a la API de NIBW
 * recibe la ruta ,  si necesita seguridad y los query params
 */
function SDNW_wp_madeGetAPI(string $apiRoute,bool $secured , array $Qparams = array())
{
   $apiRequest= SDNW_commonApiRequest($apiRoute,$secured,null,$Qparams);
   if(is_null($apiRequest)){
      return null;
   }else {
      $response = wp_remote_get($apiRequest['apiendpoint'], $apiRequest['apiargs']);
      return $response;
   }

}

/**
 * Funcion que devuelev en un formato correcto 
 * el body , headers y query params de la request a la API de NIBW
 */
function SDNW_commonApiRequest(string $apiRoute, bool $secured, $body ,array $Qparams = array(), string $body_type = 'json'){
   $first_param = true ;
   $params = null;
   foreach ($Qparams as $key => $value) {
      if($first_param){
         $params .= '?'.$key.'='.$value;
      }else{
         $params .= '&'.$key.'='.$value;
         $first_param=false;
      }
    }
   $content_type= ($body_type=='x-www-form-urlencoded') ? 'application/x-www-form-urlencoded' : 'application/json';
   $headers = array(
      'Content-Type' => $content_type
   );
   if($secured){
      $token=SDNW_getNoExpToken();
      if(is_null($token)){
         return null;
      }
      $headers['Authorization'] = 'Bearer '.$token;
   }
   
   $api_endpoint = '' ;
   if(isset($params)){
      $api_endpoint = SDNW_URL . $apiRoute . $params;
   }else{
      $api_endpoint =  SDNW_URL . $apiRoute;
   }
   $api_args = array(
      'headers' => $headers,
      'timeout' => 20
   );
   if (!is_null($body)){
      $api_args['body'] = $body;
   }
   return array(
      'apiargs' => $api_args,
      'apiendpoint' => $api_endpoint
   );
}