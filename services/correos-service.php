<?php

function SPDA_enviar_correo_green_card_contratada($data) {
    $required_fields = [
        'idVenta', 'nombre-tomador', 'primer_apellido-tomador',
        'segundo-apellido-tomador', 'marca_vehiculo', 
        'modelo_vehiculo', 'matricula_vehiculo'
    ];

    $missing_fields = [];
    foreach ($required_fields as $field) {
        if (!isset($data[$field])) {
            $missing_fields[] = $field;
        }
    }

    if (!empty($missing_fields)) {
        return [
            'errores' => [['error' => 'Faltan campos obligatorios: ' . implode(', ', $missing_fields)]],
            'respuesta' => null
        ];
    }

    $green_card = isset($data['cartaverde']) && $data['cartaverde'] === "true";

    if (!$green_card) {
        return [
            'errores' => [],
            'respuesta' => [['mensaje' => 'No se mandó correo']]
        ];
    }

    $idVenta = $data['idVenta'];
    $nombre_tomador = $data['nombre-tomador'];
    $primer_apellido_tomador = $data['primer_apellido-tomador'];
    $segundo_apellido_tomador = $data['segundo-apellido-tomador'];
    $marca_vehiculo = $data['marca_vehiculo'];
    $modelo_vehiculo = $data['modelo_vehiculo'];
    $matricula_vehiculo = $data['matricula_vehiculo'];
    $email_tomador = $data['email-tomador'];
    $identificador_tomador = $data['identificador-tomador'];

    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . sanitize_email(SPDA_MAIL_EMPRESA),
        'Reply-To: ' . sanitize_email(SDNW_MAIL),
    ];

    $correos_empresa = [SPDA_MAIL_EMPRESA, SDNW_MAIL];
    $asunto1 = "Emisión Carta Verde | Certificado Internacional de Seguro - " . SPDA_NAME_EMPRESA;

    ob_start();
    require SPDA_PLUGIN_PATH . 'templates/template-mail-cartaverde.php';
    $mensaje1 = ob_get_clean();

    $wp_mail_result1 = wp_mail($correos_empresa, $asunto1, $mensaje1, $headers);

    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . sanitize_email(SPDA_MAIL_EMPRESA),
        'Reply-To: ' . sanitize_email($email_tomador),
    ];
    $correos_cliente = [SPDA_MAIL_EMPRESA, $email_tomador];
    $asunto2 = "Emisión Carta Verde | Certificado Internacional de Seguro";

    ob_start();
    require SPDA_PLUGIN_PATH . 'templates/template-mail-cartaverde-cliente.php';
    $mensaje2 = ob_get_clean();

    $wp_mail_result2 = wp_mail($correos_cliente, $asunto2, $mensaje2, $headers);

    if (!$wp_mail_result1) {
        insu_registrar_error_insuguru(__FUNCTION__, "Error al enviar correo carta verde: " . json_encode($wp_mail_result1), SPDA_INSU_PRODUCT_ID);
        return [
            'errores' => [['error' => 'El correo no pudo ser enviado a seguro por días']],
            'respuesta' => null
        ];
    }

    if (!$wp_mail_result2) {
        insu_registrar_error_insuguru(__FUNCTION__, "Error al enviar correo carta verde: " . json_encode($wp_mail_result2), SPDA_INSU_PRODUCT_ID);
        return [
            'errores' => [['error' => 'El correo no pudo ser enviado al cliente']],
            'respuesta' => null
        ];
    }

    return [
        'errores' => [],
        'respuesta' => [['mensaje' => 'El correo fue enviado con éxito']]
    ];
}


function SPDA_enviar_correo_recordatorio_finalizacion($data) {
    try {
        $email = $data['email-tomador'];
        $fecha_inicio = $data['fecha_inicio_cobertura'];
        $hora_inicio = $data['hora_inicio_cobertura'];
        $marca = $data['marca_vehiculo'];
        $modelo = $data['modelo_vehiculo'];
        $matricula = $data['matricula_vehiculo'];
        $nombre = $data['nombre-tomador'];
        $primer_apellido = $data['primer_apellido-tomador'];
        $segundo_apellido = $data['segundo-apellido-tomador'];
        $num_dias = $data['num-dias-seguro'];
        $temporalidad = $data['temporalidad'];

        $start = SDNW_validate_change_start_hour($fecha_inicio, $hora_inicio);
        $fecha_inicio = SDNW_convertDateFormat($start['fecha_inicio_cobertura']);

        if (!$fecha_inicio) {
            return ['errores' => [['error' => 'Fecha de inicio inválida']], 'respuesta' => null];
        }

        $fecha_hora_inicio = "$fecha_inicio {$start['hora_inicio_cobertura']}";
        $date = new DateTime($fecha_hora_inicio, new DateTimeZone('Europe/Madrid'));
        $date->setTimezone(new DateTimeZone('UTC'));

        if ($num_dias > 28 && $temporalidad === 'dias') {
            if ($num_dias % 7 !== 0) {
                return ['errores' => [['error' => 'Para más de 28 días, usa semanas completas']], 'respuesta' => null];
            }
            $temporalidad = 'semanas';
            $num_dias /= 7;
        }

        $interval = $temporalidad === 'dias' ? new DateInterval("P{$num_dias}D") : new DateInterval("P{$num_dias}W");
        $date->add($interval);
        $date->sub(new DateInterval('PT2H'));
        $timestamp = $date->getTimestamp();

        wp_schedule_single_event($timestamp, 'SPDA_enviar_correo_poliza_evento', [
            'email' => $email,
            'nombre_tomador' => $nombre,
            'primer_apellido_tomador' => $primer_apellido,
            'segundo_apellido_tomador' => $segundo_apellido,
            'marca_vehiculo' => $marca,
            'modelo_vehiculo' => $modelo,
            'matricula_vehiculo' => $matricula
        ]);

        return ['errores' => [], 'respuesta' => ['mensaje' => 'Correo programado con éxito']];
    } catch (\Throwable $th) {
        return ['errores' => [['error' => 'Se generó un error al programar el correo']], 'respuesta' => null];
    }
}

function SPDA_enviar_correo_poliza_cron_service($email, $nombre_tomador, $primer_apellido_tomador,
    $segundo_apellido_tomador, $marca_vehiculo, $modelo_vehiculo, $matricula_vehiculo) {

    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . sanitize_email(SPDA_MAIL_EMPRESA),
        'Reply-To: ' . sanitize_email(SPDA_MAIL_EMPRESA),
    ];

    $correos = [$email];
    $asunto = "Recordatorio de finalización de cobertura de seguro por días - " . SPDA_NAME_EMPRESA;

    ob_start();
    require SPDA_PLUGIN_PATH . 'templates/template-mail-recordatorio.php';
    $mensaje = ob_get_clean();

    $resultado = wp_mail($correos, $asunto, $mensaje, $headers);

    if (!$resultado) {
        error_log('NO SE ENVIO EL CORREO DE RECORDATORIO PORQUE FALLO MAIL');
        insu_registrar_error_insuguru(__FUNCTION__, "Error al enviar correo: " . json_encode($resultado), SPDA_INSU_PRODUCT_ID);
        return false;
    }

    return true;
}