<!-- Zona de Coberturas -->
<?php 
$tituloCoberturas = get_field('titulo_coberturas');
if ($tituloCoberturas) :
?>
<section id="zona-coberturas" class="text-start franja pt-5 pb-5">
    <div class="container text-left">            
        <h2 class="wp-block-heading text-center text-primary mt-0"><?php echo esc_html($tituloCoberturas); ?></h2>        
        <div class="d-flex flex-wrap justify-content-between align-items-start">
            <?php
            for ($i = 1; $i <= 8; $i++) {
                $cobertura = get_field("cobertura_$i");

                if ($cobertura && !empty($cobertura['titulo'])) {
                    $iconoCob = '';
                    if (!empty($cobertura['icono']['ID'])) {
                        $iconoCob = wp_get_attachment_image($cobertura['icono']['ID'], 'full', false, array('class' => 'img-responsive'));
                    }
                    $titulo = esc_html($cobertura['titulo']);
                    $texto = esc_html($cobertura['texto']);

                    printf(
                        '<article class="col-12 col-lg-6">
                            <div class="box-cobertura">
                                <div class="d-flex flex-no-wrap align-items-start">
                                    <div class="img-cobertura">%s</div>
                                    <div class="text-cobertura">
                                        <h3 class="h4">%s</h3>
                                        <p>%s</p>
                                    </div>
                                </div>
                            </div>
                        </article>',
                        $iconoCob,
                        $titulo,
                        $texto
                    );
                }
            }
            ?>
        </div>
    </div>
</section>
<?php endif; ?>
<!-- Fin Zona de Coberturas -->
