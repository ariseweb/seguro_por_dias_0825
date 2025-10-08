<?php 
$path = __DIR__ . '/..';
require_once $path . "/services/transients-services.php";
require_once $path . "/services/projects-service.php";
require_once $path . "/services/correos-service.php";

ignore_user_abort(true); // El script sigue aunque el usuario cierre el navegador
set_time_limit(0); // Evita que el script se detenga por timeout

$id_poliza = $_GET['r'];
get_header();
wp_schedule_single_event(time() + (MINUTE_IN_SECONDS * 5), 'SPDA_acciones_posteriores_contratacion', [
    'id_poliza' => $id_poliza
]);


?>


<div id="primary" class="content-area viajes-inter">
<main id="main" class="site-main product-temp" role="main">

    <div class="container-mini-tarif-viajes" style="margin-top:-60px;">
        <img class="img-sgviajes thabnks-step" src="<?= AC_PLUGIN_URL."/img/gracias_1.svg"; ?>">

        <h2 class="title-viajes">¡Todo listo! Tu seguro por días ha sido confirmado</h2>
        <p><i>Muchas gracias por confiar en <?= SPDA_NAME_EMPRESA; ?>.</i></p>
        <div class="card-forms">

            <p>Muy pronto, <b>recibirás un correo electrónico directamente de la aseguradora</b> con todos los detalles de tu póliza y la documentación necesaria.</p>

    		<p>En <?= SPDA_NAME_EMPRESA; ?> <b>queremos ser tu correduría de confianza</b> protegiendo aquello que más te importa. </p>

    		<p>Explora ahora todos los seguros que podemos ofrecerte.</p>
            
            <a href="/listado-seguros/" class="btn btn-primary btn-rosa btn-viajes mt-4">Ver otros seguros</a>
        </div>
    </div>


<?php
get_footer();
?>-