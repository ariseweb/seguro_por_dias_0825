<?php

$path = __DIR__ . '/..';
require_once $path . "/api/api-calls.php";
require_once $path . "/utils/response-utils.php";
require_once $path . "/models/Quotation.php";

/**
 * Funcion para tarificar un seguro 
 * Si no se manda lista de productos nos va a devolver la lista de productos disponibles
 */
function SDNW_wp_post_quotation(Quotation $quotation)
{
    try {

        $response = SDNW_wp_madePostAPI('/api/public/quotations', $quotation->toJSONSinNulos() ,true);
        if(!is_null($response)){
           $verificacion_respuesta = SDNW_OkCreateResponse($response, "SDNW_wp_post_quotation", "La página de seguros por días", "NIBW");           
           if($verificacion_respuesta['status']){
              $bodyJSON = wp_remote_retrieve_body($response);
              $body = json_decode($bodyJSON);
              return wp_send_json_success([
                'errores' => [],
                'respuesta'=>$body
              ]);
           }else{
                return wp_send_json_error([
                'errores' => $verificacion_respuesta['errores'],
                'respuesta'=>null
                ]);
           }
        }else{
            return wp_send_json_error([
                'errores' => [['error'=>'Se genero un error para generar el request tarficar una póliza'] ],
                'respuesta'=>null
            ]);
        }
    } catch (\Throwable $th) {
        return wp_send_json_error([
            'errores' => [['error'=>'Se genero un error para generar el request para tarficar una póliza '.$th->getMessage()] ],
            'respuesta'=>null
        ]);
    }
}

