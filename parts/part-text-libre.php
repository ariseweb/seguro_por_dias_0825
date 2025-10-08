<!-- Zona contenido libre -->
<?php 
	$variable2 = get_the_content();
	if ($variable2 != ""):
?>	
	<section class="text-start franja pt-4">
		<div class="container">
			<?= $variable2; ?>
		</div>
	</section>
<?php endif ?>
<!-- Fin Zona de contenido libre -->