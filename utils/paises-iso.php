<?php

/**
 * Devuelve una lista de países con su nombre y la URL de su bandera.
 * Utiliza los códigos de país ISO 3166-1 alpha-2.
 * Las imágenes de las banderas son de flagcdn.com (20px de ancho).
 *
 * @return array Array asociativo con código ISO => [nombre => 'NombrePaís', bandera_url => 'URL_Bandera']
 */
function SPDA_obtener_paises_con_banderas() {
    $paises = array(
        'AL' => 'Albania',
        'DE' => 'Alemania',
        'AD' => 'Andorra',
        'AZ' => 'Azerbaijan',
        'BY' => 'Belarus',
        'BE' => 'Bélgica',
        'BA' => 'Bosnia and Herzegowina',
        'BG' => 'Bulgaria',
        'CY' => 'Chipre',
        'HR' => 'Croacia',
        'CZ' => 'Czech Republic',
        'DK' => 'Dinamarca',
        'SK' => 'Eslovaquia',
        'SI' => 'Eslovenia',
        'ES' => 'España',
        'EE' => 'Estonia',
        'FI' => 'Finlandia',
        'FR' => 'Francia',
        'GR' => 'Grecia',
        'HU' => 'Hungría',
        'IS' => 'Iceland',
        'IE' => 'Irlanda',
        'IT' => 'Italia',
        'LV' => 'Latvia',
        'LT' => 'Lithuania',
        'LU' => 'Luxemburgo',
        'MK' => 'Macedonia, The Former Yugoslav Republic of',
        'MT' => 'Malta',
        'MD' => 'Moldova, Republic of',
        'ME' => 'Montenegro',
        'NL' => 'Netherlands',
        'NO' => 'Norway',
        'PL' => 'Poland',
        'GB' => 'Reino Unido',
        'RO' => 'Romania',
        'RU' => 'Russian Federation',
        'SE' => 'Sweden',
        'CH' => 'Switzerland',
        'TR' => 'Turkey',
        'UA' => 'Ukraine'
    );

    $resultado = [];
    foreach ($paises as $codigo => $nombre) {
        // Se construye la URL usando el código de país en minúsculas.
        $url_bandera = 'https://flagcdn.com/w20/' . strtolower($codigo) . '.png';
        
        $resultado[$codigo] = [
            'nombre' => $nombre,
            'bandera_url' => $url_bandera
        ];
    }
    
    return $resultado;
}

?>