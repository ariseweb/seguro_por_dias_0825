<?php

/*
Plugin Name: Seguro por días API
Plugin URI:  https://ariseweb.es
Description: Tarificación y contratación seguro de por días con la API de seguropordias.com
Version:     1.0
Author:      Ariseweb
Author URI:  https://ariseweb.es
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: seguro-por-dias-api
*/

//LIBRERIA PARA UNIR PDF DE LA DOCUMENTACION
use mikehaertl\pdftk\Pdf as MikeheartSPDA;

if (!defined('ABSPATH')) {
   exit; // Exit if accessed directly.
}


//Añadimos el autoload de composer
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
   require __DIR__ . '/vendor/autoload.php';
}


// Definición de constantes básicas del plugin
define('SPDA_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('SPDA_PLUGIN_URL', plugins_url('/', __FILE__));


define('SPDA_TEMPLATE_LANDING_PRODUCTO', 'templates/landing-producto-template.php');
define('SPDA_TEMPLATE_EMAIL', 'templates/plantilla-email.php');


//Definir las constantes relativas a la INSTALACIÓN
define('SPDA_SLUG_LANDING_PRODUCTO', 'seguros-por-dias');
define('SPDA_PRODUCT_ID_WORDPRESS', 1);  //ID del post  en wordpress que corresponde con el desarrollo.
define('SPDA_INSU_PRODUCT_ID', '1');


// VALORES A DEFINIR SOBRE LA CORREDURÍA
define('SPDA_NAME_EMPRESA', WPCONFIG_NAME_EMPRESA);
define('SPDA_URLEMPRESA', WPCONFIG_URLEMPRESA);
define('SPDA_MAIL_EMPRESA', WPCONFIG_MAIL_EMPRESA);
define('SPDA_LOGO_TOP_EMPRESA', WPCONFIG_LOGO_TOP_EMPRESA);
define('SPDA_LOGO_ORIGINAL_EMPRESA', WPCONFIG_LOGO_ORIGINAL_EMPRESA);   //Idealmente SVG
define('SPDA_DIRECCION_EMPRESA', WPCONFIG_DIRECCION_EMPRESA);
define('SPDA_TELEFONO_EMPRESA', WPCONFIG_TELEFONO_EMPRESA);
define('SPDA_TELEFONO_EMPRESA_2', WPCONFIG_TELEFONO_EMPRESA_2);
define('SPDA_CODIGO_MEDIADOR', 5);



// Definir las constantes del producto DEVELOPMENT
define('SPDA_PRODUCTO_NOMBRE', 'Seguro por días API');
define('SPDA_PRODUCTO_DESCRIPCION', 'Seguro por días desarrollado con la api de seguropordias.com');
define('SPDA_IMAGEN_PLUGIN', SPDA_PLUGIN_URL."/img/seguro-dias.svg");





add_action('plugins_loaded', function() {
    if (function_exists('insu_obtener_credencial_atributo')) {
      // Obtención dinámica de credenciales desde insuguru
      $sdnw_username = insu_obtener_credencial_atributo(SPDA_INSU_PRODUCT_ID, 'SDNW_USERNAME');
      $sdnw_password = insu_obtener_credencial_atributo(SPDA_INSU_PRODUCT_ID, 'SDNW_PASSWORD');
      $sdnw_grant_type = insu_obtener_credencial_atributo(SPDA_INSU_PRODUCT_ID, 'SDNW_GRANT_TYPE');
      $sdnw_client_id = insu_obtener_credencial_atributo(SPDA_INSU_PRODUCT_ID, 'SDNW_CLIENT_ID');
      $sdnw_client_secret = insu_obtener_credencial_atributo(SPDA_INSU_PRODUCT_ID, 'SDNW_CLIENT_SECRET');
      $sdnw_url = insu_obtener_credencial_atributo(SPDA_INSU_PRODUCT_ID, 'SDNW_URL');
      $sdnw_partner = insu_obtener_credencial_atributo(SPDA_INSU_PRODUCT_ID, 'SDNW_PARTNER');
      $sdnw_url_ok = insu_obtener_credencial_atributo(SPDA_INSU_PRODUCT_ID, 'SDNW_URL_OK');
      $sdnw_url_ko = insu_obtener_credencial_atributo(SPDA_INSU_PRODUCT_ID, 'SDNW_URL_KO');
         
      define('SDNW_USERNAME', $sdnw_username);
      define('SDNW_PASSWORD', $sdnw_password);
      define('SDNW_GRANT_TYPE', $sdnw_grant_type);
      define('SDNW_CLIENT_ID', $sdnw_client_id);
      define('SDNW_CLIENT_SECRET', $sdnw_client_secret);
      define('SDNW_URL', $sdnw_url);
      define('SDNW_PARTNER', $sdnw_partner);
      define('SDNW_URL_OK', $sdnw_url_ok);
      define('SDNW_URL_KO', $sdnw_url_ko);
    } else {
        error_log('insu_obtener_credencial_atributo no está disponible.');
    }
});

//Correos notificaciones
define('SDNW_MAIL', 'info@seguropordias.com');
define('SDNW_MAIL_FOR_ERROR_LOG', 'admin@ariseweb.es.com');



//Cargamos los archivos necesarios
require_once "services/catalog-services.php";
require_once "services/quotations-service.php";
require_once "services/projects-service.php";
require_once "services/transients-services.php";
require_once "services/correos-service.php";
require_once "services/documents-service.php";




require_once "models/Quotation.php";
require_once "models/Vehicle.php";
require_once "models/PolicyHolder.php";
require_once "models/Policy.php";
require_once "models/InsuranceData.php";
require_once "models/Redirects.php";

require_once "utils/response-utils.php";

require_once "utils/formater-utils.php";
require_once "utils/validation-utils.php";
require_once "utils/matricula-generator.php";
require_once "utils/paises-iso.php";



//Hook activación insuguru
function SPDA_insu_activar_plugin_insuguru() {

   // Obtener el basename del plugin
   $plugin_basename = plugin_basename(__FILE__);
   insu_activar_plugin_insuguru($plugin_basename, SPDA_INSU_PRODUCT_ID);
}

register_activation_hook(__FILE__, 'SPDA_insu_activar_plugin_insuguru');



//Hook desactivación insuguru
function SPDA_insu_desactivar_plugin_insuguru() {

   $plugin_basename = plugin_basename(__FILE__);
   insu_desactivar_plugin_insuguru($plugin_basename, SPDA_INSU_PRODUCT_ID);
}

register_deactivation_hook(__FILE__, 'SPDA_insu_desactivar_plugin_insuguru');



// Verificación de plugins requeridos
function SPDA_check_required_plugins() {
   $required_plugins = [
      'seo-by-rank-math/rank-math.php' => 'Rank Math SEO',
      'asegura-core/asegura-core.php' => 'Asegura Core',
      'insuguru-wp-plugin/insuguru-wp-plugin.php' => 'Insuguru Plugin',
      'turnstile-asegura-security/turnstile-asegura-security.php' => 'Turnstyle Security'
   ];

   $missing_plugins = [];

   foreach ($required_plugins as $plugin => $name) {
      if (!is_plugin_active($plugin)) {
         $missing_plugins[] = $name;
      }
   }


   if (!empty($missing_plugins)) {
      deactivate_plugins(plugin_basename(__FILE__));
      wp_die(
         sprintf(__('Este plugin requiere los siguientes plugins: %s. Por favor, actívalos o instálalos primero.', 'text-domain'), implode(', ', $missing_plugins)),
         __('Plugins requeridos no encontrados', 'text-domain'),
         array('back_link' => true)
      );
   }
}




/******* ESTA FUNCIÓN GENERAS LAS PÁGINAS NECESARIAS PARA EL FUNCIONAMIENTO DEL PLUGIN **********/
function SPDA_crear_paginas()
{

   // Listado de páginas del plugin
   require SPDA_PLUGIN_PATH . 'utils/paginas-crear-caracteristicas.php';

   foreach ($SPDA_paginas as $pagina) {

      if (empty($pagina['slug']) || empty($pagina['title']))
         continue;

      $pagina_existente = get_page_by_path(sanitize_title($pagina['slug']));

      if (!$pagina_existente) {
         $id = wp_insert_post(
            array(
               'post_title' => sanitize_text_field($pagina['title']),
               'post_name' => sanitize_title($pagina['slug']),
               'post_content' => wp_kses_post($pagina['content']),
               'post_status' => 'publish',
               'post_type' => 'page',
            )
         );

         if (is_wp_error($id)) {
            error_log('Error creating page: ' . $id->get_error_message());
            continue;
         }

         // Añadir meta datos con Rank Math
         if (isset($pagina['meta_title']))
            update_post_meta($id, 'rank_math_title', sanitize_text_field($pagina['meta_title']));
         if (isset($pagina['meta_description']))
            update_post_meta($id, 'rank_math_description', sanitize_text_field($pagina['meta_description']));
         if (isset($pagina['indexable']))
            update_post_meta($id, 'rank_math_robots', $pagina['indexable'] ? 'index' : 'noindex');
         if (isset($pagina['visible_in_search']))
            update_post_meta($id, 'exclude_from_search', !$pagina['visible_in_search']);
      }
   }
}

register_activation_hook(__FILE__, 'SPDA_crear_paginas');




/******* Eliminación de las páginas creadas por el plugin en caso de que se desinstale  **********/
function SPDA_eliminar_paginas()
{

   // Listado de páginas del plugin
   require SPDA_PLUGIN_PATH . 'utils/paginas-crear-caracteristicas.php';

   $page_slugs = array_map(function ($pagina) {
      return $pagina['slug'];
   }, $SPDA_paginas);

   foreach ($page_slugs as $slug) {
      $pagina = get_page_by_path(sanitize_title($slug));
      if ($pagina) {
         $result = wp_delete_post($pagina->ID, true);
         if (!$result)
            error_log('No se pudo eliminar la página con slug: ' . $slug);
      }
   }
}

register_uninstall_hook(__FILE__, 'SPDA_eliminar_paginas');



/*******  Para las páginas creadas, asociamos la plantilla de la carpeta templates asociada a dicha página   ***********/
function SPDA_custom_page_template($template)
{

   require 'utils/paginas-crear-caracteristicas.php';
   global $post;

   // Extrae los slugs de las páginas de la variable 
   $page_slugs = array_map(function ($pagina) {
      return $pagina['slug'];
   }, $SPDA_paginas);

   if (null === $post) {
      return $template;
   }

   // Verifica si es una página de búsqueda
   if (is_search()) {
      return $template;
   }

   foreach ($page_slugs as $slug) {
      if ($post->post_name == $slug) {
         // Retorna la plantilla personalizada correspondiente al slug
         return SPDA_PLUGIN_PATH . 'templates/' . $slug . '.php';
      }
   }

   return $template;  // Retorna la plantilla original si no cumple con ninguna condición
}

add_filter('template_include', 'SPDA_custom_page_template');




/*******   Redirección de la plantilla del CPT para que se muestre la definida por este plugin ************/
function SPDA_redirect_cpt_template($template){

   global $post;

   if (!$post || !is_singular('seguros-por-dias'))
      return $template;

   if ($post->post_type == 'seguros-por-dias') {
      $custom_template = plugin_dir_path(__FILE__) . SPDA_TEMPLATE_LANDING_PRODUCTO;

      if (file_exists($custom_template))
         return $custom_template;
      else
         error_log('La plantilla personalizada SPDA_TEMPLATE_LANDING_PRODUCTO no se encuentra.');
   }

   return $template;
}

add_filter('single_template', 'SPDA_redirect_cpt_template');



/***** Añadimos la clase is-embarvcaacioon a las landings que funcionan con iframes
 * ****/
function mi_plugin_agregar_clase_embarcacion( $clases ) {

   global $post;

   if (isset($post) && $post->post_type == 'seguros-por-dias') {
      // Puedes obtenerlo mediante get_post_meta o get_field (si usas ACF)
      $id_producto_por_dias = get_post_meta( get_the_ID(), 'categoria_iframe', true );
      
      if ( $id_producto_por_dias == 11 ) {
         $clases[] = 'is-embarcacion';
      }
   }

   return $clases;
}
add_filter( 'body_class', 'mi_plugin_agregar_clase_embarcacion' );




/***** En caso de que se cargue iframe para la tarificacion con seguro por días, cargamos la libreria que autoajusta el iframe
 * ****/
 function cargar_scripts_form_no_embarcaciones() {
   // Obtener las clases que se aplicarán al body.
   $clases_body = get_body_class();
    
   // Verificar si la clase 'is-not-embarcacion' está presente.
   if ( in_array( 'is-embarcacion', $clases_body ) ) {
      wp_enqueue_script('iframe-resizer-script', plugins_url('/js/iframe-resizer.js', __FILE__), array('jquery'), filemtime(SPDA_PLUGIN_PATH.'/js/iframe-resizer.js'), true);
   }
}

add_action( 'wp_enqueue_scripts', 'cargar_scripts_form_no_embarcaciones' );




/******* Encolado de estilos y scripts necesarios para la template de seguros por días  ********/
function SPDA_consejos_enqueue_styles_template(){
   global $post;

   if (isset($post) && $post->post_type == 'seguros-por-dias') {
      wp_enqueue_style('SPDA_styles_template', plugin_dir_url(__FILE__) . 'css/spda_css_landing_producto.css', array(), '1.0');
   }
}

add_action('wp_enqueue_scripts', 'SPDA_consejos_enqueue_styles_template', 100);


function SPDA_api_plugin_enqueue_scripts_template(){

   global $post;

   if (isset($post) && $post->post_type == 'seguros-por-dias') {
      wp_enqueue_script('js-landing-template', plugins_url('/js/spda_script_landing_producto.js', __FILE__), array('jquery'), '1.0', true);
      wp_enqueue_script(SPDA_SLUG_LANDING_PRODUCTO . '-common-script', plugins_url('/js/spda_common_scripts.js', __FILE__), array('jquery'), '1.0', true);
      wp_localize_script(SPDA_SLUG_LANDING_PRODUCTO . '-common-script', 'miAjax', array('ajaxurl' => admin_url('admin-ajax.php')));
      wp_enqueue_script('moment-js', 'https://cdn.jsdelivr.net/momentjs/latest/moment.min.js', array(), '2.29.1', true);
   }
}

add_action('wp_enqueue_scripts', 'SPDA_api_plugin_enqueue_scripts_template');





/******* Encolado de estilos y scripts necesarios para el plugin  ********/
function SPDA_check_required_page(){

   // Listado de páginas del plugin
   require SPDA_PLUGIN_PATH . 'utils/paginas-crear-caracteristicas.php';

   $current_post = get_post();
   $current_slug = $current_post ? get_post_field('post_name', $current_post) : '';

   foreach ($SPDA_paginas as $pagina) {
      if ($current_slug === $pagina['slug'])
         return true;
   }

   return false;
}


function SPDA_consejos_enqueue_styles(){

   if (SPDA_check_required_page()) {
      wp_enqueue_style('sweetalert2-css', 'https://cdn.jsdelivr.net/npm/sweetalert2@11.0.17/dist/sweetalert2.min.css');
      wp_enqueue_style('SPDA_styles', plugin_dir_url(__FILE__) . 'css/spda_estilos.css', array(), '1.0');
   }
}

add_action('wp_enqueue_scripts', 'SPDA_consejos_enqueue_styles', 100);


function SPDA_api_plugin_enqueue_scripts(){

   if (SPDA_check_required_page()) {

      insu_encolar_script_insuguru(SPDA_INSU_PRODUCT_ID);

      wp_enqueue_script(SPDA_SLUG_LANDING_PRODUCTO . '-script', plugins_url('/js/spda_scripts.js', __FILE__), array('jquery'), filemtime(SPDA_PLUGIN_PATH.'/js/spda_scripts.js'), true);
      wp_enqueue_script(SPDA_SLUG_LANDING_PRODUCTO . '-common-script', plugins_url('/js/spda_common_scripts.js', __FILE__), array('jquery'), '1.0', true);
      wp_localize_script(SPDA_SLUG_LANDING_PRODUCTO . '-script', 'miAjax', array('ajaxurl' => admin_url('admin-ajax.php')));
      wp_localize_script(SPDA_SLUG_LANDING_PRODUCTO . '-common-script', 'miAjax', array('ajaxurl' => admin_url('admin-ajax.php')));
      wp_enqueue_script('moment-js', 'https://cdn.jsdelivr.net/momentjs/latest/moment.min.js', array(), '2.29.1', true);
      wp_enqueue_script('sweetalert2-js', 'https://cdn.jsdelivr.net/npm/sweetalert2@11', array(), '11.0.17', false);

      

      // Google Places API (Autocomplete de direcciones) - Mantenemos para futuro uso
      wp_enqueue_script(
         'google-places',
         'https://maps.googleapis.com/maps/api/js?key=AIzaSyDIZpTzMDNb7votsJP4NiwAEvEUJKZm-ew&libraries=places&callback=initAutocomplete',
         array( 'jquery' ), 
         null,
         true
      );

      // Mapbox Search JS para autocompletado de direcciones
      wp_enqueue_script(
         'mapbox-search-js',
         'https://api.mapbox.com/search-js/v1.3.0/web.js',
         array( 'jquery' ),
         '1.3.0',
         true
      );

      // Sistema de Modal para Direcciones
      wp_enqueue_script(
         'spda-modal-address-system',
         plugin_dir_url(__FILE__) . 'js/spda_modal_address_system.js',
         array( 'jquery', 'mapbox-search-js', 'sweetalert2-js' ),
         filemtime(SPDA_PLUGIN_PATH.'/js/spda_modal_address_system.js'),
         true
      );

   }
}

add_action('wp_enqueue_scripts', 'SPDA_api_plugin_enqueue_scripts', 10000);





//catalogo de categorias de vehiculos y subcategorias
function SPDA_catalogo_categorias_sub_categorias(){

   return SDNW_wp_get_tipos_vehiculos();
}

add_action('wp_ajax_nopriv_catalogo_categorias_sub_categorias', 'SPDA_catalogo_categorias_sub_categorias');
add_action('wp_ajax_catalogo_categorias_sub_categorias', 'SPDA_catalogo_categorias_sub_categorias');



//catalogo de marcas de vehiculos
function SPDA_catalogo_marcas_vehiculos(){
   if (empty($_POST['id_tipo_vehiculo'])) {
      // Si no está presente, enviar una respuesta JSON de error
      return wp_send_json_error(
         [
            'errores' => [['error'=>'El campo id_tipo_vehiculo es obligatorio']],
            'respuesta' => null
         ]
      );
   }
   return SDNW_wp_get_marcas_vehiculos($_POST['id_tipo_vehiculo']);
}

add_action('wp_ajax_nopriv_catalogo_marcas_vehiculos', 'SPDA_catalogo_marcas_vehiculos');
add_action('wp_ajax_catalogo_marcas_vehiculos', 'SPDA_catalogo_marcas_vehiculos');



//catalogo de categorias de vehiculos y subcategorias
function SPDA_catalogo_modelos_marcas(){

   if (empty($_POST['id_marca']) || empty($_POST['id_tipo_vehiculo'])) {
      // Si no está presente, enviar una respuesta JSON de error
      return wp_send_json_error(
         [
            'errores' => ['El campo id_marca y id_tipo_vehiculo es obligatorio'],
            'respuesta' => null
         ]
      );
   }
   return SDNW_wp_get_modelos_vehiculos($_POST['id_marca'],$_POST['id_tipo_vehiculo']);
}

add_action('wp_ajax_nopriv_catalogo_modelos_marcas', 'SPDA_catalogo_modelos_marcas');
add_action('wp_ajax_catalogo_modelos_marcas', 'SPDA_catalogo_modelos_marcas');



//hacer tarifacion de seguro
function SPDA_tarifacion_seguro(){

   if (!isset($_POST['cantidad']) || !isset($_POST['temporalidad']) 
      || !isset($_POST['ciudad']) || !isset($_POST['marca']) 
      || !isset($_POST['modelo']) || !isset($_POST['cp']) 
      || !isset($_POST['fechaNacimiento'])
      || !isset($_POST['escala']) || !isset($_POST['idProductoPorDias'])
      ) {


      // Si no está presente, enviar una respuesta JSON de error
      return wp_send_json_error(
         [
            'errores' => [['error'=>'Faltan campos obligatorios']],
            'respuesta' => null
         ]
      );
   }else{

      $cantidad = $_POST['cantidad'];
      $temporalidad = $_POST['temporalidad'];
      if($cantidad>28 && $temporalidad=='dias'){
         if($cantidad%7!=0){
              
            return wp_send_json_error(
               [
                  'errores' => [ ['error'=>'Para períodos superiores a 28 días, incrementos son semanales (cada 7 días).']],
                  'respuesta' => null
               ]
            );
         }
         $semanas = $cantidad/7;
         $cantidad = $semanas;
         $temporalidad = 'semanas';
      }
      
      $ciudad = $_POST['ciudad'];
      $marca = $_POST['marca'];
      $modelo = $_POST['modelo'];
      $cp = $_POST['cp'];
      $fechaNacimiento = $_POST['fechaNacimiento'];
      // Generar matrícula por defecto basada en la categoría del vehículo
      $matricula = SPDA_obtener_matricula_default($_POST['idProductoPorDias']);
      $escala = $_POST['escala'];
      $idProductoPorDias = $_POST['idProductoPorDias'];
      $quotationId =  isset($_POST['quotation_id']) ? $_POST['quotation_id']  : null;
      $fecha_nacimiento_formateada = SDNW_convertDateFormat($fechaNacimiento);
      if(!$fecha_nacimiento_formateada){
       return wp_send_json_error(
          [
             'errores' => [['error'=>'Fecha de nacimiento inválida']],
             'respuesta' => null
          ]
       );
      }
      $fechaNacimiento=$fecha_nacimiento_formateada;

      $products=isset($_POST['productos']) ? (esJsonDecodable($_POST['productos']) ? json_decode($_POST['productos']) : null) : null;
      

      $vehicle= new Vehicle($idProductoPorDias,$escala,$marca,$modelo,$matricula);
      $policyholder= new PolicyHolder(null,null,null,$fechaNacimiento,null,null,null,$cp,$ciudad);
      $policy= new Policy($cantidad,$temporalidad);
      $quotation = new Quotation($quotationId,$vehicle,$policyholder,$policy,null,$products);

      return SDNW_wp_post_quotation($quotation);
   }
}

add_action('wp_ajax_nopriv_tarifacion_seguro', 'SPDA_tarifacion_seguro');
add_action('wp_ajax_tarifacion_seguro', 'SPDA_tarifacion_seguro');




//emitir poliza de seguro
function SPDA_emitir_poliza(){
   $required_fields = [
      'codigo_postal', 'codigo_postal_conductor', 'tipo_via', 'nombre_via','numero_via' , 'piso_puerta', 'email-tomador', 
      'es-conductor-y-propietario', 'escala', 'fecha_carnet_conductor', 
      'fecha_inicio_cobertura', 'fecha_nacimiento_conductor', 
      'identificador-propietario-veh', 'identificador-tomador', 
      'identificador-tomador-juridico', 'marca_vehiculo', 'matricula_vehiculo', 
      'modelo_vehiculo', 'nombre-propietario-veh', 'nombre-tomador', 
      'nombre-tomador-juridico', 'num-dias-seguro', 'poblacion', 
      'primer_apellido-tomador', 'provincia', 'quotation_id', 
      'segundo-apellido-tomador', 'sexo-conductor', 'telefono-tomador', 
      'tipo-documento-propietario-veh', 'tipo-documento-tomador', 'tipo_riesgo', 
      'tomador-es-persona-juridica', 'hora_inicio_cobertura', 'temporalidad',
      'pais_expedicion_matricula'
   ];
  
   $missing_fields = [];
  
  foreach ($required_fields as $field) {
      if (!isset($_POST[$field])) {
          $missing_fields[] = $field;
      }
  }
  
   if (!empty($missing_fields)) {

      // Si no está presente, enviar una respuesta JSON de error
      return wp_send_json_error(
         [
            'errores' => [ ['error'=>'Faltan campos obligatorios ' . implode(', ', $missing_fields)]],
            'respuesta' => null
         ]
      );
   }else{

      $segundo_apellido_propietario_veh = null;
      $primer_apellido_propietario_veh = null;
      $tipo_propietario_vehiculo = null;
      
      // Verificar si se necesitan los apellidos del propietario
      $necesita_apellidos_propietario = false;
      
      if($_POST['es-conductor-y-propietario']=='si'){
         // Si el conductor es el propietario, usar sus apellidos
         $necesita_apellidos_propietario = true;
         $primer_apellido_propietario_veh = $_POST['primer_apellido-tomador'];
         $segundo_apellido_propietario_veh = $_POST['segundo-apellido-tomador'];
      } else {
         // Si el conductor no es el propietario, verificar tipo de propietario
         if(isset($_POST['tipo-propietario-vehiculo']) && $_POST['tipo-propietario-vehiculo'] == 'fisica'){
            // Solo pedir apellidos si el propietario es persona física
            $necesita_apellidos_propietario = true;
            if(!isset($_POST['primer_apellido-propietario-veh']) || 
            !isset($_POST['segundo-apellido-propietario-veh'])){
               // Si no está presente, enviar una respuesta JSON de error
               return wp_send_json_error(
                  [
                     'errores' => [['error'=>'Faltan campos obligatorios, faltan apellidos del propietario físico']],
                     'respuesta' => null
                  ]
               );
            }else{
               $primer_apellido_propietario_veh = $_POST['primer_apellido-propietario-veh'];
               $segundo_apellido_propietario_veh = $_POST['segundo-apellido-propietario-veh'];
            }
         }
         // Si es persona jurídica, no se necesitan apellidos
      }

      if($_POST['es-conductor-y-propietario']=='no'){
         if(!isset($_POST['tipo-propietario-vehiculo'])
         ){
            // Si no está presente, enviar una respuesta JSON de error
            return wp_send_json_error(
               [
                  'errores' => [['error'=>'Faltan campos obligatorios, falta tipo de propietario']],
                  'respuesta' => null
               ]
            );
         }else{
            $tipo_propietario_vehiculo = $_POST['tipo-propietario-vehiculo'];
         }
      }
      $codigo_postal = $_POST['codigo_postal'];
      $codigo_postal_conductor = $_POST['codigo_postal_conductor'];

      $numero_via = $_POST['numero_via'];
      $nombre_via = $_POST['nombre_via'];
      $tipo_via = $_POST['tipo_via'];  
      $piso_puerta= $_POST['piso_puerta'];  
      
      $email_tomador = $_POST['email-tomador'];
      $es_conductor_y_propietario = $_POST['es-conductor-y-propietario'];
      $escala = $_POST['escala'];
      $fecha_carnet_conductor = $_POST['fecha_carnet_conductor'];
      $fecha_inicio_cobertura = $_POST['fecha_inicio_cobertura'];
      $hora_inicio_cobertura = $_POST['hora_inicio_cobertura'];
      $fecha_nacimiento_conductor = $_POST['fecha_nacimiento_conductor'];
      $identificador_propietario_veh = $_POST['identificador-propietario-veh'];
      $identificador_tomador = $_POST['identificador-tomador'];
      $identificador_tomador_juridico = $_POST['identificador-tomador-juridico'];
      $marca_vehiculo = $_POST['marca_vehiculo'];
      $matricula_vehiculo = $_POST['matricula_vehiculo'];
      $modelo_vehiculo = $_POST['modelo_vehiculo'];
      $nombre_propietario_veh = $_POST['nombre-propietario-veh'];
      $nombre_tomador = $_POST['nombre-tomador'];
      $nombre_tomador_juridico = $_POST['nombre-tomador-juridico'];
      $num_dias_seguro = $_POST['num-dias-seguro'];
      $poblacion = $_POST['poblacion'];
      $primer_apellido_tomador = $_POST['primer_apellido-tomador'];
      $provincia = $_POST['provincia'];
      $quotation_id = $_POST['quotation_id'];
      $segundo_apellido_tomador = $_POST['segundo-apellido-tomador'];

      $sexo_conductor = $_POST['sexo-conductor'];
      $telefono_tomador = $_POST['telefono-tomador'];
      $tipo_documento_propietario_veh = $_POST['tipo-documento-propietario-veh'];
      $tipo_documento_tomador = $_POST['tipo-documento-tomador'];
      $tipo_riesgo = $_POST['tipo_riesgo'];
      $tomador_es_persona_juridica = $_POST['tomador-es-persona-juridica'];
      $temporalidad = $_POST['temporalidad'];
      $green_card  = isset($_POST['cartaverde']) ? ($_POST['cartaverde'] == "true" ? 1 : 0) : 0;

      $fecha_nacimiento_formateada = SDNW_convertDateFormat($fecha_nacimiento_conductor);
      if(!$fecha_nacimiento_formateada){
       return wp_send_json_error(
          [
             'errores' => [['error'=>'Fecha de nacimiento inválida']],
             'respuesta' => null
          ]
       );
      }
      $fecha_nacimiento_conductor=$fecha_nacimiento_formateada;

      $start_data=SDNW_validate_change_start_hour($fecha_inicio_cobertura, $hora_inicio_cobertura);
      $fecha_inicio_cobertura = $start_data['fecha_inicio_cobertura'];
      $hora_inicio_cobertura = $start_data['hora_inicio_cobertura'];

      $fecha_inicio_formateada = SDNW_convertDateFormat($fecha_inicio_cobertura);
      if(!$fecha_inicio_formateada){
       return wp_send_json_error(
          [
             'errores' => [['error'=>'Fecha de inicio inválida']],
             'respuesta' => null
          ]
       );
      }
      $fecha_inicio_cobertura=$fecha_inicio_formateada;

       $fecha_carnet_formateada = SDNW_convertDateFormat($fecha_carnet_conductor);
      if(!$fecha_carnet_formateada){
       return wp_send_json_error(
          [
             'errores' => [['error'=>'Fecha de carnet inválida']],
             'respuesta' => null
          ]
       );
      }
      $fecha_carnet_conductor=$fecha_carnet_formateada; 

      if($num_dias_seguro>28 && $temporalidad=='dias'){
         if($num_dias_seguro%7!=0){
              
            return wp_send_json_error(
               [
                  'errores' => [ ['error'=>'Para períodos superiores a 28 días, incrementos son semanales (cada 7 días).']],
                  'respuesta' => null
               ]
            );
         }
         $semanas = $num_dias_seguro/7;
         $num_dias_seguro = $semanas;
         $temporalidad = 'semanas';
      }


      $pais_expedicion_matricula = $_POST['pais_expedicion_matricula'];
      
      $vehicle = new Vehicle($tipo_riesgo,$escala,$marca_vehiculo, $modelo_vehiculo,
      $matricula_vehiculo,$pais_expedicion_matricula, $es_conductor_y_propietario, $nombre_propietario_veh,
      $primer_apellido_propietario_veh, $tipo_documento_propietario_veh, $identificador_propietario_veh);
      
      $policyholder = new PolicyHolder($nombre_tomador,$primer_apellido_tomador,$segundo_apellido_tomador,
      $fecha_nacimiento_conductor,$fecha_carnet_conductor,$tipo_documento_tomador,
      $identificador_tomador,$codigo_postal_conductor,$poblacion,$tipo_via,$nombre_via,$numero_via,$piso_puerta,
      $telefono_tomador,$email_tomador,$sexo_conductor,$tomador_es_persona_juridica,$nombre_tomador_juridico,
      $identificador_tomador_juridico);

      $policy = new Policy($num_dias_seguro,$temporalidad,$fecha_inicio_cobertura, $hora_inicio_cobertura, $green_card);

      $url_ok = (home_url( '/' ) . SDNW_URL_OK);
      $url_ko = (home_url( '/' ) . SDNW_URL_KO);

      $redirects = new Redirects($url_ok,$url_ko);
      $insurance_data = new InsuranceData($quotation_id,$vehicle,$policyholder,$policy,SDNW_PARTNER,$redirects);
     
      $response_insurance=SDNW_wp_post_insurance_data($insurance_data);
      if (empty($response_insurance['errores'])){
         return wp_send_json_success( $response_insurance );
      }else{
         return wp_send_json_error( $response_insurance );
      }
   }
}


add_action('wp_ajax_nopriv_emitir_poliza', 'SPDA_emitir_poliza');
add_action('wp_ajax_emitir_poliza', 'SPDA_emitir_poliza');




// función para guardar transients
function SPDA_save_transient() {
   SPDA_save_transient_service();
}
add_action('wp_ajax_SPDA_save_transient', 'SPDA_save_transient');
add_action('wp_ajax_nopriv_SPDA_save_transient', 'SPDA_save_transient');



function SPDA_enviar_correo_poliza_cron($email, $nombre_tomador, $primer_apellido_tomador,
    $segundo_apellido_tomador, $marca_vehiculo, $modelo_vehiculo, $matricula_vehiculo) {

    return SPDA_enviar_correo_poliza_cron_service($email, $nombre_tomador, $primer_apellido_tomador,
    $segundo_apellido_tomador, $marca_vehiculo, $modelo_vehiculo, $matricula_vehiculo);
}

// Asociar la función al hook del cron
add_action('SPDA_enviar_correo_poliza_evento', 'SPDA_enviar_correo_poliza_cron',10, 8);

function SPDA_acciones_posteriores_contratacion_cron($id_poliza) {

   $respuesta_transient = SPDA_get_transient_service($id_poliza);
   error_log("Respuesta transient en cron: " . print_r($respuesta_transient, true));
   if (is_null($respuesta_transient['respuesta'])) {
       return;
   }
   $datos_transient = $respuesta_transient['respuesta'];
   $respuesta_servicio = SDNW_wp_get_projects($id_poliza);
   error_log("Respuesta servicio proyectos en cron: " . print_r($respuesta_servicio, true));
   $respuesta_servicio_documentos = SDNW_wp_get_documents($id_poliza);
   error_log("Respuesta servicio documentos en cron: " . print_r($respuesta_servicio_documentos, true));
   $datos_documentos = $respuesta_servicio_documentos['respuesta'];

   $pdf = new MikeheartSPDA();
   $directorioGuardado = SPDA_PLUGIN_PATH . '/archivos/polizas/';
   if (!file_exists($directorioGuardado)) {
      mkdir($directorioGuardado, 0775, true);
   }
   $documentos = $datos_documentos->documentacion;
   $timestamp = time();
   $archivos_guardados = [];

   foreach ($documentos as $i => $documento) {
      $existe = $documento->existe;
      if ($existe == "SI") {
         $base_64_documento = $documento->base64;
         $nombre_documento = pathinfo($documento->archivo, PATHINFO_FILENAME); // sin extensión
         $nombre_archivo_pdf = "{$nombre_documento}_{$id_poliza}_{$timestamp}.pdf";
         $ruta_archivo_pdf = $directorioGuardado . $nombre_archivo_pdf;

         // Guardar el archivo PDF decodificando el base64
         file_put_contents($ruta_archivo_pdf, base64_decode($base_64_documento));
         $archivos_guardados[] = $ruta_archivo_pdf;

         // Añadir el archivo al PDF final
         $pdf->addFile($ruta_archivo_pdf, chr(65 + $i)); // 'A', 'B', etc.
      }
   }

   // Guardar el PDF final
   $nombre_final = "documentofinal_{$id_poliza}_{$timestamp}.pdf";
   $rutaCompletaPDF = $directorioGuardado . $nombre_final;
   $result = $pdf->needAppearances()->saveAs($rutaCompletaPDF);
   $documento_final_url = SPDA_PLUGIN_URL. 'archivos/polizas/' . $nombre_final;

   error_log("PDF final guardado en: " . $rutaCompletaPDF);
   error_log("URL del documento final: " . $documento_final_url);
   error_log("Resultado de guardar el PDF final: " . ($result ? 'Éxito' : 'Fallo'));   
   error_log("Archivos individuales guardados: " . print_r($archivos_guardados, true));
   $respuesta_insuguru = insu_contratacion_insuguru($datos_transient, $datos_transient->insu_id, $respuesta_servicio['respuesta'], $id_poliza, null,$documento_final_url );
   error_log("Respuesta Insuguru: " . print_r($respuesta_insuguru, true));

   $request_correos = get_object_vars($datos_transient);
   $request_correos['idVenta'] = $id_poliza;
   $respuesta_correos_green_card = SPDA_enviar_correo_green_card_contratada($request_correos);
   $respuesta_correos_recordatorio = SPDA_enviar_correo_recordatorio_finalizacion($request_correos);
}

// Asociar la función al hook del cron
add_action('SPDA_acciones_posteriores_contratacion', 'SPDA_acciones_posteriores_contratacion_cron',10, 2);

