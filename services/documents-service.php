<?php

$path = __DIR__ . '/..';
require_once $path . "/api/api-calls.php";
require_once $path . "/utils/response-utils.php";
require_once $path . "/models/InsuranceData.php";



/**
 * Funcion para obtener un proyecto
 */
function SDNW_wp_get_documents($id_proyecto)
{
    try {
        $response = SDNW_wp_madeGetAPI("/api/public/documentations/{$id_proyecto}",true);
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
                'errores' => [['error'=>'Se genero un error para generar el request para obtener documentos de seguro por días']],
                'respuesta'=>null
            ]);
        }
    } catch (\Throwable $th) {
        return (                [
            'errores' => [['error'=>'Se genero un error para generar el request para obtener documentos de seguro por días'.$th->getMessage()]],
            'respuesta'=>null
        ]);
    }
}