<div class="container text-start">
	<div class="box-por-dias-step1 card-forms">							
		<form id="car-days-form" class="row gx-3 gy-2 align-items-center form-validado">

			<input type="hidden" name="id_cat_veh" id="id_cat_veh" value="<?= $id_producto_por_dias; ?>"> 
			
			<div id="div-select-escala" class="col-12 col-md-4" <?= $select_escala_hidden ?> >
			    <label for="select-escala" class="form-label">Tipo<img src="/wp-content/plugins/asegura-core/img/icono-info.svg" class="icono-info-class" data-toggle="tooltip" title="Selecciona el tipo de tu vehiculo"></label>
			    <select name="select-escala" id="select-escala" class="j2 position-relative" autocomplete="off" required disabled>
			    <?php 
						if(count($productos)>1 ){
							echo '<option value=""  disabled selected class="placeholder" > Selecciona tipo</option>';
						}
						 
						foreach ($productos as $id => $tipo) {
							echo '<option value="'.$tipo->idEscala.'">'.$tipo->descripcion.'</option>';
						}
				?>
				</select>
			</div>

			<div id="div-select-marca" class="col-12 col-md-4">
			    <label for="select-marca" class="form-label">Marca <img src="/wp-content/plugins/asegura-core/img/icono-info.svg" class="icono-info-class" data-toggle="tooltip" title="Selecciona la marca de tu vehículo."></label>
			    <select name="select-marca" id="select-marca" class="j2 position-relative" autocomplete="off" required disabled>
						<option value="" disabled selected class="placeholder"  >Selecciona Marca</option>
			    </select>
			</div>

			<div id="div-select-modelo" class="col-12 col-md-4" >
			    <label for="select-modelo" class="form-label">Modelo <img src="/wp-content/plugins/asegura-core/img/icono-info.svg" class="icono-info-class" data-toggle="tooltip" title="Selecciona el modelo de tu coche."></label>
			    <select name="select-modelo" id="select-modelo" class="j2 select2 position-relative"  autocomplete="off" required disabled>
					<option value=""  disabled selected class="placeholder"  >Selecciona Modelo</option>
			    </select>
			</div>


			<div class="col-12 col-md-4">
				<label for="cp_conductor" class="form-label">Código postal conductor</label>
				<input type="number" class="form-control" name="cp_conductor" id="cp_conductor"  placeholder="Ejemplo: 28001" required>
			</div>

			<div class="col-12 col-md-4">
				<label for="fecha_nacimiento_conductor" class="form-label">Fecha nacimiento conductor</label>
				<input type="text" class="form-control input_slash_date" name="fecha_nacimiento_conductor" id="fecha_nacimiento_conductor" placeholder="dd/mm/aaaa" required>
			</div>

			<div class="col-12 col-md-4 btn-top-modificado">
				<button class="btn btn-primary btn-next-form btn-next-paso-asg d-block" id="submit-form">Calcular precio</button>
			</div>
			
		</form>	
	</div>
</div>