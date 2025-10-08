<?php
/**
 * Template para los servicios que se ofrecen
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 */
require_once $path . "/services/catalog-services.php";


$fondo_coberturas = get_field('color_fondo_coberturas');
$fondo_z_libre = get_field('color_zona_libre');
$fondo_ventajas = get_field('color_fondo_puntos_dolor');
$fondo_faqs = get_field('color_fondo_faqs');
$fondo_adjuntos = get_field('color_fondo_docs_adjuntos');

if ($fondo_faqs == "verde") {
	$classfa = "siropesr";
}else{
	$classfa = "";
}

$producto = get_queried_object();
$id_producto_por_dias = get_field('categoria_iframe');



function filtrarPorIdCategoria($objeto, $idCategoria) {
    if (!isset($objeto['respuesta']) || $objeto['respuesta'] == null) {
        wp_enqueue_script('sweetalert', 'https://cdn.jsdelivr.net/npm/sweetalert2@11', [], null, true);
        wp_add_inline_script('sweetalert', "
            Swal.fire({
                title: 'Error!',
                text: 'Se acaba de producir un error para traer el catalogo de tipos. En estos momentos no podemos realizar la contratación de este seguro.  Por favor, disculpa las molestias e inténtalo más tarde.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        ");
        return [];
    }

    return array_filter($objeto['respuesta']->list, function($item) use ($idCategoria) {
        return $item->idCategoria === $idCategoria;
    });
}

$respuesta = SDNW_wp_get_tipos_vehiculos(false);
$id_producto_por_dias = (int) $id_producto_por_dias; // Sanitización
$productos = filtrarPorIdCategoria($respuesta, $id_producto_por_dias);

$select_escala_hidden = count($productos) > 1 ? '' : 'hidden';
get_header();


?>
    <script>
		sessionStorage.removeItem('idProductoPorDias');
        let idProductoPorDias = "<?php echo $id_producto_por_dias; ?>";
        sessionStorage.setItem('idProductoPorDias', idProductoPorDias);
    </script>

	<div id="primary" class="content-area pg-sgdias">
		<main id="main" class="site-main product-temp" role="main">
			<div class="container-fluid" style="background:#EAFCFD">
				<div class="container">
					<section id="title-seguro-present" class="franja">
						<div class="d-flex flex-row flex-wrap align-items-center align-items-md-end justify-items-between">
							<div class="col-12 col-md-6 text-start" id="text-val-b">
								<header>
									<h1 class="h1-servicios"><?php the_title(); ?></h1>
								</header>
								<h2 class="h3 text-primary"><?= wp_kses_post( get_field('subtitulo') ); ?></h2>
								<div class="ban-prod">
									<?= wp_kses_post( get_field('texto_subtitulo') ); ?>
								</div>
							</div>
							<div class="col-12 col-md-6" id="iframe-por-dias">
								<?php 
									$imagen_cat = get_the_post_thumbnail('','entry-image',array( 'class' => 'img-responsive' ,'title' => get_the_title()));;
									echo $imagen_cat;
								 ?>
							</div>
						</div>
					</section>
				</div>
			</div>

			<?php 
				switch ($id_producto_por_dias) {
	                case 11:
	                    require(SPDA_PLUGIN_PATH.'/parts/form-is-embarcaciones.php');
	                    break;
	                default:
	                    require(SPDA_PLUGIN_PATH.'/parts/form-no-embarcaciones.php');
	                    break;
	            }

			 ?>

			<div class="container-fluid">
				<!-- Incluimos la sección coberturas -->
				<?php include(SPDA_PLUGIN_PATH.'parts/parts-coberturas-producto.php'); ?>	
			</div>

			<div class="container-fluid txtseo-dias">
				<!-- Incluimos la sección de contenido libre -->
				<?php include(SPDA_PLUGIN_PATH.'parts/part-text-libre.php'); ?>
			</div>

			<div class="container-fluid ps-0 pe-0">
				<!-- Incluimos la sección de testimonios -->
				<?php include(TEMPLATEPATH.'/parts/parts-home/testimonios.php'); ?>
			</div>


			<div class="container-fluid">
				<!-- Incluimos la sección faqs -->
				<?php include(TEMPLATEPATH.'/parts/parts-productos/part-faqs.php'); ?>	
			</div>

			<div class="container-fluid" style="background:#EAFCFD">
				<!-- Incluimos la sección docs.adjuntos -->
				<?php include(TEMPLATEPATH.'/parts/parts-productos/part-adjuntos.php'); ?>
			</div>

			<div class="container-fluid">
				<!-- Incluimos la sección vinculados -->
				<?php include(TEMPLATEPATH.'/parts/parts-productos/part-prod-vinculados.php'); ?>
			</div>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();



