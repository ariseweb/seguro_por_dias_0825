<?php

/**
 * Códigos de países ISO 3166-1 alpha-2
 * Para el selector de país de expedición de matrícula
 */

/**
 * Lista de países permitidos específicos para el seguro por días
 * 
 * @return array Array asociativo con código ISO => nombre del país
 */
function SPDA_obtener_paises_principales() {
    return array(
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
}