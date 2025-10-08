<?php


// función para guardar transients
function SPDA_save_transient_service() {
    try {
       if(!isset($_POST['idTransaccion'])){
          wp_send_json_error([
             'errores' => ['No especifico identificador de transient'],
             'respuesta'=>null
             ]);
       }
       // Limpieza básica de datos (mejor usar filtros específicos según tu caso)
       $post_data = array_map( 'sanitize_text_field', $_POST );

       // Convertir array a objeto PHP (stdClass)
       $objeto = (object) $post_data;
       $identifier = $objeto->idTransaccion;
       // Guardar como transient (1 horas)
       set_transient("SPDA_".$identifier, $objeto, 1 * HOUR_IN_SECONDS );
          wp_send_json_success([
             'errores' => [],
             'respuesta'=>[
                'mensaje'=> 'Transient almacenado con exito'
             ]
          ]);
    } catch (\Throwable $th) {
       wp_send_json_error([
          'errores' => ['Se produjo un error al guardar el transient'],
          'respuesta'=>null
          ]);
    }

 }

 function SPDA_get_transient_service($idTransaccion) {
    try {
       // Verificamos si se pasó el identificador
       if ( !isset($idTransaccion) ) {
         return ([
             'errores' => ['No especificó identificador de transient'],
             'respuesta' => null
          ]);
       }
 
       // Sanitizar el identificador
       $identifier = sanitize_text_field($idTransaccion);
 
       // Obtener el transient
       $datos = get_transient("SPDA_".$identifier);

       if ( false === $datos ) {
           error_log('Transient no encontrado: ' . $identifier);
           return ([
               'errores' => ['No se encontró ningún transient con ese identificador o expiró'],
               'respuesta' => null
           ]);
       }
       delete_transient("SPDA_".$identifier);

 
       // Si todo bien, enviamos los datos
       return ([
          'errores' => [],
          'respuesta' => $datos
       ]);
 
    } catch (\Throwable $th) {
      return ([
          'errores' => ['Se produjo un error al recuperar el transient'],
          'respuesta' => null
       ]);
    }
 }