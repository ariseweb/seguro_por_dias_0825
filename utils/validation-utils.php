<?php
function SDNW_validate_change_start_hour($fecha_inicio_cobertura_i, $hora_inicio_cobertura_i){
    // Establecer zona horaria del servidor (en este caso, UTC)
    $timezone_servidor = new DateTimeZone('UTC');
    
    // Establecer zona horaria de España
    $timezone_espana = new DateTimeZone('Europe/Madrid');
    
    // Valores de entrada
    $fecha_inicio_cobertura = $fecha_inicio_cobertura_i;
    $hora_inicio_cobertura = $hora_inicio_cobertura_i;

    // Obtener la fecha y hora actuales en UTC
    $datetime_actual_utc = new DateTime("now", $timezone_servidor);

    // Convertir la hora del servidor a hora de España
    $datetime_actual_utc->setTimezone($timezone_espana);

    // Obtener la fecha y hora actuales en España
    $fecha_hoy = $datetime_actual_utc->format('d-m-Y');
    $hora_actual = $datetime_actual_utc->format('H:i');


    // Convertir la fecha y hora de inicio de cobertura a DateTime en la zona horaria de España
    $datetime_inicio_cobertura = DateTime::createFromFormat('d-m-Y H:i', "$fecha_inicio_cobertura $hora_inicio_cobertura", $timezone_espana);

    // Añadir 1 hora a la hora actual en España
    $datetime_actual_mas_1_hora = (clone $datetime_actual_utc)->modify('+1 hour');

    // Comprobar si la fecha de inicio es hoy y la hora es anterior a 1 hora después de la hora actual
    if ( $datetime_inicio_cobertura < $datetime_actual_mas_1_hora) {
        // Actualizar la fecha y hora de inicio a la hora actual + 1 hora
        $datetime_inicio_cobertura = $datetime_actual_mas_1_hora;

        // Actualizar las variables originales
        $fecha_inicio_cobertura = $datetime_inicio_cobertura->format('d-m-Y');
        $hora_inicio_cobertura = $datetime_inicio_cobertura->format('H:i');
    }

    // Retornar los nuevos valores
    return [
        'fecha_inicio_cobertura' => $fecha_inicio_cobertura,
        'hora_inicio_cobertura'  => $hora_inicio_cobertura
    ];

}