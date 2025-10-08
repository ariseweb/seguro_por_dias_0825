<div class="text-start franja franja-forms-viajes pt-1 pb-3">
    <div class="d-flex justify-content-end align-items-start flex-wrap">

        <?php
        
        // Determinar la clase basada en el número de elementos
	        $num_elements = count($nombre_polizas);
	        $li_class = "";

	        switch ($num_elements) {
	            case 3:
	                $li_class = "nav-item third-width";
	                break;
	            case 2:
	                $li_class = "nav-item two-width";
	                break;
	            case 1:
	                $li_class = "nav-item one-width";
	                break;
	            default:
	                $li_class = "nav-item";
	                break;
	        }
        ?>

        <ul class="nav nav-tabs" id="polizasTab">
            <?php foreach ($nombre_polizas as $index => $nombre): ?>
                <?php
                $precio = $precios_polizas[$index];
                $anotacion_precio = $anotaciones_precio[$index];
                $icono = $url_iconos[$index];
                $id_tab = 'tabItem' . ($index + 1);
                ?>
                
                <li class="<?= $li_class; ?>">
                    <a class="nav-link polizaTab" data-policy="1" id="<?= $id_tab; ?>-tab" data-bs-toggle="tab" href="#<?= $id_tab; ?>" role="tab">
                        <img src="<?= $icono; ?>" alt="icono">
                        <?= $nombre; ?></br>
                        <span class="prMvop" id="prc-tab-<?= strtolower($nombre); ?>">
                            <?= $precio; ?> <span class="mini-moneda"><?= $anotacion_precio; ?></span>
                        </span>
                    </a>
                </li>
            <?php endforeach; ?>
        </ul>

        <div class="tab-content">
            <?php foreach ($nombre_polizas as $index => $nombre): ?>
                <?php
                $precio = $precios_polizas[$index];
                $anotacion_precio = $anotaciones_precio[$index];
                $small_precio = $small_precios[$index];
                $icono = $url_iconos[$index];
                $id_tab = 'tabItem' . ($index + 1);
                ?>
                <div class="tab-pane fade<?= $index === 0 ? ' show active' : ''; ?>" id="<?= $id_tab; ?>" role="tabpanel">
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

                    <h3 class="accordion-header" id="heading<?= $index + 1; ?>">
                        <button class="accordion-button no-icon" type="button" data-bs-toggle="collapse" data-bs-target="#" aria-expanded="true" aria-controls="collapse<?= $index + 1; ?>">Comparativa de coberturas</button>
                    </h3>

                    <div class="accordion-collapse collapse show" aria-labelledby="heading<?= $index + 1; ?>" data-bs-parent="#miAcordeon">
                        <div class="accordion-body">
                            <?php foreach ($coberturas as $cobertura): ?>
                                <?php if ($cobertura['titulo']): ?>
                                    <table class="table_cob_viajes">
                                        <tbody>
                                            <tr>
                                                <td class="text-left tam3_tab"><?= $cobertura['titulo']; ?></td>
                                                <td class="text-center valor_cobertura_viajes"><?= $cobertura['valores'][$index]; ?></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <?php if ($url_condicionado != ""): ?>
            <div class="cond-gen-box">
                <a class="color-azul bold" target="_blank" href="<?= $url_condicionado; ?>">
                    <img class="down-condi" src="/wp-content/plugins/intermundial-api-plugin/img/download_icon.svg" alt="Condicionado general"> Condiciones particulares
                </a>
            </div>
        <?php endif; ?>
    </div>
</div>
