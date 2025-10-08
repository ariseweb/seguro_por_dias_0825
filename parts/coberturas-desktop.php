<div class="text-start franja franja-forms-viajes pt-1 pb-3">
    <div class="d-flex justify-content-end align-items-start flex-wrap" id="form_datos_select_productos">

        <?php

        // Generar tantas card-viaje-option como valores en los arrays
        foreach ($nombre_polizas as $index => $nombre): 
            $precio = $precios_polizas[$index];
            $anotacion_precio = $anotaciones_precio[$index];
            $small_precio = $small_precios[$index];
            $icono = $url_iconos[$index];
        ?>
            <div class="card-viaje-option">
                <div class="d-flex justify-content-start align-items-start justify-content-center name-price-inter">
                    <div class="text-center">
                        <div class="icono-viaje">
                            <img src="<?= $icono; ?>" alt="">
                        </div>
                        <div class="name-prod-viaje"><?= $nombre; ?></div>
                        <div class="price-inter"><?= $precio; ?> <span class="mini-moneda"><?= $anotacion_precio; ?></span></div>
                        <a href="#" data-poliza="<?= $index + 1; ?>" class="btn btn-primary btn-viajes acc-selector spec">Contratar ahora</a>
                        <small class="poliza-small-advice color-azul"><?= $small_precio; ?></small>
                    </div>  
                </div>                              
            </div>
        <?php endforeach; ?>

    </div>

    <h3 class="accordion-header" id="heading1">
        <button class="accordion-button no-icon" type="button" data-bs-toggle="collapse" data-bs-target="#" aria-expanded="true" aria-controls="collapse1">Comparativa de coberturas</button>
    </h3>

    <div class="accordion-collapse collapse show" aria-labelledby="heading1" data-bs-parent="#miAcordeon">
        <div class="accordion-body">
            <?php foreach ($coberturas as $cobertura): ?>
                <?php if ($cobertura['titulo']): ?>
                    <table class="table_cob_viajes">
                        <tbody>
                            <tr>
                                <td class="text-left tam3_tab"><?= $cobertura['titulo']; ?></td>
                                <?php foreach ($cobertura['valores'] as $valor): ?>
                                    <td class="text-center valor_cobertura_viajes"><?= $valor; ?></td>
                                <?php endforeach; ?>
                            </tr>
                        </tbody>
                    </table>
                <?php endif; ?>
            <?php endforeach; ?>
        </div>
    </div>

    <?php if ($url_condicionado != ""): ?>
        <div class="cond-gen-box">
            <a class="color-azul bold" target="_blank" href="<?= $url_condicionado; ?>">
                <img class="down-condi" src="/wp-content/plugins/intermundial-api-plugin/img/download_icon.svg" alt="Condicionado general"> Condiciones particulares
            </a>
        </div>
    <?php endif; ?>

</div>
