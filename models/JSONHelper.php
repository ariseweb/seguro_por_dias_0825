<?php
class JSONHelper {
    public function toJSONSinNulos() {
        // Filtrar los atributos nulos del objeto
        $objeto_sin_nulos = (object) array_filter((array) $this, function ($valor) {
            return $valor !== null;
        });

        // Codificar el objeto filtrado a JSON
        return json_encode($objeto_sin_nulos,JSON_UNESCAPED_SLASHES);
    }
}