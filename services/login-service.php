<?php


$path = __DIR__ . '/..';
require_once $path . "/api/api-calls.php";
require_once $path . "/utils/response-utils.php";

/**
 * Funcion que hace login del usuario de la API
 * para poder obtener el token de la sesin
 */
function SDNW_wp_getDatafromLogin()
{
   
   $bodyReq = http_build_query(
       array(
         'username' => SDNW_USERNAME,
         'password' => SDNW_PASSWORD,
         'grant_type' => SDNW_GRANT_TYPE,
         'client_id' => SDNW_CLIENT_ID,
         'client_secret' => SDNW_CLIENT_SECRET
      ),
   );
   $response = SDNW_wp_madePostAPI('/oauth/token',$bodyReq,false, [], 'x-www-form-urlencoded');


   if(!is_null($response)){

      if(SDNW_OkCreateResponse($response, "SDNW_wp_getDatafromLogin", "El usuario ". SDNW_USERNAME." en la página de seguros por días", "NIBW")['status'])
      {
         $bodyResp = wp_remote_retrieve_body($response);
         
         
         $data = json_decode($bodyResp);
         $current = current_time('timestamp');
         $access_token = $data->access_token;
         $expires_in = $data->expires_in;
         $token_exp = $current + $expires_in;

         // Almacena el token en un transient por 3 hora (10800 segundos)
         set_transient('SDNWtoken', $access_token, 10800);
         set_transient('SDNWtokenExp', $token_exp, 10800);
      }
   }

}