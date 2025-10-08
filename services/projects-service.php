<?php

$path = __DIR__ . '/..';
require_once $path . "/api/api-calls.php";
require_once $path . "/utils/response-utils.php";
require_once $path . "/models/InsuranceData.php";

/**
 * Funcion para tarificar un seguro 
 * Si no se manda lista de productos nos va a devolver la lista de productos disponibles
 */
function SDNW_wp_post_insurance_data(InsuranceData $insurance_data)
{
    try {
        $response = SDNW_wp_madePostAPI('/api/public/projects', $insurance_data->toJSONSinNulos() ,true);
        if(!is_null($response)){
           $verificacion_respuesta = SDNW_OkCreateResponse($response, "SDNW_wp_post_insurance_data", "La página de seguros por días", "NIBW");           

           if($verificacion_respuesta['status']){
              $bodyJSON = wp_remote_retrieve_body($response);
              $body = json_decode($bodyJSON);
              return [
                'errores' => [],
                'respuesta'=>$body
              ];
           }else{
                return[
                'errores' => $verificacion_respuesta['errores'],
                'respuesta'=>null
                ];
           }
        }else{
            [
                'errores' => [['error' => 'Se genero un error para generar el request emitir una póliza']],
                'respuesta'=>null
            ];
        }
    } catch (\Throwable $th) {
        [
            'errores' => [['error' => 'Se genero un error para generar el request para emitir una póliza '.$th->getMessage()] ],
            'respuesta'=>null
        ];
    }
}

/**
 * Funcion para obtener un proyecto
 */
function SDNW_wp_get_projects($id_proyecto)
{
    try {
        $response = SDNW_wp_madeGetAPI("/api/public/projects/{$id_proyecto}/policies",true);
        if(!is_null($response)){
           $verificacion_respuesta = SDNW_OkCreateResponse($response, "SDNW_wp_get_projects", "La página de seguros por días", "NIBW");           
           if($verificacion_respuesta['status']){
              $bodyJSON = wp_remote_retrieve_body($response);
              $body = json_decode($bodyJSON);
              return ([
                'errores' => [],
                'respuesta'=>$body
              ]);
           }else{
                return (                [
                'errores' => $verificacion_respuesta['errores'],
                'respuesta'=>null
                ]);
           }
        }else{
            return (                [
                'errores' => [['error'=>'Se genero un error para generar el request para obtener proyecto de seguro por días']],
                'respuesta'=>null
            ]);
        }
    } catch (\Throwable $th) {
        return (                [
            'errores' => [['error'=>'Se genero un error para generar el request para obtener proyecto de seguro por días'.$th->getMessage()]],
            'respuesta'=>null
        ]);
    }
}