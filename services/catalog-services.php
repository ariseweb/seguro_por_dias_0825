<?php
$path = __DIR__ . '/..';
require_once $path . "/api/api-calls.php";
require_once $path . "/utils/response-utils.php";

/**
 * Funcion para obtener tipos de vehículos con sus ids de la API
 */
function SDNW_wp_get_tipos_vehiculos($ajax = true)
{
    try {
        $response = SDNW_wp_madeGetAPI('/api/public/risk-types',true);
        if(!is_null($response)){
           $verificacion_respuesta = SDNW_OkCreateResponse($response, "SDNW_wp_get_tipos_vehiculos", "La página de seguros por días", "NIBW");           
           if($verificacion_respuesta['status']){
              $bodyJSON = wp_remote_retrieve_body($response);
              $body = json_decode($bodyJSON);
              if($ajax){
                return wp_send_json_success([
                    'errores' => [],
                    'respuesta'=>$body
                  ]);
              }else{
                return [
                    'errores' => [],
                    'respuesta'=>$body
                  ];
              }
           }else{
            if($ajax){
                return wp_send_json_error([
                    'errores' => $verificacion_respuesta['errores'],
                    'respuesta'=>null
                    ]);
            }else{
                return [
                    'errores' => $verificacion_respuesta['errores'],
                    'respuesta'=>null
                    ];
            }
 
           }
        }else{
            if($ajax){
                return wp_send_json_error([
                    'errores' => [['error'=>'Se genero un error para generar el request para obtener tipos de vehículos'] ],
                    'respuesta'=>null
                ]);
            }else{
                return [
                    'errores' => [['error'=>'Se genero un error para generar el request para obtener tipos de vehículos']],
                    'respuesta'=>null
                ];
            }

        }
    } catch (\Throwable $th) {
        if($ajax){
            return wp_send_json_error([
                'errores' => [['error'=>'Se genero un error para generar el request para obtener tipos de vehículos '.$th->getMessage()]],
                'respuesta'=>null
            ]);
        }else{
            return [
                'errores' => [['error'=>'Se genero un error para generar el request para obtener tipos de vehículos '.$th->getMessage()] ],
                'respuesta'=>null
            ];
        }

    }
}


/**
 * Funcion para marcas según el tipo de vehículo
 */
function SDNW_wp_get_marcas_vehiculos($id_tipo_vehiculo)
{
    try {
        $response = SDNW_wp_madeGetAPI('/api/public/makes',true, ['riskType'=>$id_tipo_vehiculo]);
        if(!is_null($response)){
           $verificacion_respuesta = SDNW_OkCreateResponse($response, "SDNW_wp_get_marcas_vehiculos", "La página de seguros por días", "NIBW");           
           if($verificacion_respuesta['status']){
              $bodyJSON = wp_remote_retrieve_body($response);
              $body = json_decode($bodyJSON);
              return wp_send_json_success([
                'errores' => [],
                'respuesta'=>$body
              ]);
           }else{
                return wp_send_json_error(                [
                'errores' => $verificacion_respuesta['errores'],
                'respuesta'=>null
                ]);
           }
        }else{
            return wp_send_json_error([
                'errores' =>[['error'=> 'Se genero un error para generar el request para obtener marcas de vehículos']],
                'respuesta'=>null
            ]);
        }
    } catch (\Throwable $th) {
        return wp_send_json_error(                [
            'errores' => [['error'=>'Se genero un error para generar el request para obtener marcas de vehículos '.$th->getMessage()]],
            'respuesta'=>null
        ]);
    }
}


/**
 * Funcion para obtener modelos a partir de marca
 */
function SDNW_wp_get_modelos_vehiculos($id_marca,$id_tipo_vehiculo)
{
    try {
        $response = SDNW_wp_madeGetAPI("/api/public/makes/{$id_marca}/models",true, ['risk_type'=>$id_tipo_vehiculo]);
        if(!is_null($response)){
           $verificacion_respuesta = SDNW_OkCreateResponse($response, "SDNW_wp_get_modelos_vehiculos", "La página de seguros por días", "NIBW");           
           if($verificacion_respuesta['status']){
              $bodyJSON = wp_remote_retrieve_body($response);
              $body = json_decode($bodyJSON);
              return wp_send_json_success([
                'errores' => [],
                'respuesta'=>$body
              ]);
           }else{
                return wp_send_json_error(                [
                'errores' => $verificacion_respuesta['errores'],
                'respuesta'=>null
                ]);
           }
        }else{
            return wp_send_json_error(                [
                'errores' => [['error'=>'Se genero un error para generar el request para obtener modelos de vehículos']],
                'respuesta'=>null
            ]);
        }
    } catch (\Throwable $th) {
        return wp_send_json_error(                [
            'errores' => [['error'=>'Se genero un error para generar el request para obtener modelos de vehículos '.$th->getMessage()]],
            'respuesta'=>null
        ]);
    }
}
