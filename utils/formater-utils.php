<?php


function SDNW_convertDateFormat($date) {
    // Expresión regular para validar el formato dd-MM-yyyy
    $pattern = '/^(\d{2})-(\d{2})-(\d{4})$/';

    // Verificar si la fecha coincide con el patrón
    if (preg_match($pattern, $date, $matches)) {
        // Extraer los componentes de la fecha
        $day = $matches[1];
        $month = $matches[2];
        $year = $matches[3];

        // Validar la fecha usando checkdate
        if (checkdate($month, $day, $year)) {
            // Crear un objeto DateTime a partir de la fecha
            $dateTime = DateTime::createFromFormat('d-m-Y', $date);

            // Retornar la fecha en el nuevo formato
            return $dateTime->format('Y-m-d');
        } else {
            return null;
        }
    } else {
        return null;
    }
}
?>
