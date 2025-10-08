// Función para validar edad mínima de 21 años en la fecha de nacimiento
function validateMinimumAge(inputId, minimumAge = 21) {
    const $input = $('#' + inputId);
    const dateValue = $input.val();
    
    // Verificar que la fecha esté completa
    if (dateValue.length !== 10) {
        return false;
    }
    
    // Parsear la fecha (formato dd/mm/aaaa)
    const parts = dateValue.split('/');
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Los meses en JS van de 0-11
    const year = parseInt(parts[2]);
    
    // Crear objeto fecha
    const birthDate = new Date(year, month, day);
    const today = new Date();
    
    // Calcular edad
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    // Ajustar edad si aún no ha cumplido años este año
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    
    // Validar edad mínima
    if (age < minimumAge) {
        showAgeError($input, minimumAge);
        return false;
    } else {
        removeAgeError($input);
        return true;
    }
}

// Mostrar error de edad
function showAgeError($input, minimumAge) {
    const inputId = $input.attr('id');
    const errorId = inputId + '-error';
    
    // Añadir clase error al input
    $input.addClass('error');
    $input.attr('aria-invalid', 'true');
    
    // Remover error anterior si existe
    $('#' + errorId).remove();
    
    // Crear label de error
    const $errorLabel = $('<label>', {
        id: errorId,
        class: 'error',
        for: inputId,
        text: 'Debes tener al menos ' + minimumAge + ' años'
    });
    
    // Insertar después del input
    $input.after($errorLabel);
}

// Remover error de edad
function removeAgeError($input) {
    const inputId = $input.attr('id');
    const errorId = inputId + '-error';
    
    // Remover clase error del input
    $input.removeClass('error');
    $input.removeAttr('aria-invalid');
    
    // Remover label de error
    $('#' + errorId).remove();
}

// Inicializar validación cuando el DOM esté listo
$(document).ready(function() {
    // Validar cuando el usuario termine de escribir (blur)
    $('#fecha_nacimiento_conductor').on('blur', function() {
        const $input = $(this);
        const dateValue = $input.val();
        
        // Solo validar si la fecha está completa
        if (dateValue.length === 10) {
            validateMinimumAge('fecha_nacimiento_conductor', 21);
        }
    });
    
    // También validar cuando se complete la fecha (input)
    $('#fecha_nacimiento_conductor').on('input', function() {
        const $input = $(this);
        const dateValue = $input.val();
        
        // Solo validar si la fecha está completa
        if (dateValue.length === 10) {
            validateMinimumAge('fecha_nacimiento_conductor', 21);
        }
    });
    
    // Validar antes de enviar el formulario
    $('form').on('submit', function(e) {
        const isValid = validateMinimumAge('fecha_nacimiento_conductor', 21);
        
        if (!isValid) {
            e.preventDefault();
            // Hacer scroll al campo con error
            $('html, body').animate({
                scrollTop: $('#fecha_nacimiento_conductor').offset().top - 100
            }, 500);
            return false;
        }
    });
});

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

});
