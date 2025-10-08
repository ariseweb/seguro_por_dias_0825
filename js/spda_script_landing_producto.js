function obtenerCatalogoCategoriasEscala(){
    return new Promise((resolve, reject) => {
        //Obtengo datos del form
        let formData = crearFormularioAjax('catalogo_categorias_sub_categorias');
        armarPeticionAjax(formData, resolve, reject);
    })
    
}

function obtenerCatalogoMarcas(id_tipo_vehiculo){
    return new Promise((resolve, reject) => {
        //Obtengo datos del form
        let formData = crearFormularioAjax('catalogo_marcas_vehiculos',{
            id_tipo_vehiculo 
        });
        armarPeticionAjax(formData, resolve, reject);
    })    
}

function obtenerCatalogoModelos(id_marca,id_tipo_vehiculo){
    return new Promise((resolve, reject) => {
        //Obtengo datos del form
        let formData = crearFormularioAjax('catalogo_modelos_marcas',{
            id_marca ,
            id_tipo_vehiculo
        });
        armarPeticionAjax(formData, resolve, reject);
    })    
}



// Function to filter data by idCategoria
function filtrarPorcategoria(data, idCategoria) {
    return data.list.filter(item => item.idCategoria == idCategoria);
}


// Function to create and append the new select element marc
function crearSelectMarca(brands) {
    const $select = $('#select-marca');
    brands.forEach(brand => {
        const option = $('<option>', { value: brand.name, text: brand.name });
        option.attr('data-id', brand.id);
        $select.append(option);
    });

    $select.removeAttr('disabled');
    // Add change event listener
    $select.on('change', async function() {
        // Obtener el atributo data-info de la opción seleccionada
        const selectedOption = $(this).find('option:selected');
        const idselected = selectedOption.attr('data-id');
        let idProductoPorDias=sessionStorage.getItem('idProductoPorDias');
        console.log('Selected brand ID:', idselected);
        let {models}=await obtenerCatalogoModelos(idselected,idProductoPorDias);
        
        if (models.length === 1 && models[0].name === "Otro") {
            sustituirSelectPorInputModelo();
        } else {
            crearSelectModelo(models);
        }
    });
}

// Function to create and append the new select element marc
function crearSelectModelo(modelos) {
    const $select = $('#select-modelo');
    $select.removeAttr('disabled');
    // Limpiar opciones existentes del select
    $select.empty();
    const empty_option = $('<option>', { value: '', text: 'Seleccione Modelo' ,disabled : true , selected: true, class:"placeholder"  });
    $select.append(empty_option);
    modelos.forEach(modelo => {
        const option = $('<option>', { value: modelo.name, text: modelo.name });
        option.attr('data-id', modelo.id);
        $select.append(option);
    });
}

function sustituirSelectPorInputMarca() {
    const $selectMarca = $('#select-marca');
    const $divSelectMarca = $('#div-select-marca');
    // Remove the select2 container if it exists
    $divSelectMarca.find('.select2-container').remove();
    // Create the input element
    const $inputMarca = $('<input>', { 
        id: 'select-marca', 
        name: 'select-marca', 
        class: 'form-control j2', 
        type: 'text', 
        placeholder: 'Ejemplo: BMW' 
    });
    // Replace the select element with the input element
    $selectMarca.replaceWith($inputMarca);
    
    // Update the label text and attributes
    const $labelMarca = $divSelectMarca.find('label[for="select-marca"]');
    $labelMarca.html('Ingresa la marca:');
}

function sustituirSelectPorInputModelo() {
    const $selectModelo = $('#select-modelo');
    const $divSelectModelo =$('#div-select-modelo');
    // Remove the select2 container if it exists
    $divSelectModelo.find('.select2-container').remove();
    // Create the input element
    const $inputModelo = $('<input>', { 
        id: 'select-modelo', 
        name: 'select-modelo', 
        class: 'form-control j2', 
        type: 'text', 
        placeholder: 'Ejemplo: MR2' 
    });
    // Replace the select element with the input element
    $selectModelo.replaceWith($inputModelo);

    // Update the label text and attributes
    const $labelModelo = $divSelectModelo.find('label[for="select-modelo"]');
    $labelModelo.html('Ingresa el modelo:');
    
}

async function renderizarCatalogos(){
    try {
        let idProductoPorDias=sessionStorage.getItem('idProductoPorDias');

        Promise.allSettled([
            obtenerCatalogoMarcas(idProductoPorDias)]
        ).then((results)=>{


            if(results[0].status === 'fulfilled'){
                let {brands} = results[0].value;
                crearSelectMarca(brands);
            }else{
                console.log(results[0].reason);
                sustituirSelectPorInputMarca();
                sustituirSelectPorInputModelo();
            }            
            const $select_escala = $('#select-escala');
            $select_escala.removeAttr('disabled');
            

        }).catch(()=>{
        
        })


    } catch (error) {
        console.log(error);
    }

}

jQuery(document).ready(async function($) {

    await renderizarCatalogos();
    // Limpiar sessionStorage al cargar la página del formulario
    sessionStorage.removeItem('marca');
    sessionStorage.removeItem('modelo');
    sessionStorage.removeItem('cp');
    sessionStorage.removeItem('fechaNacimiento');
    sessionStorage.removeItem('escala');

    // Inicializar jQuery Validate para el formulario
    $("#car-days-form").validate({
        rules: {
            'select-marca': {
                required: true
            },
            'select-modelo': {
                required: true
            },
            'select-escala':{
                required: true
            },
            'cp_conductor': {
                required: true,
                validCodigoPostal: true
            },
            'fecha_nacimiento_conductor': {
                required: true
            }
        },
        messages: {
            'select-marca': {
                required: "Completa este campo"
            },
            'select-modelo': {
                required: "Completa este campo"
            },
            'select-escala':{
                required: "Completa este campo"
            },
            'cp_conductor': {
                required: "Completa este campo",
                validCodigoPostal: "Introduce un Código Postal válido"
            },
            'fecha_nacimiento_conductor': {
                required: "Completa este campo"
            }
        },
        errorPlacement: function(error, element) {
            if (element.attr("name") == "select-marca") {
                // Busca el siguiente span que actúa como contenedor del select2
                error.insertAfter(element.next('.select2-container'));
            } else {
                // Comportamiento normal para otros campos
                error.insertAfter(element);
            }
        },
        submitHandler: function(form) {
            // Almacenar en sessionStorage
            var marca = $('#select-marca').val();
            var modelo = $('#select-modelo').val();
            var cp = $('#cp_conductor').val();
            var fechaNacimiento = $('input[name="fecha_nacimiento_conductor"]').val();
            var escala = $('#select-escala').val();
            var slug = window.location.pathname;

            // Convertir formato de dd/mm/aaaa a dd-mm-aaaa
            fechaNacimiento = fechaNacimiento.replace(/\//g, '-');

            sessionStorage.setItem('marca', marca);
            sessionStorage.setItem('modelo', modelo);
            sessionStorage.setItem('cp', cp);
            sessionStorage.setItem('fechaNacimiento', fechaNacimiento);
            sessionStorage.setItem('escala', escala);
            sessionStorage.setItem('slug', slug);

            let idProductoPorDias = sessionStorage.getItem('idProductoPorDias');
            // Redirigir a la siguiente página
            window.location.href = `/contratar-seguro-por-dias-spda?id_prod=${idProductoPorDias}`;
        }
    });
    

    // Asignar evento de click al botón de submit
    $('#submit-form').on('click', function() {
        if ($('#car-days-form').valid()) {
            $('#car-days-form').submit();
        }
    });



    //Según la cantidad de elementos del form, quitamos la clase btn-top-modificado
    var selectEscala = $('#select-escala');

    // Cuenta el número de opciones
    var optionCount = selectEscala.find('option').length;

    if (optionCount > 1) {
        // Selecciona el último elemento con la clase 'col-12 col-md-4'
        var lastElement = $('#car-days-form .col-12.col-md-4').last();

        // Verifica si el elemento tiene la clase 'btn-top-modificado' y se la quita si la tiene
        if (lastElement.hasClass('btn-top-modificado')) {
            lastElement.removeClass('btn-top-modificado');
        }
    }

    /***** EN LAS LANDINGS DE SEGURO POR DÍAS QUE SON DE EMBARCACIONES (IFRAME) APLICAMOS LA LIBRERIA DE RESIZE
     * ***/
     if ($('body').hasClass('is-embarcacion')) {
        iFrameResize({ log: true }, '#formulario')
    }



    // Validar edad mínima de la fecha de naciiento
    $('#fecha_nacimiento_conductor').on('blur input', function() {
        const $input = $(this);
        const fecha = $input.val();
        
        // Solo validar si la fecha está completa
        if (fecha.length !== 10) return;
        
        // Parsear fecha (dd/mm/aaaa)
        const partes = fecha.split('/');
        const dia = parseInt(partes[0]);
        const mes = parseInt(partes[1]) - 1; // Meses en JS: 0-11
        const año = parseInt(partes[2]);
        
        // Calcular fecha de nacimiento y fecha límite (21 años atrás)
        const fechaNacimiento = new Date(año, mes, dia);
        const hoy = new Date();
        const fecha21AñosAtras = new Date(hoy.getFullYear() - 21, hoy.getMonth(), hoy.getDate());
        
        // Validar si tiene menos de 21 años
        if (fechaNacimiento > fecha21AñosAtras) {
            // Mostrar error
            $input.addClass('error').attr('aria-invalid', 'true');
            $('#fecha_nacimiento_conductor-error').remove(); // Remover error anterior
            $input.after('<label id="fecha_nacimiento_conductor-error" class="error" for="fecha_nacimiento_conductor">Debes tener al menos 21 años</label>');
        } else {
            // Quitar error
            $input.removeClass('error').removeAttr('aria-invalid');
            $('#fecha_nacimiento_conductor-error').remove();
        }
    });

});
