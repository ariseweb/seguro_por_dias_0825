<?php 

get_header();

 ?>


<div id="primary" class="content-area viajes-inter">
<main id="main" class="site-main product-temp" role="main">

    <div class="container-mini-tarif-viajes">
        <img class="img-sgviajes" src="<?= SPDA_PLUGIN_URL."/img/seguro-dias.svg"; ?>" alt="Calcula el precio de tu seguro por días">
		<?php 
			// Incluir el archivo desde la carpeta "parts"
			include( SPDA_PLUGIN_PATH . 'parts/steps-form.php' );
		?>	
        <h2 class="title-viajes">Se ha producido un error.</h2>
        <p><i>Sentimos las molestias.</i></p>
        <div class="card-forms">
            
            <p>No se ha podido finalizar el proceso de contratación. Por favor, vuelve a intentarlo de nuevo, y en caso de no poder completarlo puedes ponerte en contacto con nosotros. </p>
            
            <a href="/contacto/" class="btn btn-primary btn-viajes">Contacto</a>
        </div>
	    <?php 
	        //Footer viajes
	        require(SPDA_PLUGIN_PATH . 'parts/mini-footer.php');
	     ?>

    </div>


<?php
get_footer();
?>