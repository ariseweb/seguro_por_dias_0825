<?php
	get_header();

	echo do_shortcode('[turnstile_protect]');

	//Botonos de volver y salir
	require( SPDA_PLUGIN_PATH . 'parts/salir-proceso.php' ) ;
	//Pantalla de loading 
	require( SPDA_PLUGIN_PATH . 'parts/loader-simple.php' ) ;

	// Obtenemos el ID del producto por días desde la URL
	$id_prod = $_GET['id_prod'] ?? '';
	// Función que genera el texto del icono de ayuda y del placeholder en función del tipo de vehículo
	switch ($id_prod) {

	    case '19': // Coches de alquiler
	    case '38': // Vehículos mixtos
	    case '8':  // Camiones
	    case '7':  // Cabezas tractoras
	    case '3':  // Furgonetas
	    case '60': // Motos eléctricas >50cc
	        $text_icon = "El formato debe ser 0000BBB, A0000BB, A000000, P0000BBB, S0000BBB o V0000BBB - No coloques espacios";
	        $placeholder = "Ej: 0000BBB, A0000BB, P0000BBB";
	        break;

	    case '1':  // Coches
	    	$text_icon = "El formato debe ser 0000BBB, A0000BB, A000000, P0000BBB, S0000BBB, V0000BBB, H1234AB, H1234ABC o AB123456 - No coloques espacios";
	        $placeholder = "Ej: 0000BBB, A0000BB, H1234AB, AB123456";
	        break;

	    case '10': // Autocaravanas
	        $text_icon = "El formato debe ser 0000BBB, A0000BB, A000000, P0000BBB, S0000BBB, V0000BBB o R0000BBB - No coloques espacios";
	        $placeholder = "Ej: 0000BBB, A0000BB, R0000BBB";
	        break;

	    case '2':  
	    	$text_icon = "El formato debe ser C0000BBB, 0000BBB, A0000BB, A000000, P0000BBB, S0000BBB o V0000BBB - No coloques espacios";
	        $placeholder = "Ej:C0000BBB, 0000BBB, A0000BB, P0000BBB";
	        break;
	    case '59': // Motos eléctricas hasta 50cc
	        $text_icon = "El formato debe ser C0000BBB, 0000BBB, A0000BB, A000000, P0000BBB, S0000BBB o V0000BBB - No coloques espacios";
	        $placeholder = "Ej:C0000BBB, 0000BBB, A0000BB, P0000BBB";
	        break;

	    case '4':  // Coches clásicos
	    case '5':  // Motos clásicas
	        $text_icon = "El formato debe ser H0000BBB, A0000BB o A000000 - No coloques espacios";
	        $placeholder = "Ej: H0000BBB, A0000BB";
	        break;

	    case '23': // Microcars y Buggys
	        $text_icon = "El formato debe ser C0000BBB, E0000BBB, 0000BBB, P0000BBB, S0000BBB o V0000BBB - No coloques espacios";
	        $placeholder = "Ej: C0000BBB, E0000BBB, 0000BBB";
	        break;

	    case '14': // Maquinaria de obras
	    case '15': // Maquinaria agrícola
	        $text_icon = "El formato debe ser E0000BBB o A00000VE - No coloques espacios";
	        $placeholder = "Ej: E0000BBB, A00000VE";
	        break;

	    case '9':  // Remolques
	        $text_icon = "El formato debe ser R0000BB o E000BBB - No coloques espacios";
	        $placeholder = "Ej: R0000BB, E000BBB";
	        break;

	    default:  // Formato genérico para otros vehículos
	        $text_icon = "El formato debe ser 0000BBB o A0000BB - No coloques espacios";
	        $placeholder = "Ej: 0000BBB, A0000BB";
	        break;
	}

?>



<div id="primary" class="conten"> 
	<!-- Campos ocultos para evitar errores cuando no se usan formularios dinámicos -->
	<input type="hidden" name="identificador-propietario-veh" id="hidden-identificador-propietario-veh" value="">
	<input type="hidden" name="nombre-propietario-veh" id="hidden-nombre-propietario-veh" value="">
	<input type="hidden" name="tipo-documento-propietario-veh" id="hidden-tipo-documento-propietario-veh" value="">
	<input type="hidden" name="primer_apellido-propietario-veh" id="hidden-primer_apellido-propietario-veh" value="">
	<input type="hidden" name="segundo-apellido-propietario-veh" id="hidden-segundo-apellido-propietario-veh" value="">
	<input type="hidden" name="identificador-tomador-juridico" id="hidden-identificador-tomador-juridico" value="">
	<input type="hidden" name="nombre-tomador-juridico" id="hidden-nombre-tomador-juridico" value="">
	<input type="hidden" name="tomador-es-persona-juridica" id="hidden-tomador-es-persona-juridica" value="no">
	<input type="hidden" name="tipo-propietario-vehiculo" id="hidden-tipo-propietario-vehiculo" value="fisica">												
	<input type="hidden" name="tipo-propietario-vehiculo" id="hidden-tipo-propietario-vehiculo" value="fisica">

	<main id="main" class="site-main product-temp" role="main">

		<!-- COMIENZA BLOQUE IZQUIERDO -->
		<div class="bloque-sin-left principal-left">

			<div class="container-mini-tarif-viajes">

				<!-- COMIENZA EL FORMULARIO -->
				<form id="formulario_dias" action="#" method="POST" class="form-validado multistep-asg" >

					<img class="img-sgviajes" src="<?= SPDA_IMAGEN_PLUGIN; ?>" alt="Calcula el precio de tu seguro por días">
					<?php 
						// Incluir el archivo desde la carpeta "parts"
						include( SPDA_PLUGIN_PATH . 'parts/steps-form.php' );
					?>	


					<!-- PANTALLA 1 -->
					<div id="step-form-anim-1">

						<h2 class="title-viajes">Configura tu seguro</h2>

						<p class="rs-viaje"><span class="me-2">
							<b>Vehículo:</b> <span id="nam-vehi"></span>
							</span> | <span class="me-2 ms-2">
								<b>F. nacimiento:</b> <span id="date-naci"></span>
							</span> | <span class="ms-2">
								<b>C.P:</b> <span id="cp-asg"></span>
							</span>

							<a href="#" class="edit-datos-sg-dias"><img src="<?= SPDA_PLUGIN_URL."img/edit_icon.svg";  ?>" alt="Editar"></a>
						</p>

						<div class="text-start franja franja-forms-multstp">
							
															
							<div class="row g-4">

								<div class="col-12 col-md-8" id="contenedor-opts-seguros">
									<div class="card-forms wit-bord">
										<h5 class="border-0 ps-2 pb-2 mt-2">Revisa las coberturas incluídas y las opcionales</h5>
									</div>
								</div>
							
								<div class="col-12 col-md-4 text-center mt-xs-0">
									<div class="card-forms wit-bord">
										<h6 class="mb-2 border-0 pt-3">Precio final</h6>
										<div class="prc-seguro-select psp-dias" id="precio_tarificacion"></div> 
										<small class="mt-2 d-block mb-4">Impuestos includos</small>

										<div class="col-12" id="selector-dias-go">
											<label id="etiqueta_num_duracion" class="form-label text-center" for="num-dias-seguro">Número de días</label>
											<div class="number">
												<span class="minus" id="minus-cant-dias">-</span>
												<input class="form-control" value=1 type="number" name="num-dias-seguro" min="1" autocomplete="off">
												<span class="plus" id="plus-cant-dias">+</span>
											</div>
										</div>

										<!-- <div class="col-12 input-radionormal mt-4" id="tipo-poliza-options">
										    <input type="radio" class="me-2" name="periodo" value="dias" checked> <label>Días</label>
										    <input type="radio" name="periodo" value="semanas"> <label>Semanas</label>
										</div> -->

									</div>

									<div class="d-flex box-next-step-asg justify-content-center"> 
										<div class="btn btn-primary btn-next-form btn-next-paso-asg" id="sg-paso-1">Siguiente</div>
									</div>

								</div>
							</div>

						</div>

					</div>
					<!-- FIN PANTALLA 1 -->


					<!-- PANTALLA 2 -->
					<div id="step-form-anim-2">
						<h2 class="title-viajes"><span class="text-primary">Conductor</span></h2>
						
						<style>
							.disabled-section {
								opacity: 0.5;
								pointer-events: none;
							}
							.disabled-section .btn {
								cursor: not-allowed;
							}
							#preguntas-dinamicas-section .btn-outline-primary:disabled {
								background-color: #f8f9fa;
								border-color: #dee2e6;
								color: #6c757d;
							}
						</style>

						<div class="text-start franja franja-forms-multstp">	
							<!-- Datos básicos del conductor -->
							<div class="card-forms">					
								<div class="row g-4">

									<!-- Campo oculto para sexo conductor-->
								    <input type="hidden" name="sexo-conductor" value="" id="sexo-conductor">
								    <!-- Campo oculto para el tipo de documento del tomador (reemplaza el select visible) -->
									<input type="hidden" name="tipo-documento-tomador" id="tipo-documento-tomador" value="">

									<!-- País de expedición de la matrícula -->
									<div class="col-12 col-md-6">
									    <label for="pais_expedicion_matricula" class="form-label">País de expedición matrícula</label>
									    <select name="pais_expedicion_matricula" id="pais_expedicion_matricula" class="select2 j2 form-control" required>
									        <?php
									        // 1. Usamos la nueva función que devuelve la URL de la bandera
									        $paises = SPDA_obtener_paises_con_banderas();
									        
									        foreach ($paises as $codigo => $datos) {
									            $selected = ($codigo === 'ES') ? 'selected' : '';
									            // 2. Añadimos el atributo data-bandera-url con la URL de la imagen
									            echo "<option value=\"{$codigo}\" data-bandera-url=\"{$datos['bandera_url']}\" {$selected}>{$datos['nombre']}</option>";
									        }
									        ?>
									    </select>
									</div>

									<!-- Matrícula del vehículo -->
									<div class="col-12 col-md-6">
										<label for="matricula_vehiculo" class="form-label">Matrícula<img src="/wp-content/plugins/asegura-core/img/icono-info.svg" class="icono-info-class" data-toggle="tooltip" title="<?= $text_icon; ?>"></label>
										<input type="text" class="form-control matricula_vehiculo_vrf" name="matricula_vehiculo" id="matricula_vehiculo"  placeholder="<?= $placeholder; ?>" required>
									</div>

									<!--Fecha expedicion carnet-->
								    <div class="col-12 col-md-6">
										<label for="fecha_carnet_conductor" class="form-label">Fecha expedición carnet</label>
										<input type="text" class="form-control input_slash_date" placeholder="dd/mm/aaaa" id="fecha_carnet_conductor" name="fecha_carnet_conductor" required>
									</div>

									<!-- Documento conductor-->
								    <div class="col-12 col-md-6">
										<label for="identificador-tomador" class="form-label">Documento</label>
										<input type="text" class="form-control identificador-vrf  insulead-identificacion" name="identificador-tomador" id="identificador-tomador"  placeholder="Ejemplo: 12345678X" required>
									</div>

								    <!-- Nombre -->
								    <div class="col-12 col-md-6">
								        <label for="nombre-tomador" class="form-label">Nombre</label>
								        <input type="text" class="form-control name-vrf  insulead-nombre" name="nombre-tomador" id="nombre-tomador" placeholder="Ejemplo: Juan" required>
								    </div>

								    <!-- Primer apellido -->
								    <div class="col-12 col-md-6">
								        <label for="primer_apellido-tomador" class="form-label">Primer apellido</label>
								        <input type="text" class="form-control apellidos-vrf  insulead-apellidos" name="primer_apellido-tomador" id="primer_apellido-tomador" placeholder="Ejemplo: Díaz" required>
								    </div>

								    <!-- Segundo apellido -->
								    <div class="col-12 col-md-6">
								        <label for="segundo-apellido-tomador" class="form-label">Segundo apellido</label>
								        <input type="text" class="form-control apellidos-vrf insulead-apellidos" name="segundo-apellido-tomador" id="segundo-apellido-tomador" placeholder="Ejemplo: García">
								    </div>

								    <!-- Dirección - Campos no editables con botón para abrir modal -->
								    <div class="row g-3">
								    	<div class="col-12 d-none">
								    		<label class="form-label">Dirección completa</label>
								    		<input type="text" class="form-control" name="direccion_completa_display" id="direccion_completa_display" placeholder="Haz clic en 'Añadir dirección' para completar" readonly style="background-color: #f8f9fa;" required data-direccion-required="true">
								    	</div>
								    	<div class="col-12 text-center mt-3">
								    		<button type="button" class="btn btn-secondary btn-sm w-100" id="btn_anadir_direccion">
								    			+ Añadir dirección
								    		</button>
								    	</div>
							    	</div>

								    <!-- Campos ocultos para el backend (mapeo final) -->
								    <input type="hidden" name="tipo_via" id="tipo_via" class="direccion-validacion">
								    <input type="hidden" name="nombre_via" id="nombre_via">
								    <input type="hidden" name="numero_via" id="numero_via">
								    <input type="hidden" name="codigo_postal" id="codigo_postal">
								    <input type="hidden" name="provincia" id="provincia">
								    <input type="hidden" name="poblacion" id="poblacion">

									<div class="col-12 col-md-6">
										<label for="telefono-tomador" class="form-label">Teléfono</label>
										<input type="text" class="form-control telefono-vrf insulead-telefono" name="telefono-tomador" id="telefono-tomador"  placeholder="Ejemplo: 655 123 456" required>
									</div>

								    <div class="col-12 col-md-6">
										<label for="email-tomador" class="form-label">Email</label>
										<input type="email" class="form-control email-vrf insulead-email" name="email-tomador" id="email-tomador" placeholder="Ejemplo: mail@gmail.com" required>
									</div>

									<div class="col-12 col-md-6">
										<label for="email-tomador-verif" class="form-label">Repite tu email</label>
										<input type="email" class="form-control emailverifica-vrf" name="email-tomador-verif" id="email-tomador-verif" placeholder="Ejemplo: mail@gmail.com" required>
									</div>
								</div>
							</div>

							<!-- Sección de preguntas dinámicas -->
							<div class="card-forms mt-4" id="preguntas-dinamicas-section">
								
								<!-- Campos ocultos para evitar errores cuando no se usan formularios dinámicos -->
								<input type="hidden" name="identificador-propietario-veh" id="hidden-identificador-propietario-veh" value="">
								<input type="hidden" name="nombre-propietario-veh" id="hidden-nombre-propietario-veh" value="">
								<input type="hidden" name="tipo-documento-propietario-veh" id="hidden-tipo-documento-propietario-veh" value="">
								<input type="hidden" name="identificador-tomador-juridico" id="hidden-identificador-tomador-juridico" value="">
								<input type="hidden" name="nombre-tomador-juridico" id="hidden-nombre-tomador-juridico" value="">
								<input type="hidden" name="tomador-es-persona-juridica" id="hidden-tomador-es-persona-juridica" value="no">
								<input type="hidden" name="tipo-propietario-vehiculo" id="hidden-tipo-propietario-vehiculo" value=""">
								
								<!-- Pregunta 1: ¿Es el conductor el propietario? -->
								<div class="card-forms mt-3 mb-1" id="pregunta-propietario">
									<div class="d-flex justify-content-center align-items-center mb-3">
                    					<h6 class="text-center mb-0 pb-0 border-0">Propietario/a del vehículo</h6>
                					</div>
									<div class="row g-3">
										<div class="col-12">
											<div class="d-flex justify-content-center boxi-rb flex-wrap flex-md-nowrap justify-content-center two-points-multsp m-auto">
												<div class="radio-button-container text-start col-md-6 col-12">
													<input type="radio" name="es-conductor-y-propietario" class="form-check-input pregunta-trigger" 
														   id="si-es-conductor-y-propietario" value="si" data-pregunta="propietario" checked disabled>
													<label for="si-es-conductor-y-propietario" id="label-si-propietario">
														<span class="nombre-conductor-placeholder">Nombre del conductor</span>
													</label>
												</div>
												<div class="radio-button-container text-start col-md-6 col-12">
													<input type="radio" name="es-conductor-y-propietario" class="form-check-input pregunta-trigger" 
														   id="no-es-conductor-y-propietario" value="no" data-pregunta="propietario" disabled>
													<label for="no-es-conductor-y-propietario">
														Otro
													</label>
												</div>
											</div>
										</div>
									</div>

								</div>
												

								<!-- Contenedor para formularios dinámicos -->
								<div id="formularios-dinamicos-container">
									<!-- Aquí se insertarán dinámicamente los formularios según las respuestas -->
								</div>
							</div>

							<div class="d-flex box-next-step-asg justify-content-center"> 
								<div class="btn btn-primary btn-next-form btn-next-paso-asg" id="sg-paso-2">Siguiente paso</div>
							</div>

						</div>	
					</div>
					<!-- FIN PANTALLA 2 -->



					<!-- PANTALLA 3 -->
					<div id="step-form-anim-3">

						<h2 class="title-viajes">Datos de la póliza</h2>
						<p>Indica en qué momento quieres que se inicie la cobertura.</p>

						<div class="text-start franja franja-forms-multstp">	
							<div class="card-forms">					
								<div class="row g-4 d-flex justify-content-center">
								    <div class="col-12 col-md-4">
										<label for="fecha_inicio_cobertura" class="form-label text-start">Día</label>
										<input type="text" class="form-control text-center" name="fecha_inicio_cobertura" id="fecha_inicio_cobertura" required>
									</div>

									<div class="col-12 col-md-4">
										<label for="hora_inicio_cobertura" class="form-label text-start">Hora</label>
										<input type="time" class="form-control text-center" name="hora_inicio_cobertura" id="hora_inicio_cobertura" required>
									</div>

								</div>

							</div>

							<div class="d-flex box-next-step-asg justify-content-center"> 
								<div class="btn btn-primary btn-next-form btn-next-paso-asg" id="sg-paso-3">Siguiente paso</div>
							</div>

						</div>	
					</div>
					<!-- FIN PANTALLA 3 -->

					
					<!-- PANTALLA 4 -->
					<div id="step-form-anim-4">
						<h2 class="title-viajes">Resumen </h2>
						<p>Revisa todos los datos y corrige la información.</p>

						<div class="text-start franja franja-forms-multstp">	
							<div class="card-forms">					
								<h6>Datos del vehículo</h6>
								<ul class="data-contratacion-resumen">
								    <li><b>Marca:</b> <span id="marca_value"></span></li>
								    <li><b>Modelo:</b> <span id="modelo_value"></span></li>
								    <li><b>Matrícula:</b> <span id="matricula_value"></span></li>
								</ul>

								<h6>Datos del conductor</h6>
								<ul class="data-contratacion-resumen">
								    <li><b>Nombre:</b> <span id="nombre_conductor_value"></span></li>
								    <li><b>Documento de identidad:</b> <span id="dni_conductor_value"></span></li>
								    <li><b>Fecha de nacimiento:</b> <span id="fecha_nacimiento_value"></span></li>
								    <li><b>Fecha expedición carnet:</b> <span id="fecha_expedicion_carnet_value"></span></li>
								</ul>

								<h6>Datos de contacto</h6>
								<ul class="data-contratacion-resumen">
								    <li><b>E-mail:</b> <span id="email_value"></span></li>
								    <li><b>Teléfono:</b> <span id="telefono_value"></span></li>
								    <li><b>Dirección:</b> <span id="direccion_value"></span></li>
								    <li><b>CP - Localidad:</b> <span id="cp_localidad_value"></span></li>
								</ul>

								<h6>Datos de la póliza</h6>
								<ul class="data-contratacion-resumen">
								    <li><b>Duración:</b> <span id="duracion_value"></span></li>
								    <li><b>Inicio:</b> <span id="inicio_value"></span></li>
								    <li><b>Vencimiento:</b> <span id="vencimiento_value"></span></li>
								    <li><b>Precio:</b> <span id="precio_value"></span></li>
								    <li><b>Carta verde:</b> <span id="carta_verde_value"></span></li>
								</ul>

								<h6>Datos del propietario del vehículo y titular de la póliza (tomador)</h6>
								<ul class="data-contratacion-resumen">
								    <li><b>Propietario del vehículo:</b> <span id="propietario_value"></span></li>
								    <li><b>Documento de identidad:</b> <span id="dni_propietario_value"></span></li>
								    <li><b>Titular de la póliza (tomador):</b> <span id="tomador_value"></span></li>
								    <li><b>Documento de identidad:</b> <span id="dni_tomador_value"></span></li>
								</ul>


								<p class="alert alert-danger">Comprueba que los datos del formulario son correctos antes de continuar, sobre todo el NIF/CIF y la MATRÍCULA</p>

								<p>Si pulsas en proceder al pago, estarás aceptando nuestros <a href="https://tresmares.com/aviso-legal/" target="_blank">términos y condiciones</a>.</p>

							</div>

							<div class="d-flex box-next-step-asg justify-content-center"> 
								<div class="btn btn-primary" id="sg-paso-4">Ir a pagar</div>
							</div>

						</div>	
					</div>
					<!-- FIN PANTALLA 4 -->

					<!-- PANTALLA 5 -->
					<div id="step-form-anim-5">
						<h2 class="title-viajes">Pago del seguro </h2>
						<div id="contendorframepago">

						</div>
					</div>
					<!-- FIN PANTALLA 5 -->

					<?php 
						if (wp_is_mobile()) {
							require( SPDA_PLUGIN_PATH . 'parts/mobile-bottom-resume.php' ) ;	
						}

					 ?>
			
				</form>
				<!-- FIN FORM -->

				<div class="mult-mini-footer">
					<?php 
						//Footer viajes
						require(SPDA_PLUGIN_PATH . 'parts/mini-footer.php');
					 ?>
				</div>

			</div>
			<!-- FIN container-mini-tarif-viajes -->

		</div>
		<!-- FIN BLOQUE IZQUIERDO -->


		<div class="box-aside-multistp d-none">
			<?php 
				require( SPDA_PLUGIN_PATH . 'parts/aside.php' ) ;
			?>
		</div>

	<?php 
		get_footer();