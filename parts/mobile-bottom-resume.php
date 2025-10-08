<?php

// Escapar la URL de la imagen para evitar problemas de seguridad
    $arrow_up_img = esc_url('/wp-content/plugins/seguro-por-dias-api/img/arrow_up.svg');
?>

<div class="price-mobile-bottom">
    <div class="d-flex justify-content-between align-items-center">
        <img class="show-dt" src="<?php echo $arrow_up_img; ?>" alt="Mostrar y ocultar info">
        <div>
            <div class="d-flex justify-content-between align-items-center">
                <h6 class="licrin">Tu seguro por:</h6>
                <span class="prc-seguro-spdmb price-bottom-mobile"></span>
            </div>
        </div>
    </div>
</div>
