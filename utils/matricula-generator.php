<?php

/**
 * Generador de matrículas para diferentes categorías de vehículos
 * Basado en las expresiones regulares definidas en spda_scripts.js
 */

/**
 * Genera una matrícula válida para la categoría de vehículo especificada
 * 
 * @param string $categoria_id ID de la categoría del vehículo
 * @return string Matrícula generada
 */
function SPDA_generar_matricula($categoria_id) {
    
    // Mapeo de categorías con sus patrones de matrícula permitidos
    $patrones_por_categoria = array(
        '1' => array('historicos', 'current', 'pre1971', 'pre2000', 'P', 'S', 'V', 'H2', 'H3', 'PP'),
        '10' => array('current', 'pre1971', 'pre2000', 'P', 'S', 'V', 'R3'),
        '4' => array('H', 'pre1971', 'pre2000'),
        '19' => array('current', 'pre1971', 'pre2000', 'P', 'S', 'V'),
        '23' => array('C3', 'E3', 'current', 'P', 'S', 'V'),
        '38' => array('current', 'pre1971', 'pre2000', 'P', 'S', 'V'),
        '3' => array('current', 'pre1971', 'pre2000', 'P', 'S', 'V'),
        '2' => array('C3', 'current', 'pre1971', 'pre2000', 'P', 'S', 'V'),
        '59' => array('C3', 'current', 'pre1971', 'pre2000', 'P', 'S', 'V'),
        '60' => array('current', 'pre1971', 'pre2000', 'P', 'S', 'V'),
        '5' => array('H', 'pre1971', 'pre2000'),
        '8' => array('current', 'pre1971', 'pre2000', 'P', 'S', 'V'),
        '7' => array('current', 'pre1971', 'pre2000', 'P', 'S', 'V'),
        '9' => array('R2', 'R3', 'E3'),
        '14' => array('E3', 'pre2000'),
        '15' => array('E3', 'pre2000')
    );
    
    // Si no existe la categoría, usar patrón genérico (current)
    if (!isset($patrones_por_categoria[$categoria_id])) {
        $patrones = array('current');
    } else {
        $patrones = $patrones_por_categoria[$categoria_id];
    }
    
    // Seleccionar el primer patrón disponible (se puede randomizar si se desea)
    $patron_seleccionado = $patrones[0];
    
    return SPDA_generar_matricula_por_patron($patron_seleccionado);
}

/**
 * Genera una matrícula según el patrón especificado
 * 
 * @param string $patron Tipo de patrón a generar
 * @return string Matrícula generada
 */
function SPDA_generar_matricula_por_patron($patron) {
    
    switch ($patron) {
        case 'current':
            // Formato: 1234BBC (4 números + 3 letras sin vocales ni Ñ)
            return SPDA_generar_numero_aleatorio(4) . SPDA_generar_letras_consonantes(3);
            
        case 'pre1971':
            // Formato: AB1234C o AB1234CD (2 letras + 4 números + 1-2 letras)
            $sufijo_letras = rand(1, 2);
            return SPDA_generar_letras_cualquiera(2) . SPDA_generar_numero_aleatorio(4) . SPDA_generar_letras_cualquiera($sufijo_letras);
            
        case 'pre2000':
            // Formato: A1234BC o AB1234BC (1-2 letras + 4 números + 2 letras)
            $prefijo_letras = rand(1, 2);
            return SPDA_generar_letras_cualquiera($prefijo_letras) . SPDA_generar_numero_aleatorio(4) . SPDA_generar_letras_cualquiera(2);
            
        case 'P':
            // Formato: P1234ABC (P + 4 números + 3 letras)
            return 'P' . SPDA_generar_numero_aleatorio(4) . SPDA_generar_letras_cualquiera(3);
            
        case 'S':
            // Formato: S1234ABC (S + 4 números + 3 letras)
            return 'S' . SPDA_generar_numero_aleatorio(4) . SPDA_generar_letras_cualquiera(3);
            
        case 'V':
            // Formato: V1234BBC (V + 4 números + 3 letras sin vocales ni Ñ)
            return 'V' . SPDA_generar_numero_aleatorio(4) . SPDA_generar_letras_consonantes(3);
            
        case 'H':
            // Formato: H1234ABC (H + 4 números + 3 letras)
            return 'H' . SPDA_generar_numero_aleatorio(4) . SPDA_generar_letras_cualquiera(3);
            
        case 'H2':
            // Formato: H1234AB (H + 4 números + 2 letras)
            return 'H' . SPDA_generar_numero_aleatorio(4) . SPDA_generar_letras_cualquiera(2);
            
        case 'H3':
            // Formato: H1234ABC (H + 4 números + 3 letras)
            return 'H' . SPDA_generar_numero_aleatorio(4) . SPDA_generar_letras_cualquiera(3);
            
        case 'PP':
            // Formato: AB123456 (2 letras cualesquiera + 6 números)
            return SPDA_generar_letras_cualquiera(2) . SPDA_generar_numero_aleatorio(6);
            
        case 'C3':
            // Formato: C1234ABC (C + 4 números + 3 letras)
            return 'C' . SPDA_generar_numero_aleatorio(4) . SPDA_generar_letras_cualquiera(3);
            
        case 'E3':
            // Formato: E1234ABC (E + 4 números + 3 letras)
            return 'E' . SPDA_generar_numero_aleatorio(4) . SPDA_generar_letras_cualquiera(3);
            
        case 'E2':
            // Formato: E1234AB (E + 4 números + 2 letras)
            return 'E' . SPDA_generar_numero_aleatorio(4) . SPDA_generar_letras_cualquiera(2);
            
        case 'R2':
            // Formato: R1234AB (R + 4 números + 2 letras)
            return 'R' . SPDA_generar_numero_aleatorio(4) . SPDA_generar_letras_cualquiera(2);
            
        case 'R3':
            // Formato: R1234ABC (R + 4 números + 3 letras)
            return 'R' . SPDA_generar_numero_aleatorio(4) . SPDA_generar_letras_cualquiera(3);
            
        case 'historicos':
            // Formato: AB12345 o AB123456 (1-2 letras + 5-6 números)
            $prefijo_letras = rand(1, 2);
            $numeros = rand(5, 6);
            return SPDA_generar_letras_cualquiera($prefijo_letras) . SPDA_generar_numero_aleatorio($numeros);
            
        default:
            // Por defecto, generar formato actual
            return SPDA_generar_numero_aleatorio(4) . SPDA_generar_letras_consonantes(3);
    }
}

/**
 * Genera un número aleatorio de la longitud especificada
 * 
 * @param int $longitud Número de dígitos
 * @return string Número generado
 */
function SPDA_generar_numero_aleatorio($longitud) {
    $numero = '';
    for ($i = 0; $i < $longitud; $i++) {
        $numero .= rand(0, 9);
    }
    return $numero;
}

/**
 * Genera letras consonantes aleatorias (sin vocales ni Ñ)
 * 
 * @param int $cantidad Número de letras a generar
 * @return string Letras generadas
 */
function SPDA_generar_letras_consonantes($cantidad) {
    $consonantes = 'BCDFGHJKLMNPRSTVWXYZ';
    $letras = '';
    for ($i = 0; $i < $cantidad; $i++) {
        $letras .= $consonantes[rand(0, strlen($consonantes) - 1)];
    }
    return $letras;
}

/**
 * Genera letras aleatorias cualquiera
 * 
 * @param int $cantidad Número de letras a generar
 * @return string Letras generadas
 */
function SPDA_generar_letras_cualquiera($cantidad) {
    $letras_alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $letras = '';
    for ($i = 0; $i < $cantidad; $i++) {
        $letras .= $letras_alfabeto[rand(0, strlen($letras_alfabeto) - 1)];
    }
    return $letras;
}

/**
 * Obtiene una matrícula por defecto para testing/demo
 * basada en la categoría del vehículo
 * 
 * @param string $categoria_id ID de la categoría del vehículo
 * @return string Matrícula de ejemplo
 */
function SPDA_obtener_matricula_default($categoria_id) {
    
    // Matrículas de ejemplo fijas por categoría para consistencia
    $matriculas_default = array(
        '1' => 'AB123456',   // Coches - formato 2 letras + 6 números
        '2' => '2345CCC',   // Ciclomotores - formato actual
        '3' => '3456DDD',   // Motocicletas - formato actual
        '4' => 'H1234ABC',  // Embarcaciones de recreo - formato H
        '5' => 'H5678DEF',  // Embarcaciones comerciales - formato H
        '7' => '7890FFF',   // Quads - formato actual
        '8' => '8901GGG',   // Vehículos especiales - formato actual
        '9' => 'R1234AB',   // Remolques - formato R2
        '10' => '0123HHH',  // Autocaravanas - formato actual
        '14' => 'E1234ABC', // Vehículos eléctricos L6e - formato E3
        '15' => 'E5678DEF', // Vehículos eléctricos L7e - formato E3
        '19' => '9012JJJ',  // Otros vehículos - formato actual
        '23' => 'C1234ABC', // Ciclomotores especiales - formato C3
        '38' => '3827KKK',  // Motocicletas turismo - formato actual
        '59' => 'C5934ABC', // Ciclomotores de tres ruedas - formato C3
        '60' => '6045LLL'   // Otros vehículos especiales - formato actual
    );
    
    // Si existe matrícula específica para la categoría, la devolvemos
    if (isset($matriculas_default[$categoria_id])) {
        return $matriculas_default[$categoria_id];
    }
    
    // Si no, generamos una usando el generador
    return SPDA_generar_matricula($categoria_id);
}