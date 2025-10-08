<?php

$path = __DIR__ . '/..';
require_once $path . "/utils/log-utils.php";

function SDNW_OkCreateResponse(array|WP_Error $response, $funcion, $pagina, $proveedorAPI)
{
    $api_response = [];
    $errores = [];

    // Verificar si la respuesta es un error de WordPress
    if (is_wp_error($response)) {
        $error_message = $response->get_error_message();
        $api_response = [
            'status' => false,
            'errores' => [$error_message]
        ];
        insu_registrar_error_insuguru($funcion, $error_message, SPDA_INSU_PRODUCT_ID);
        return $api_response;
    }

    try {
        $statusCode = wp_remote_retrieve_response_code($response);

        if ($statusCode != 200 && $statusCode != 201) {
            $bodyJSON = wp_remote_retrieve_body($response);
            $body = json_decode($bodyJSON, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $Mensaje_Error_Correo = "Respuesta JSON inválida.\n";
                $errores = [['error' => $Mensaje_Error_Correo]];
            } else {
                $status_respuesta = $body['status'] ?? 'Desconocido';
                $Mensaje_Error_Correo = $body['message'] ?? "Error Desconocido.\n";
                if ($status_respuesta === 'KO' && isset($body['errors'])) {
                    $mensajesDeError = array_column($body['errors'], 'error');
                    $Mensaje_Error_Correo = implode("\n", $mensajesDeError);
                    $errores = $body['errors'];
                } else {
                    $errores = [['error' => $Mensaje_Error_Correo]];
                }
            }

            $api_response = [
                'status' => false,
                'errores' => $errores
            ];
            insu_registrar_error_insuguru($funcion, $Mensaje_Error_Correo, SPDA_INSU_PRODUCT_ID);
            return $api_response;
        }

        $api_response = [
            'status' => true,
            'errores' => []
        ];
        return $api_response;

    } catch (\Throwable $th) {
        $api_response = [
            'status' => false,
            'errores' => [$th->getMessage()]
        ];
        insu_registrar_error_insuguru($funcion, $th->getMessage(), SPDA_INSU_PRODUCT_ID);
        return $api_response;
    }
}


function esJsonDecodable($variable) {
   try {
     // Intenta decodificar la variable
      json_decode($variable);

      // Verifica si hubo algún error durante la decodificación
      return json_last_error() === JSON_ERROR_NONE;
   } catch (\Throwable $th) {
      return false;
   }
   
}

