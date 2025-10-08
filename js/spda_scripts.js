$ = jQuery.noConflict();



/****
 * FUNCIONAMIENTO AUTOCOMPLETADO DE DIRECCIONES CON GOOGLE PLACES API - VERSIÓN SPDA
 ****/

// Función de validación de código postal español
function esCodigoPostalValidoSPDA(cp) {
    // Validación: solo dígitos y entre 01000 y 52999
    return /^[0-9]{5}$/.test(cp) && cp >= '01000' && cp <= '52999';
}

// Mapa para extraer tipo de vía de la dirección de Google
const tiposViaGoogle = {
    'calle': 'Calle',
    'avenida': 'Avenida', 
    'avda': 'Avenida',
    'plaza': 'Plaza',
    'paseo': 'Paseo',
    'carretera': 'Carretera',
    'camino': 'Camino',
    'ronda': 'Ronda',
    'glorieta': 'Glorieta',
    'travesia': 'Travesía',
    'travesía': 'Travesía',
    'urbanización': 'Urbanización',
    'alameda': 'Alameda',
    'rambla': 'Rambla'
};

// Función para extraer tipo de vía del nombre de la dirección
function extraerTipoVia(direccionCompleta) {
    if (!direccionCompleta) return '';
    
    const direccionLower = direccionCompleta.toLowerCase();
    
    for (const [buscar, tipoVia] of Object.entries(tiposViaGoogle)) {
        if (direccionLower.startsWith(buscar + ' ')) {
            return tipoVia;
        }
    }
    
    return 'Calle'; // Por defecto
}

// Función para limpiar el nombre de vía (quitar el tipo de vía del inicio)
function limpiarNombreVia(direccionCompleta) {
    if (!direccionCompleta) return '';
    
    const direccionLower = direccionCompleta.toLowerCase();
    
    for (const buscar of Object.keys(tiposViaGoogle)) {
        if (direccionLower.startsWith(buscar + ' ')) {
            return direccionCompleta.substring((buscar + ' ').length);
        }
    }
    
    return direccionCompleta;
}

// Inicializar Google Autocomplete para SPDA
window.initAutocompleteSPDA = function() {
    if (!document.getElementById('autocompleteDireccionSPDA')) {
        return; // El campo no existe en esta página
    }
    
    const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocompleteDireccionSPDA'),
        { 
            types: ['address'], 
            componentRestrictions: { country: 'es' }
        }
    );
    
    autocomplete.addListener('place_changed', function() {    
        const place = autocomplete.getPlace();
        
        if (!place || !place.address_components) {
            return;
        }
        
        // Procesar componentes de dirección
        const componentes = {};
        place.address_components.forEach(component => {
            component.types.forEach(type => {
                componentes[type] = component.long_name;
            });
        });
        
        // Obtener la dirección completa que escribió el usuario
        const direccionCompleta = $('#autocompleteDireccionSPDA').val();
        
        // Extraer y establecer el tipo de vía
        const tipoVia = extraerTipoVia(direccionCompleta);
        $('select[name="tipo_via"]').val(tipoVia).trigger('change');
        
        // Limpiar y establecer el nombre de vía (sin el tipo de vía)
        const nombreViaLimpio = limpiarNombreVia(direccionCompleta);
        $('#autocompleteDireccionSPDA').val(nombreViaLimpio);
        
        // Llenar código postal
        const cp = componentes['postal_code'] || '';
        $('#manual_cp_spda')
            .val(cp)
            .prop('readonly', false);
        
        // Llenar localidad
        $('#manual_localidad_spda')
            .val(componentes['locality'] || componentes['postal_town'] || '')
            .prop('readonly', false);

        // Si Google ha devuelto un CP válido, sincronizar provincia
        if (cp.length === 5 && esCodigoPostalValidoSPDA(cp)) {
            const primerosDosDigitos = cp.substring(0, 2);
            // Buscar la provincia correspondiente en el select
            $('.provincia_vrf')
                .val(primerosDosDigitos)
                .trigger('change');
        }
    });
};

// Función global que Google Maps puede llamar (compatibilidad)
window.initAutocomplete = function() {
    // Intentar inicializar tanto COMPSS como SPDA
    if (typeof initAutocompleteSPDA === 'function') {
        initAutocompleteSPDA();
    }
};

// Listener manual para cuando el usuario edita el CP a mano
$(document).ready(function() {
    $(".codigo_postal_vrf").on('input', function() {
        const codigoPostal = $(this).val();
        if (codigoPostal.length === 5 && esCodigoPostalValidoSPDA(codigoPostal)) {
            const primerosDosDigitos = codigoPostal.substring(0, 2);
            $(".provincia_vrf")
                .val(primerosDosDigitos)
                .trigger('change');
        }
    });
});



function convertirFormatoFecha(fecha) {
    // Dividir la fecha por el carácter "-"
    const partes = fecha.split("-");

    // Extraer año, mes y día
    const anio = partes[0];
    const mes = partes[1];
    const dia = partes[2];

    // Devolver en formato "dd-MM-yyyy"
    return `${dia}-${mes}-${anio}`;
}



// Función para sumar días a una fecha
function sumarDiasAFecha(fecha, dias) {
    // Crear un objeto Date en UTC
    const fechaObj = new Date(`${fecha}T00:00:00Z`);

    // Sumar los días a la fecha
    fechaObj.setUTCDate(fechaObj.getUTCDate() + dias);

    // Obtener los valores de día, mes y año de la nueva fecha
    const nuevoDia = fechaObj.getUTCDate().toString().padStart(2, '0');
    const nuevoMes = (fechaObj.getUTCMonth() + 1).toString().padStart(2, '0');
    const nuevoAnio = fechaObj.getUTCFullYear();

    // Formatear la nueva fecha en formato "dd-MM-yyyy"
    return `${nuevoDia}-${nuevoMes}-${nuevoAnio}`;
}


// Verificar si es un dispositivo móvil con tamaño de pantalla menor a 1024 px
function esDispositivoMovil() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && window.innerWidth < 1024;
}


function Tarificar(tarificacion) {
    return new Promise((resolve, reject) => {
        //Obtengo datos del form
        let formData = crearFormularioAjax('tarifacion_seguro', tarificacion);
        armarPeticionAjax(formData, resolve, reject);
    })
}

function Emitir(poliza) {
    return new Promise((resolve, reject) => {
        //Obtengo datos del form
        let formData = crearFormularioAjax('emitir_poliza', poliza);
        armarPeticionAjax(formData, resolve, reject);
    })
}

function CorreoRecordatorio(datos) {
    return new Promise((resolve, reject) => {
        //Obtengo datos del form
        let formData = crearFormularioAjax('correo_recordatorio_finalizacion', datos);
        armarPeticionAjax(formData, resolve, reject);
    })
}

function CorreoGreenCard(datos) {
    return new Promise((resolve, reject) => {
        //Obtengo datos del form
        let formData = crearFormularioAjax('SPDA_green_card', datos);
        armarPeticionAjax(formData, resolve, reject);
    })
}



function SPDA_guardar_transient(datos) {
    return new Promise((resolve, reject) => {
        let formData = crearFormularioAjax('SPDA_save_transient', datos);
        armarPeticionAjax(formData, resolve, reject);
    });
}




function limpiarTexto(texto) {
    return texto;
    //const lastPeriodIndex = texto.lastIndexOf('.');
    //return texto.slice(0, lastPeriodIndex + 1);
  }


function crearCheckbox(cobertura, producto, isPrincipal, index, cobertura_marcada, index_product) {
    const id = producto.idProducto;
    const precio = producto.precio;
    const checked = cobertura_marcada ? 'checked' : '';
    const labelText = (index === 0)
        ? `${cobertura.texto} <span class="text-primary">(+${precio}€)</span>`
        : `${cobertura.texto}`;
    const dataAttributes = (isPrincipal)
        ? `data-id="${id}" data-description="${cobertura.texto}" data-principal="1" data-index-product="${index_product}" disabled`
        : `data-id="${id}" data-description="${cobertura.texto}" data-index-product="${index_product}"`;
    const checkboxHtml = `
        <div class="col-12 form-check form-switch mt-3">
            <input type="checkbox" class="form-check-input cobertura-checked" name="${cobertura.tipo}" ${checked} ${dataAttributes} >
            <label for="${cobertura.tipo}">${labelText}</label>
        </div>
    `;
    return checkboxHtml;
}


function agregarCoberturas(productos, isPrincipal, productos_precargados) {
    const contenedor = $("#contenedor-opts-seguros .card-forms");

    productos.forEach((producto, index_product) => {
        // No permitir más de un producto principal
        if (isPrincipal && index_product > 0) {
            return;
        }
        let cobertura_marcada = (productos_precargados.length == 0) ? isPrincipal && index_product == 0 : productos_precargados.includes(`${index_product}-${isPrincipal ? 'P' : 'C'}`);

        
        producto.coberturas.forEach((cobertura, index) => {
            contenedor.append(crearCheckbox(cobertura, producto, isPrincipal, index, cobertura_marcada, `${index_product}-${isPrincipal ? 'P' : 'C'}`));
        });
    });

    let firstLabel = $('#contenedor-opts-seguros .card-forms .form-switch:first label');
    
    // Reemplaza el contenido entre paréntesis, incluidos los paréntesis
    firstLabel.html(function(_, html) {
        return html.replace(/\(.*?\)/, ''); // Expresión regular que elimina el contenido entre paréntesis
    });
}




// Función para recolectar las coberturas seleccionadas
function obtenerCoberturasSeleccionados() {
    const coberturas = [];
    $('.form-check-input.cobertura-checked:checked').each(function () {
        const cobertura = $(this).data('description');
        coberturas.push(cobertura);
    });

    return coberturas;
}

// Función para recolectar los ids de los productos seleccionados
function obtenerIdsSeleccionados() {
    const ids = [];
    $('.form-check-input.cobertura-checked:checked').each(function () {
        const id = $(this).data('id');
        if (!ids.includes(id)) {
            ids.push(id);
        }
    });
    return ids;
}

// Función para recolectar los index de los productos seleccionados
function obtenerIndexSeleccionados() {
    const indexs = [];
    $('.form-check-input.cobertura-checked:checked').each(function () {
        const index = $(this).data('index-product');
        if (!indexs.includes(index)) {
            indexs.push(index);
        }
    });
    return indexs;
}


/*** 
 * FUNCIÓN MUESTRA EL LABEL DE RECOMENDADO EN ASISTENCAI EN CARRETERA
 * **/

function agregarRecomendado() {
    var asistenciaLabel = $('label[for="Asistencia"]');
    // Verificamos que exista el span con clase "text-primary" y que no exista ya el "recommend-lab"
    if (asistenciaLabel.find('span.text-primary').length && asistenciaLabel.find('span.recommend-lab').length === 0) {
        asistenciaLabel.find('span.text-primary').after('<span class="recommend-lab">Recomendado</span>');
    }
}



function actualizarCoberturas(coberturas) {
    const $listaCoberturas = $('#lista_coberturas_aside');

    // Limpiar la lista existente
    $listaCoberturas.empty();

    // Agregar las nuevas coberturas
    coberturas.forEach(cobertura => {
        $listaCoberturas.append(`<li>${cobertura}</li>`);
    });
}

async function TarificarActualizar() {
    //Mostramos el loader
    $('#loader-simple').show();
    // Verificar si los datos están en sessionStorage
    let marcaVar = sessionStorage.getItem('marca');
    let modeloVar = sessionStorage.getItem('modelo');
    let cpVar = sessionStorage.getItem('cp');
    let fechaNacimientoVar = sessionStorage.getItem('fechaNacimiento');
    let escalaVar = sessionStorage.getItem('escala');
    let idProductoPorDiasVar = sessionStorage.getItem('idProductoPorDias');
    let quotation_id = sessionStorage.getItem('quotation_id');
    let productos = JSON.stringify(obtenerIdsSeleccionados());
    let num_dias_seguro = obtener_num_dias_seguro();
    let temporalidad= obtener_temporalidad();

    let resp_tarificacion = null;
    try {
        resp_tarificacion = await Tarificar({
            cantidad: num_dias_seguro,
            temporalidad,
            ciudad: '',
            marca: marcaVar,
            modelo: modeloVar,
            cp: cpVar,
            fechaNacimiento: fechaNacimientoVar,
            idProductoPorDias: idProductoPorDiasVar,
            escala: escalaVar,
            productos,
            quotation_id
        });
    } catch (err) {
        Swal.fire({
            title: 'Error!',
            text: limpiarTexto(err[0].error),
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(()=>{
            //window.location.href=traer_slug_landing()
        })
        $('#loader-simple').attr('style', 'display: none !important;');
        return;
    }


    let precio = resp_tarificacion.importeTotal;
    sessionStorage.setItem('precio', precio);
    $('#precio_tarificacion').html(`${precio} €`)
    //Ocultamos el loader
    $('#loader-simple').attr('style', 'display: none !important;');
    agregarRecomendado()
}

function obtener_num_dias_seguro() {
    let $input = $("input[name='num-dias-seguro']");
    return $input.val();
}

let temporalidad_global='dias';

function obtener_temporalidad() {
    return temporalidad_global;
}

// Función para capitalizar la primera letra de cada palabra
function capitalizeWords(str) {
    return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
}

function traer_slug_landing() {
    const protocolo = window.location.protocol; 
    const dominio = window.location.hostname;
    const url_dominio = `${protocolo}//${dominio}`;
    slug_proviene = sessionStorage.getItem('slug') || '';   
    return url_dominio+slug_proviene;
}

async function ActualizarCoberturas(escarga_principal = false) {
    //Mostramos el loader
    $('#loader-simple').show();
    // Verificar si los datos están en sessionStorage
    let marca = sessionStorage.getItem('marca');
    let modelo = sessionStorage.getItem('modelo');
    let cp = sessionStorage.getItem('cp');
    let fechaNacimiento = sessionStorage.getItem('fechaNacimiento');
    let escala = sessionStorage.getItem('escala');
    let idProductoPorDias = sessionStorage.getItem('idProductoPorDias');
    let quotation_id = sessionStorage.getItem('quotation_id');

    let num_dias_seguro = obtener_num_dias_seguro();
    let temporalidad= obtener_temporalidad();
    if (num_dias_seguro == -1) {
        return;
    }

    if ((!marca || !modelo || !cp || !fechaNacimiento ) && escarga_principal) {
        // Si falta algún dato, redirigir al formulario 
        window.location.href = '/seguro-por-dias-para-coches/';
        return;
    }



    // Obtener los datos del almacenamiento y capitalizar las variables
    marca = sessionStorage.getItem('marca') || '';
    modelo = sessionStorage.getItem('modelo') || '';
    slug_proviene = sessionStorage.getItem('slug') || '';
    marca = capitalizeWords(marca);
    modelo = capitalizeWords(modelo);

    let resp_tarificacion = null;

    try {
        let request_tarificacion = {
            cantidad: escarga_principal ? 1 : num_dias_seguro,
            temporalidad: escarga_principal ? 'dias' : temporalidad,
            ciudad: '',
            marca: marca,
            modelo: modelo,
            cp: cp,
            fechaNacimiento: fechaNacimiento,
            idProductoPorDias: idProductoPorDias,
            escala: escala,
            
        }

        if (quotation_id) {
            request_tarificacion['quotation_id'] = quotation_id;
        }
        resp_tarificacion = await Tarificar(request_tarificacion);
        if (!quotation_id) {
            sessionStorage.setItem('quotation_id', resp_tarificacion.idpresupuesto);
            quotation_id = resp_tarificacion.idpresupuesto;
        }
    } catch (err) {
        Swal.fire({
            title: 'Error!',
            text: limpiarTexto(err[0].error),
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(()=>{
            //window.location.href=traer_slug_landing()
        })
        $('#loader-simple').attr('style', 'display: none !important;');
        return;
    }

    let productos_precargados = [];
    if (!escarga_principal) {
        productos_precargados = obtenerIndexSeleccionados();
    }

    $("#contenedor-opts-seguros .card-forms").empty();
    agregarCoberturas(resp_tarificacion.productos.productosDisponibles.productosPrincipales, true, productos_precargados);
    agregarCoberturas(resp_tarificacion.productos.productosDisponibles.productosComplementarios, false, productos_precargados);

    const contenedor = $("#contenedor-opts-seguros .card-forms");

    const todayB = new Date();
    const dayOfWeekB = todayB.getDay(); // 0 = Domingo, 1 = Lunes, ..., 5 = Viernes
    const numDiasB = parseInt($('input[name="num-dias-seguro"]').val(), 10) || 0;

    let numDias;

    if (dayOfWeekB !== 5) {
        numDias = 15;
    } else {
        numDias = 18;
    }

    
    contenedor.append(`
        <h6 class="text-azul pb-1">Carta verde</h6>
        <div class="col-12 form-check form-switch mt-3 pb-4">
            <input type="checkbox" class="form-check-input" id="cartaverde" name="cartaverde" value="1">
            <label for="cartaverde">
                La duración mínima de la póliza debe ser de ${numDias} días<span class="text-primary"></span>
            </label>
        </div>
    `);

    let productos = JSON.stringify(obtenerIdsSeleccionados());
    let resp_tarificacion_principal_prods = null;
    try {
        resp_tarificacion_principal_prods = await Tarificar({
            cantidad: escarga_principal ? 1 : num_dias_seguro,
            temporalidad: escarga_principal ? 'dias' : temporalidad,
            ciudad: '',
            marca: marca,
            modelo: modelo,
            cp: cp,
            fechaNacimiento: fechaNacimiento,
            idProductoPorDias: idProductoPorDias,
            escala: escala,
            productos,
            quotation_id
        });
    } catch (err) {
        Swal.fire({
            title: 'Error!',
            text: limpiarTexto(err[0].error),
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(()=>{
            window.location.href=traer_slug_landing()
        })
        $('#loader-simple').attr('style', 'display: none !important;');
        return;
    }

    let precio = resp_tarificacion_principal_prods.importeTotal;

    // Si tenemos los datos de storage, los cargamos en el menú
    $('#nam-vehi').html(marca + " " + modelo);
    $('#date-naci').html(fechaNacimiento)
    $('#cp-asg').html(cp)
    $('.edit-datos-sg-dias').attr('href', slug_proviene);
    sessionStorage.setItem('precio', precio);
    $('#precio_tarificacion').html(`${precio} €`)
    //Ocultamos el loader
    $('#loader-simple').attr('style', 'display: none !important;');
    agregarRecomendado()  //Mostramos el label de recomendado en la cobertura de asistencia en carretera


}


function collectFormData() {
    try {
        const form = document.getElementById('formulario_dias');
        let marca = sessionStorage.getItem('marca');
        let modelo = sessionStorage.getItem('modelo');
        let cp = sessionStorage.getItem('cp');
        let fechaNacimiento = sessionStorage.getItem('fechaNacimiento');
        let idProductoPorDias = sessionStorage.getItem('idProductoPorDias');
        let quotation_id = sessionStorage.getItem('quotation_id');
        let escala = sessionStorage.getItem('escala');
        let temporalidad = sessionStorage.getItem('temporalidad');

        const data = {
            fecha_nacimiento_conductor: fechaNacimiento,
            marca_vehiculo: marca,
            modelo_vehiculo: modelo,
            codigo_postal_conductor: cp,
            tipo_riesgo: idProductoPorDias,
            quotation_id,
            escala,
            temporalidad
        };

        // Recorremos todos los elementos del formulario
        for (let element of form.elements) {
            if (element instanceof Node) {

                // Para inputs de tipo radio, solo recogemos el seleccionado
                if (element.type === 'radio' && !element.checked) {
                    continue;
                }

                if (element.type === 'checkbox') {
                    data[element.name] = element.checked;
                    continue;
                }    

                // Añadimos el valor al objeto de datos
                data[element.name] = element.value;
            }
        }
        
        // También recogemos datos de los formularios dinámicos
        const formulariosDinamicos = document.querySelectorAll('.formulario-dinamico-item input, .formulario-dinamico-item select');
        formulariosDinamicos.forEach(element => {
            // Para inputs de tipo radio, solo recogemos el seleccionado
            if (element.type === 'radio' && !element.checked) {
                return;
            }

            if (element.type === 'checkbox') {
                data[element.name] = element.checked;
                return;
            }    

            // Añadimos el valor al objeto de datos
            data[element.name] = element.value;
        });

        if (data['es-conductor-y-propietario']=='si') {
            data['nombre-propietario-veh'] = data['nombre-tomador'];
            data['primer_apellido-propietario-veh']  = data['primer_apellido-tomador'];
            data['segundo-apellido-propietario-veh'] = data['segundo-apellido-tomador'];
            data['tipo-documento-propietario-veh'] = data['tipo-documento-tomador'];
            data['identificador-propietario-veh'] = data['identificador-tomador']
        }else{
            if(data['tipo-propietario-vehiculo']=='juridica' || Object.keys(data).some(key => key.includes('tipo-propietario-vehiculo-') && data[key] === 'juridica')){
                data['nombre-propietario-veh'] = data['nombre-propietario-juridico'];
                data['tipo-documento-propietario-veh'] = 'CIF';
                data['identificador-propietario-veh'] = data['identificador-propietario-juridico']
            }
        }

        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}


// Función para el funcionamiento de las pantalls en el formulario
function updateClassesOnStep(steps) {
    
    var currentStep = $('div[id^="step-form-anim-"]:visible').attr('id');
    if(currentStep){
        var currentStepNumber = parseInt(currentStep.replace('step-form-anim-', ''));

        if (steps.includes(currentStepNumber)) {
            $('.bloque-sin-left').addClass('principal-left');
            $('.box-aside-multistp').addClass('d-block');
            $('.box-aside-multistp').removeClass('d-none');
            $('.price-mobile-bottom').show()
        } else {
            $('.bloque-sin-left').removeClass('principal-left');
            $('.box-aside-multistp').addClass('d-none');
            $('.box-aside-multistp').removeClass('d-block');
            $('.price-mobile-bottom').hide()
        }
    }

}


//Verificamos que la fecha y hora solicitadas para la póliza son correctas
// Función para obtener la fecha y hora actuales
function getCurrentDateTime() {
    const now = new Date();
    return {
        date: now.toISOString().split('T')[0],
        hours: now.getHours(),
        minutes: now.getMinutes()
    };
}



// Validar fecha y hora
function validateDateTime() {
    const today = new Date();
    
    // Obtener la fecha y la hora seleccionadas (convertir a enteros)
    const inputDate = $('#fecha_inicio_cobertura').val().split('-');
    const inputTime = $('#hora_inicio_cobertura').val().split(':');

    const inputDay = parseInt(inputDate[0], 10);
    const inputMonth = parseInt(inputDate[1], 10) - 1; // El mes en JavaScript es 0-indexed, por lo tanto restamos 1
    const inputYear = parseInt(inputDate[2], 10);
    const inputHour = parseInt(inputTime[0], 10);
    const inputMinute = parseInt(inputTime[1], 10);

    // Crear el objeto Date correctamente
    const inputDateTime = new Date(inputYear, inputMonth, inputDay, inputHour, inputMinute);

    // Obtener fecha y hora actual
    const now = getCurrentDateTime();
    const currentDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), now.hours, now.minutes);
    
    // Hora que es 1 hora más tarde de la actual
    const nextHourDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), now.hours + 1, now.minutes);

    // Verificar si la fecha y hora seleccionadas son válidas
    if (inputDateTime >= nextHourDateTime) {
        // Validación exitosa
        return {
            valid: true,
            message: null
        };
    } else {
        const todayFormatted = `${('0' + today.getDate()).slice(-2)}-${('0' + (today.getMonth() + 1)).slice(-2)}-${today.getFullYear()}`;
        // Si no es válida, actualizamos los campos de fecha y hora a la hora actual + 1 hora
        const adjustedDate = today.toISOString().split('T')[0];  // Fecha en formato YYYY-MM-DD
        const adjustedHours = (now.hours + 1) % 24;
        const adjustedMinutes = now.minutes.toString().padStart(2, '0');  // Minutos con 2 dígitos
        const adjustedTime = `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes}`;

        // Actualizar campos
        $('#fecha_inicio_cobertura').val(todayFormatted);
        $('#hora_inicio_cobertura').val(adjustedTime);

        return {
            valid: false,
            message: 'La fecha y hora seleccionadas deben ser como mínimo el día actual y una hora más tarde de la actual.'
        };
    }
}


function reglasCustomValidation($) {
       // Añadir método de validación personalizada para la matrícula según id_cat_selected
    $.validator.addMethod("validMatricula", function(value, element) {
        let id_cat_selected = $('#id_cat_veh').val();

        if (id_cat_selected === '5') {
            return true;
        }
        
        let regexes = [];

        // Definir las expresiones regulares
        let regexCurrent = /^[0-9]{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/i;
        let regexPre1971 = /^[A-Z]{2}[0-9]{4}[A-Z]{1,2}$/i;
        let regexPre2000 = /^[A-Z]{1,2}[0-9]{4}[A-Z]{2}$/i;
        let regexP = /^P[0-9]{4}[A-Z]{3}$/i;
        let regexS = /^S[0-9]{4}[A-Z]{3}$/i;
        let regexV = /^V[0-9]{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/i;
        let regexH = /^H[0-9]{4}[A-Z]{3}$/i;
        let regexH2Letters = /^H[0-9]{4}[A-Z]{2}$/i;
        let regexH3Letters = /^H[0-9]{4}[A-Z]{3}$/i;
        let regexPP = /^[A-Z]{2}[0-9]{6}$/i;
        let regexC2Letters = /^C[0-9]{4}[A-Z]{3}$/i;
        let regexC3Letters = /^C[0-9]{4}[A-Z]{3}$/i;
        let regexE2Letters = /^E[0-9]{4}[A-Z]{2}$/i;
        let regexE3Letters = /^E[0-9]{4}[A-Z]{3}$/i;
        let regexR2Letters = /^R[0-9]{4}[A-Z]{2}$/i;
        let regexR3Letters = /^R[0-9]{4}[A-Z]{3}$/i;
        let regexA5DigitsVE = /^[A-Z]{1,2}[0-9]{5}VE$/i;
        const regexLettersHistoricos = /^[A-Z]{1,2}[0-9]{5,6}$/i;

        // Mapear las categorías de vehículos con sus expresiones regulares correspondientes
        let regexPatterns = {
            '1': [regexLettersHistoricos,regexCurrent, regexPre1971, regexPre2000, regexP, regexS, regexV, regexH2Letters, regexH3Letters, regexPP],
            '10': [regexCurrent, regexPre1971, regexPre2000, regexP, regexS, regexV, regexR3Letters],
            '4': [regexH, regexPre1971, regexPre2000],
            '19': [regexCurrent, regexPre1971, regexPre2000, regexP, regexS, regexV],
            '23': [regexC3Letters, regexE3Letters, regexCurrent, regexP, regexS, regexV],
            '38': [regexCurrent, regexPre1971, regexPre2000, regexP, regexS, regexV],
            '3': [regexCurrent, regexPre1971, regexPre2000, regexP, regexS, regexV],
            '2': [regexC3Letters, regexCurrent, regexPre1971, regexPre2000, regexP, regexS, regexV],
            '59': [regexC3Letters, regexCurrent, regexPre1971, regexPre2000, regexP, regexS, regexV],
            '60': [regexCurrent, regexPre1971, regexPre2000, regexP, regexS, regexV],
            '5': [regexH, regexPre1971, regexPre2000],
            '8': [regexCurrent, regexPre1971, regexPre2000, regexP, regexS, regexV],
            '7': [regexCurrent, regexPre1971, regexPre2000, regexP, regexS, regexV],
            '9': [regexR2Letters, regexR3Letters, regexE3Letters],
            '14': [regexE3Letters, regexPre2000],
            '15': [regexE3Letters, regexPre2000]
        };

        // Obtener las expresiones regulares para la categoría seleccionada
        if (regexPatterns.hasOwnProperty(id_cat_selected)) {
            regexes = regexPatterns[id_cat_selected];
        } else {
            // Para otros tipos, una validación más genérica
            regexes = [regexCurrent, regexPre1971, regexPre2000];
        }

        // Validar el valor contra las expresiones regulares
        return this.optional(element) || regexes.some(function(regex) {
            return regex.test(value);
        });
    }, "Introduce una matrícula válida según el tipo de vehículo seleccionado.");


    // Configuración global de jQuery Validate
    $.extend($.validator.messages, {
        required: "Este campo es obligatorio",
        email: "Introduce un correo electrónico válido",
        number: "Introduce un número válido",
        maxlength: $.validator.format("No más de {0} caracteres"),
        minlength: $.validator.format("Introduce al menos {0} caracteres"),
        rangelength: $.validator.format("Introduce un valor entre {0} y {1} caracteres"),
        range: $.validator.format("Introduce un valor entre {0} y {1}"),
        max: $.validator.format("Introduce un valor menor o igual a {0}"),
        min: $.validator.format("Introduce un valor mayor o igual a {0}")
    });

    // Añadir reglas de validación basadas en clases
    $.validator.addClassRules("matricula_vehiculo_vrf", {
        required: true,
        validMatricula: true
    });
}


// Función para validar todos los campos
function validarCamposEnDiv(div) {
 

    // Validar solo los campos dentro del div
    var campos = $(div).find("input, textarea, select");
    
    // También incluir campos de formularios dinámicos si estamos en la pantalla 2
    if($(div).attr('id') == 'step-form-anim-2') {
        const formulariosDinamicos = $(div).find('.formulario-dinamico-item input, .formulario-dinamico-item textarea, .formulario-dinamico-item select');
        campos = campos.add(formulariosDinamicos);
        
        // VALIDACIÓN MANUAL DE DIRECCIÓN ANTES DE VALIDAR OTROS CAMPOS
        const tipoVia = $('#tipo_via').val();
        const nombreVia = $('#nombre_via').val();
        const codigoPostal = $('#codigo_postal').val();
        const provincia = $('#provincia').val();
        const poblacion = $('#poblacion').val();
        
        console.log('Valores de dirección:', { tipoVia, nombreVia, codigoPostal, provincia, poblacion });
        
        if (!tipoVia || !nombreVia || !codigoPostal || !provincia || !poblacion) {
            console.log('Dirección incompleta, mostrando error...');
            const botonAnadirDireccion = $('#btn_anadir_direccion');
            
            // Remover errores anteriores
            botonAnadirDireccion.parent().find('label.error').remove();
            
            // Crear y agregar el error manualmente
            const errorLabel = $('<label>', {
                'for': 'tipo_via',
                'class': 'error',
                'text': 'Por favor, añade una dirección haciendo clic en el botón \'Añadir dirección\''
            }).css({
                'display': 'block',
                'text-align': 'center',
                'margin-top': '10px',
                'font-weight': 'bold',
                'color': '#dc3545'
            });
            
            errorLabel.insertAfter(botonAnadirDireccion);
            
            console.log('Error de dirección mostrado');
            return false; // Retornar false inmediatamente si falta la dirección
        } else {
            console.log('Dirección completa, continuando validación...');
            // Remover cualquier error de dirección previo
            $('#btn_anadir_direccion').parent().find('label.error').remove();
        }
    }
    
    var esValido = true;

    campos.each(function() {
        if (!$(this).valid()) {
            esValido = false;
        }
    });

    //validacion custom de hora en el paso 3 (anteriormente paso 9)
    if($(div).attr('id')=='step-form-anim-3'){
        const {valid, message} = validateDateTime();
        if (!valid) {
            // Mostrar alerta de SweetAlert con el mensaje de error
           Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message
            }); 
            esValido = false;
        }
    }


    return esValido;
}

  

jQuery(document).ready(async function ($) {

    // Configurar métodos de validación personalizados
    reglasCustomValidation($);

    
    // Función para verificar la integridad de los steps del formulario
    function verificarIntegridadSteps() {
        try {
            var $stepsElements = $('.steps_asegura_forms');
            var $pasoContainer = $('.pasos-formulario');
            
            // Verificar que existe el contenedor de pasos
            if ($pasoContainer.length === 0) {
                console.warn('Contenedor de pasos (.pasos-formulario) no encontrado');
                return false;
            }

            // Verificar que hay al menos un step
            if ($stepsElements.length === 0) {
                console.warn('No se encontraron steps (.steps_asegura_forms)');
                return false;
            }

            // Verificar que cada step tiene la clase correcta
            var hasValidSteps = true;
            $stepsElements.each(function(index, element) {
                var $element = $(element);
                var classList = $element.attr('class');
                if (!classList || !classList.match(/step\d+_asegura/)) {
                    console.warn('Step sin clase válida encontrado:', element);
                    hasValidSteps = false;
                }
            });

            // Verificar que hay exactamente un step activo
            var $activeSteps = $('.steps_asegura_forms.active');
            if ($activeSteps.length === 0) {
                console.warn('No hay steps activos, activando el primero');
                $stepsElements.first().addClass('active');
            } else if ($activeSteps.length > 1) {
                console.warn('Múltiples steps activos encontrados, manteniendo solo el primero');
                $activeSteps.removeClass('active');
                $activeSteps.first().addClass('active');
            }

            return hasValidSteps;
        } catch (error) {
            console.error('Error verificando integridad de steps:', error);
            return false;
        }
    }

    // Verificar la integridad de los steps al inicio
    verificarIntegridadSteps();

    //Establecemos la página actual para condicionales
    let path = window.location.pathname;
    let page = path.replaceAll('/', '');

    // Inicializar autocompletado de Google Places si está disponible
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        initAutocompleteSPDA();
    }

    /********* Funcionamiento de las distintas pantallas del formulario  *****/

    //fecha nacimiento oculta para registrar lead
    let fechaNacimiento = sessionStorage.getItem('fechaNacimiento');
    // Crear un input escondido con el valor de la variable y agregarle la clase
    const hiddenInput = $('<input>', {
        type: 'hidden',
        value: fechaNacimiento,
        class: 'insulead-fecha-nacimiento'
    });

    // Agregar el input escondido al cuerpo del documento o a un formulario específico
    $('body').append(hiddenInput);

    function scrollToTop() {
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    }

    scrollToTop()

    const localeEs = {
        days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
        today: 'Hoy',
        clear: 'Cancelar',
        dateFormat: 'dd-MM-yyyy',  // Cambiar el formato de fecha aquí
        timeFormat: 'hh:ii',
        firstDay: 1
    };

    // Asignar hora por defecto 00:00
    $('#hora_inicio_cobertura').val('00:00');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Obtener la fecha de mañana
    //const tomorrow = new Date(today);
    //tomorrow.setDate(today.getDate() + 1);

    // Formatear la fecha de mañana a 'dd-MM-YYYY'
    //const tomorrowFormatted = `${('0' + tomorrow.getDate()).slice(-2)}-${('0' + (tomorrow.getMonth() + 1)).slice(-2)}-${tomorrow.getFullYear()}`;

    const todayFormatted = `${('0' + today.getDate()).slice(-2)}-${('0' + (today.getMonth() + 1)).slice(-2)}-${today.getFullYear()}`;
    // Inicializar el datepicker con la fecha de mañana

    new AirDatepicker('#fecha_inicio_cobertura', {
        dateFormat: 'dd-MM-yyyy', // Asegúrate de que este formato coincida con el formateo deseado
        isMobile: true,
        autoClose: true,
        locale: localeEs,
        startDate: today,
        minDate: today,
        onSelect: function({date, formattedDate, datepicker}) {
            if (date) {
                // getDay() devuelve 0 (Dom) ... 5 (Vie) ... 6 (Sáb)
                let dayOfWeek = date.getDay();

                if (dayOfWeek === 5 || dayOfWeek === 6) {
                    // Determinamos el nombre del día: viernes si es 5, sábado si es 6
                    let dayName = dayOfWeek === 5 ? "viernes" : "sábado";

                    // Obtenemos el valor del input de número de días
                    let numDiasSeguro = parseInt(document.querySelector("input[name='num-dias-seguro']").value, 10);

                    if (numDiasSeguro < 18) {
                        // Mostramos el SweetAlert
                        Swal.fire({
                            icon: 'warning',
                            title: 'Atención',
                            text: 'El número de días mínimo a contratar es de 18 al solicitar el inicio de la cobertura en un ' + dayName + '. ' +
                                  'Debe modificar el día de inicio de cobertura o ampliar el número de días a contratar.'
                        }).then(function() {
                            // Al cerrar el SweetAlert:
                            // 1. Se vuelve a seleccionar el día de hoy en el datepicker
                            datepicker.selectDate(today);
                            // 2. Se muestra el elemento con id "step-form-anim-1" y se oculta "step-form-anim-3"
                            document.getElementById("step-form-anim-1").style.display = "block";
                            document.getElementById("step-form-anim-3").style.display = "none";
                        });
                    }
                }
            }
        }
    });





    //Fecha expedición carnet
    new AirDatepicker('#fecha_carnet_conductor', {
        dateFormat: 'dd-MM-yyyy',
        isMobile: true,
        autoClose: true,
        locale: localeEs,
        startDate: new Date(2001, 1, 1),
        view: 'years',
        minView: 'days',
        onChangeView(view) {
            // Cambiar la vista al seleccionar años o meses
            const instance = this; // 'this' se refiere a la instancia del datepicker
            setTimeout(() => {
                if (view === 'years' && instance.setView) {
                    instance.setView('months');
                } else if (view === 'months' && instance.setView) {
                    instance.setView('days');
                }
            }, 0);
        },
        onSelect: function({formattedDate, date}) {
            // Validar si han pasado al menos 21 años desde la fecha de nacimiento
            validateAge(date); 
        }
    });


    function validateAge(fechaCarnetConducir) {
        // Obtener la fecha de nacimiento desde sessionStorage
        const fechaNacimiento = sessionStorage.getItem('fechaNacimiento');
        
        if (!fechaNacimiento) {
            // Mostrar alerta con SweetAlert2 si no hay fecha de nacimiento en sessionStorage
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se ha encontrado la fecha de nacimiento en el almacenamiento.',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Convertir la fecha de nacimiento de sessionStorage a un objeto Date
        const [day, month, year] = fechaNacimiento.split('-'); // Formato dd-MM-yyyy
        const fechaNac = new Date(year, month - 1, day); // Convertimos la fecha de nacimiento a Date

        // Calcular la diferencia en años entre la fecha del carnet y la fecha de nacimiento
        let edad = fechaCarnetConducir.getFullYear() - fechaNac.getFullYear();
        const mes = fechaCarnetConducir.getMonth() - fechaNac.getMonth();
        const dia = fechaCarnetConducir.getDate() - fechaNac.getDate();

        // Ajustar la edad si el mes o el día no han pasado en este año
        if (mes < 0 || (mes === 0 && dia < 0)) {
            edad--;
        }

        // Validar si han pasado al menos 18 años
        if (edad < 18) {
            // Mostrar alerta de SweetAlert2 si no han pasado 18 años
            Swal.fire({
                icon: 'error',
                title: 'Fecha inválida',
                text: 'La fecha seleccionada debe ser al menos 18 años después de la fecha de nacimiento.',
                confirmButtonText: 'Entendido'
            });
            // Limpiar el campo si la validación falla
            $('#fecha_carnet_conductor').val('');
        }
    }



    // Setear el valor del input a la fecha de mañana
    $('#fecha_inicio_cobertura').val(todayFormatted);


    //En la selección de coberturas colocamos el recomendado a la de asistencai en carretera
    var checkExist = setInterval(function() {
        // Verificamos si el span 'text-primary' existe
        if ($('label[for="Asistencia"]').find('span.text-primary').length) {
            // Añadimos el nuevo span después del 'span.text-primary'
            $('label[for="Asistencia"]').find('span.text-primary').after('<span class="recommend-lab">Recomendado</span>');
            // Detenemos el intervalo
            clearInterval(checkExist);
        }
    }, 100); // Revisa cada 100ms


    //Definimos las pantallas con aside
    let pantallasConAside = [2, 3, 4, 5];

    // Inicialmente, mostrar solo el primer paso y ocultar los botones de volver si estamos en el primer paso
    $('div[id^="step-form-anim-"]').hide();
    $('#step-form-anim-1').show();
    $('.link-paso-atras').hide();



    /********** CONDICIONES PARA PODER CONTRATAR LA CARTA VERDE ********/
    $(document).on('change', '#cartaverde', function () {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Lunes, ..., 5 = Viernes
        const numDias = parseInt($('input[name="num-dias-seguro"]').val(), 10) || 0;

        if ($(this).is(':checked')) {
            if ((dayOfWeek !== 5 && numDias < 15) || (dayOfWeek === 5 && numDias < 18)) {
                // Condición no cumplida
                Swal.fire({
                    icon: 'error',
                    title: 'Número de días insuficiente',
                    text: dayOfWeek === 5
                        ? 'El número mínimo de días para poder contratar la carta verde los viernes es de 18.'
                        : 'El número mínimo de días para poder contratar la carta verde es de 15.',
                });

                // Desmarcar la opción de carta verde
                $(this).prop('checked', false);
            } else {
                // Condición cumplida
                Swal.fire({
                    icon: 'info',
                    title: 'Información sobre la carta verde',
                    text: dayOfWeek === 5
                        ? 'La carta verde se emite manualmente y se envía dentro de las 24h siguientes a su emisión, salvo aquellas pólizas emitidas los viernes a partir de las 14h que se emitirán el lunes si no es festivo'
                        : 'La carta verde se emite manualmente y se envía dentro de las 24h siguientes a su emisión, salvo aquellas pólizas emitidas los viernes a partir de las 14h que se emitirán el lunes si no es festivo',
                });
            }
        }
    });

    // Asegurarse de que el valor mínimo del número de días sea 1
    $(document).on('input', 'input[name="num-dias-seguro"]', function () {
        if (this.value < 1) {
            this.value = 1;
        }
    });



    // Función para determinar el siguiente paso basado en las respuestas
    function getNextStep(currentStep) {
        let nextStep = currentStep.next('div[id^="step-form-anim-"]');

        /******** NUEVA LÓGICA SIMPLIFICADA PARA LAS PANTALLAS 1, 2, 3, 4, 5 ***********/
        // Ya no hay saltos complejos, simplemente vamos secuencialmente
        // Pantalla 1 -> Pantalla 2 -> Pantalla 3 -> Pantalla 4 -> Pantalla 5
        
        return nextStep;
    }

    // Función para determinar el paso anterior basado en el historial
    function getPreviousStep() {
        return $('#' + stepHistory.pop());
    }

    // Variable para guardar el historial de pasos
    let stepHistory = [];


    function avanzar_siguiente_paso(event, elemento_disparador){
        event.preventDefault();

        var currentStep = $(elemento_disparador).closest('div[id^="step-form-anim-"]');
        
        // Validar que encontramos el step actual
        if (!currentStep.length) {
            console.error('No se pudo encontrar el step actual');
            return;
        }

        var isvalidaPantalla = validarCamposEnDiv(currentStep);
        var nextStep = getNextStep(currentStep);

        var currentPasoLinea = $('.steps_asegura_forms.active');
        var nextStepPasoLinea = currentPasoLinea.next('.steps_asegura_forms');

        // Verificar que nextStep existe y tiene elementos, y que la validación es correcta
        if (nextStep && nextStep.length > 0 && isvalidaPantalla) {
            stepHistory.push(currentStep.attr('id')); // Guardar el paso actual en el historial

            currentStep.fadeOut(250, function () {
                nextStep.fadeIn(250);

                currentPasoLinea.removeClass('active');
                if (nextStepPasoLinea.length > 0) {
                    nextStepPasoLinea.addClass('active');
                }

                updateClassesOnStep(pantallasConAside);
            });

            $('.link-paso-atras').show();

            scrollToTop();
        } else {
            // Log para debug cuando no se puede avanzar
            if (!nextStep || nextStep.length === 0) {
                console.warn('No se encontró el siguiente paso válido');
            }
            if (!isvalidaPantalla) {
                console.warn('La validación de la pantalla actual falló');
            }
        }
    }
    // Manejar el botón de siguiente
    $('.btn-next-form').click(function (event) {
        avanzar_siguiente_paso(event, this);
    });

    // Manejar el botón de atrás
    $('.link-paso-atras').click(function (event) {
        event.preventDefault();

        var currentStep = $('div[id^="step-form-anim-"]:visible');
        var prevStep = $('#' + stepHistory.pop()); // Obtener el paso anterior del historial

        var actualPasoLinea = $('.steps_asegura_forms.active');
        var anteriorStepPasoLinea = actualPasoLinea.prev('.steps_asegura_forms');

        if (prevStep.length) {
            currentStep.fadeOut(250, function () {
                prevStep.fadeIn(250);

                actualPasoLinea.removeClass('active');
                anteriorStepPasoLinea.addClass('active');

                updateClassesOnStep(pantallasConAside);
            });

            if (stepHistory.length === 0) {
                $('.link-paso-atras').hide();
            }
        }

        //si hay que quitar puntos, actualizamos (definida en asegura-core)
        gestionarStepsaEliminar()
    });



    // Llamar la función inicialmente
    updateClassesOnStep(pantallasConAside);


    // Manejo de seleccionar/deseleccionar coberturas
    $(document).on('change', '.form-check-input.cobertura-checked', function () {
        const productId = $(this).data('id');
        const esprincipal = $(this).data('principal');
        const isChecked = $(this).is(':checked');
        if (esprincipal) {
            let elementos = $('.form-check-input.cobertura-checked[data-id][data-principal]').not(`[data-id="${productId}"]`);
            elementos.prop('checked', !isChecked); // Marca los elementos
        }
        $(`.form-check-input.cobertura-checked[data-id="${productId}"]`).prop('checked', isChecked);
        TarificarActualizar();

        //Hacemos scroll hacia arriba
        scrollToTop()
    });

    const maxDias = 28;
    const incrementoEspecial = 7;
    const minDias = 1;
    const maxDiasglobal = 56;
    let timeout;

    const reiniciarTemporizador = () => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            ActualizarCoberturas(false); // Tu función de actualización
        }, 500); // Supongo que delay_boton_mas_menos es 500ms
    };

    const actualizarDias = (incremento) => {
        let $input = $("input[name='num-dias-seguro']");
        let valorActual = parseInt(obtener_num_dias_seguro());
    
        // Si el valor actual es NaN, asignamos un valor por defecto de 1
        if (isNaN(valorActual)) {
            valorActual = 1;  // Valor inicial por defecto
        }
    
        // Incrementar de 7 en 7 después de 28 días
        if (valorActual >= maxDias ) {
            if(incremento>0){
                valorActual += incrementoEspecial;
            }else{
                valorActual -= incrementoEspecial;
            }
        } else {
            valorActual += incremento;
        }
    
        // Limitar el valor mínimo a 1 y evitar bajar de ahí
        if (valorActual < minDias) {
            valorActual = minDias;
        }



        // Limitar el valor maximo a 56 y evitar bajar de ahí
        if (valorActual > maxDiasglobal) {
            valorActual = maxDiasglobal;

        }

        let tipo_poliza_selected = sessionStorage.getItem('idProductoPorDias'); // Ejemplo
        tipo_poliza_selected  = parseInt(tipo_poliza_selected)
        //para tipos de vehiculos que solo permiten menos o igual a 28 dias
        let listado_que_permite_menos_o_28_dias=[10];
        if(valorActual>maxDias && listado_que_permite_menos_o_28_dias.includes(tipo_poliza_selected)) {
            valorActual = maxDias;
        }
    
        // Actualizar el valor del input
        $input.val(valorActual);
        $input.change();  // Para asegurar que se disparen otros eventos vinculados
    };

    // Override completo con stopImmediatePropagation para bloquear el plugin
    $('.minus').off('click').on('click', function (event) {
        event.preventDefault(); // Evitar cualquier comportamiento por defecto
        event.stopImmediatePropagation(); // Evitar que cualquier otro handler se ejecute, incluyendo el del plugin
        actualizarDias(-1);  // Restar un día
        reiniciarTemporizador();  // Reiniciar temporizador
    });

    $('.plus').off('click').on('click', function (event) {
        event.preventDefault(); // Evitar comportamiento por defecto
        event.stopImmediatePropagation(); // Bloquear el resto de los handlers
        actualizarDias(1);  // Sumar un día (o 7 si aplica)
        reiniciarTemporizador();  // Reiniciar temporizador
    });

    // Función debounce
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    // Usar debounce con el evento input
    $("input[name='num-dias-seguro']").on('input', debounce(() => {
        let $input = $("input[name='num-dias-seguro']");
        let valorActual = parseInt(obtener_num_dias_seguro());
        valorActual = valorActual ? (valorActual == '' ? 1 : (valorActual == 0 ? 1 : valorActual)) : 1 ;
        if(valorActual>28){
            valorActual=Math.ceil(valorActual / 7) * 7;
        }

        // Limitar el valor maximo a 56 y evitar bajar de ahí
        if (valorActual > 56) {
            valorActual = 56;
        }
        // Actualizar el valor del input
        $input.val(valorActual);
        $input.change();  // Para asegurar que se disparen otros eventos vinculados
        
        ActualizarCoberturas(false);
    }, 800));

    $('#sg-paso-1').click(() => {
        let coberturas = obtenerCoberturasSeleccionados();
        sessionStorage.setItem('productos_seleccionados', JSON.stringify(obtenerIdsSeleccionados()));
        sessionStorage.setItem('coberturas_seleccionadas', JSON.stringify(coberturas));
        sessionStorage.setItem('num_dias_seguro', obtener_num_dias_seguro());
        sessionStorage.setItem('temporalidad', obtener_temporalidad());

        let precio = sessionStorage.getItem('precio');
        $('#precio_tarificacion_aside').html(`${precio} €`)
        $('.prc-seguro-spdmb').html(`${precio}`)
        $('#precio_value').html(`${precio} €`)
        actualizarCoberturas(coberturas);
    })


    //En caso de que estemos en una póliza de coche, moto o moto eléctrica, permitimos seleccionar por días o por semanas.
    let tipo_poliza_selected = sessionStorage.getItem('idProductoPorDias'); // Ejemplo
    tipo_poliza_selected  = parseInt(tipo_poliza_selected)


    // Función para mostrar opciones de Días o Semanas
    function mostrarOpcionesPoliza() {
        if ([1, 2, 59].includes(tipo_poliza_selected)) {
            $('#tipo-poliza-options').show();
        } else {
            $('#tipo-poliza-options').hide();
        }
    }

    // Ejecutar al cargar la página
    mostrarOpcionesPoliza();

    // Manejar el cambio de selección del radio button
    $('input[name="periodo"]').change(function() {
        temporalidad_global = $(this).val();
        
        if (temporalidad_global === 'semanas') {
            $('#etiqueta_num_duracion').text('Número de semanas');
            var $inputDiasSeguro = $('input[name="num-dias-seguro"]');
            $inputDiasSeguro.val(5).attr({
                'min': 5,
                'max': 8
            });

        } else {
            $('#etiqueta_num_duracion').text('Número de días');
            var $inputDiasSeguro = $('input[name="num-dias-seguro"]');
            $inputDiasSeguro.val(1).removeAttr('min').attr('max', 28);
        }
        
        ActualizarCoberturas(false);
    });



    $('#sg-paso-2').click(async () => {

        // Función para obtener la hora actual más 70 minutos
        function getCurrentTimePlus70Minutes() {
            const now = new Date();
            now.setMinutes(now.getMinutes() + 70); // Sumar 70 minutos a la hora actual

            let hours = now.getHours();
            let minutes = now.getMinutes();

            // Formatear la hora y los minutos para que siempre tengan dos dígitos
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;

            return `${hours}:${minutes}`;
        }

        // Obtener la hora actual más 70 minutos
        const timePlus70 = getCurrentTimePlus70Minutes();
        // Establecer el valor del input de hora
        $('#hora_inicio_cobertura').val(timePlus70);
        await insu_registrar_lead();

        let valor_operacion= sessionStorage.getItem('precio');
        insu_registrar_rate(valor_operacion);
    });







    $('#sg-paso-3').click(async (e) => {

        e.preventDefault();

        let data = collectFormData();

        $('#marca_value').text(data["marca_vehiculo"]);
        $('#modelo_value').text(data["modelo_vehiculo"]);
        $('#matricula_value').text(data["matricula_vehiculo"]);

        // Completar datos del conductor
        $('#nombre_conductor_value').text(data["nombre-tomador"] + ' ' + data["primer_apellido-tomador"] + ' ' + data["segundo-apellido-tomador"]);
        $('#dni_conductor_value').text(data["tipo-documento-tomador"] + ' - ' + data["identificador-tomador"]);
        $('#fecha_nacimiento_value').text(data["fecha_nacimiento_conductor"]);
        $('#fecha_expedicion_carnet_value').text(data["fecha_carnet_conductor"]);

        // Completar datos de contacto
        $('#email_value').text(data["email-tomador"]);
        $('#telefono_value').text(data["telefono-tomador"]);
        $('#direccion_value').text( `${data["tipo_via"]} ${data["nombre_via"]} ${data["numero_via"]}` );
        $('#cp_localidad_value').text(data["codigo_postal"] + ' - ' + data["poblacion"]);

        // Completar datos de la póliza
        $('#periodo_value').text("Seguro por días");
        let temporalidad = sessionStorage.getItem('temporalidad');

        $('#carta_verde_value').text(data["cartaverde"] ? "Si" : "No");


        $('#duracion_value').text(data["num-dias-seguro"] + ' ' + temporalidad);
        $('#inicio_value').text((data["fecha_inicio_cobertura"]) + " a las " + data["hora_inicio_cobertura"]);


        // Cálculo fecha vencimiento
        // Fecha en formato "DD-MM-YYYY" 
        let fechaStr = data["fecha_inicio_cobertura"];
        // Número de días a sumar
        let diasASumar = 0;
        if (temporalidad == "semanas") {
            diasASumar = parseInt(data["num-dias-seguro"]) * 7;
        }else {
            diasASumar = parseInt(data["num-dias-seguro"]);
        }
        

        // Función para sumar días a una fecha
        function sumarDiasAFecha(fecha, dias) {
            // Crear un objeto Date en UTC
            const fechaObj = new Date(`${fecha}T00:00:00Z`);
        
            // Sumar los días a la fecha
            fechaObj.setUTCDate(fechaObj.getUTCDate() + dias);
        
            // Obtener los valores de día, mes y año de la nueva fecha
            const nuevoDia = fechaObj.getUTCDate().toString().padStart(2, '0');
            const nuevoMes = (fechaObj.getUTCMonth() + 1).toString().padStart(2, '0');
            const nuevoAnio = fechaObj.getUTCFullYear();
        
            // Formatear la nueva fecha en formato "dd-MM-yyyy"
            return `${nuevoDia}-${nuevoMes}-${nuevoAnio}`;
        }

        let fechaVencimiento = sumarDiasAFecha(convertirFormatoFecha(fechaStr), diasASumar);

        //Mostramos la fecha y hora de vencimiento
        $('#vencimiento_value').text(fechaVencimiento + " a las " + data["hora_inicio_cobertura"]);


        if(data['tipo-propietario-vehiculo']=='juridica'){
            // Completar datos del propietario del vehículo y tomador de la póliza
            $('#propietario_value').text(data["nombre-propietario-juridico"] );
            $('#dni_propietario_value').text(data["identificador-propietario-juridico"]);
        }else{
            // Completar datos del propietario del vehículo y tomador de la póliza
            $('#propietario_value').text(data["nombre-propietario-veh"] + ' ' + data["primer_apellido-propietario-veh"] + ' ' + data["segundo-apellido-propietario-veh"]);
            $('#dni_propietario_value').text(data["identificador-propietario-veh"]);
        }



        if(data["tomador-es-persona-juridica"]=="si"){
            $('#tomador_value').text(data["nombre-tomador-juridico"]);
            $('#dni_tomador_value').text(data["identificador-tomador-juridico"]);
        }else{
            $('#tomador_value').text(data["nombre-tomador"] + ' ' + data["primer_apellido-tomador"] + ' ' + data["segundo-apellido-tomador"]);
            $('#dni_tomador_value').text(data["identificador-tomador"]);
        }

      
    })




    $('#sg-paso-4').click(async (event) => {
        const protocolo = window.location.protocol; // "https:"
        const dominio = window.location.hostname;   // "www.example.com"
        const url_dominio = `${protocolo}//${dominio}`;

        let dia_sumar = parseInt(sessionStorage.getItem('num_dias_seguro'));

        let data = collectFormData();
        sessionStorage.removeItem('spda_data_for_contract');
        sessionStorage.setItem('spda_data_for_contract', JSON.stringify(data));
        let inicioCobertura = data.fecha_inicio_cobertura;

        let fechaStr = data["fecha_inicio_cobertura"];
        let finCobertura = sumarDiasAFecha(convertirFormatoFecha(fechaStr), dia_sumar);
        const elemento_disparador = event.currentTarget;

        // Verificamos si el checkbox "cartaverde" está marcado y definimos el mensaje a mostrar
        let cartaverdeMessage = "";
        if ($("#cartaverde").is(":checked")) {
            cartaverdeMessage = `<p class='alert alert-success'>Se te enviará tu carta verde el primer día laborable en Madrid.</p>`;
        }

        Swal.fire({
            title: 'VERIFICA LA INFORMACIÓN',
            html: `
                <div class="bloque-restl-pup">
                    <p style="font-size: 26px;color: var(--color-b);"><b>Matrícula:</b> ${data.matricula_vehiculo}</p>
                    <p style="font-size: 26px;color: var(--color-b);"><b>NIF:</b> ${data['identificador-tomador']}</p>
                </div>
                <p><b>Email</b>: ${data['email-tomador']}</p>
                <p><b>Teléfono</b>: ${data['telefono-tomador']}</p>
                <p><b>Inicio cobertura</b>: ${inicioCobertura} a las ${data['hora_inicio_cobertura']}</p>
                <p><b>Fin de la cobertura</b>: ${finCobertura} a las ${data['hora_inicio_cobertura']}</p>
                ${cartaverdeMessage}
            `,
            icon: 'warning',
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: 'Son correctos',
            cancelButtonText: 'Revisar',
            customClass: {
                confirmButton: 'btn-swal-accept repitas3',
                cancelButton: 'btn-swal-cancel spectas'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                $('#loader-simple').show();
                try {
                    let respuesta_emision = await Emitir(data);
                    sessionStorage.removeItem('spda_id_venta');
                    sessionStorage.setItem('spda_id_venta', respuesta_emision.idTransaccion);
                    await SPDA_guardar_transient({
                        idTransaccion: respuesta_emision.idTransaccion,
                        insu_id : sessionStorage.getItem('INSU_WP_ARISE_RATE') ,
                        ...data
                    })
                    avanzar_siguiente_paso(event, elemento_disparador);
                    // Timeout para esperar que haga el fade out y fade in
                    setTimeout(() => {
                        let iframeHtml = respuesta_emision.iframePago;

                        // Incrustar el iframe dentro del contenedor existente
                        $('#contendorframepago').html(iframeHtml);
                        
                        // Cambiar el height del iframe una vez incrustado
                        let iframe = $('#contendorframepago').find('iframe'); // Encuentra el iframe dentro del contenedor
                        iframe.css('height', '1400px'); // Ajusta el valor de altura (por ejemplo, 500px)
                        $('#loader-simple').attr('style', 'display: none !important;');
                    }, 600);
                } catch (err) {
                    Swal.fire({
                        title: 'Error!',
                        text: limpiarTexto(err[0].error),
                        icon: 'error',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        return;
                    });
                    $('#loader-simple').attr('style', 'display: none !important;');
                }
            }
        });
    });


    





    //En la página contrataar-seguro-por-dias-spda.php, comprobamos estamos recibiendo los datos correctos
    if (page == "contratar-seguro-por-dias-spda") {
        sessionStorage.removeItem('productos_seleccionados');
        sessionStorage.removeItem('coberturas_seleccionadas');
        sessionStorage.removeItem('num_dias_seguro');
        sessionStorage.removeItem('precio');
        sessionStorage.removeItem('quotation_id');
        sessionStorage.removeItem('spda_data_for_contract');
        sessionStorage.removeItem('spda_id_venta');       
        ActualizarCoberturas(true);
    }

    if (page == "agradecimiento-seguro-spda") {
        const {cartaverde} = JSON.parse(sessionStorage.getItem('spda_data_for_contract'));
        let matriculaVar = sessionStorage.getItem('matricula');
        if (cartaverde) {
            Swal.fire({
        title: '<strong>Información carta verde</strong>',
        html: `
          <p>
            Si la necesitas urgente o no la recibes en el plazo indicado, puedes solicitarla en el teléfono 
            <a href="tel:917373810">917 373 810</a> indicando tu matrícula <strong>${matriculaVar}</strong>.
         </p>
        `,
        icon: 'info',
        confirmButtonText: 'Aceptar',
      })
        }
    }








    

    /*****
     * FIN MEJORA PARA REGISTRAR LA CONTRATACIÓN TRAS LAS RESPUESTA DEL SERVIDOR DE LA COMPAÑÍA CON EL OK
     * *****/


    //Código para mostrar el aside en móvil para mostrar el desplegable con el precio y demás info:
    let isRotated = false;

    // Aseguramos que el documento esté cargado completamente antes de buscar los elementos
    // Creamos una función para ejecutar cuando se hace clic en el elemento con la clase 'show-dt'
    $('.show-dt').on('click', function () {
        // Verificamos si ya se ha realizado la rotación
        if (isRotated) {
            // Si ya está rotado, volvemos a la posición inicial
            $(this).css('transform', '');
            // Utilizamos la función animate de jQuery para crear una transición suave
            $('.aside-resumen').animate({
                'opacity': 0,
                'top': '100vh'
            }, 500, function () {
                $(this).css('display', 'none');
            });
            isRotated = false;
        } else {
            // Si no está rotado, lo rotamos 180 grados
            $(this).css('transform', 'rotate(360deg)');
            // Ajustamos la posición inicial antes de mostrar el elemento
            $('.aside-resumen').css({
                'display': 'block',
                'position': 'fixed',
                'top': '100vh',
                'left': '0',
                'opacity': 1
            });
            // Utilizamos la función animate de jQuery para crear una transición suave
            $('.aside-resumen').animate({
                'opacity': 1,
                'top': '0'
            }, 500);
            isRotated = true;
        }
    });


});


/***
 * LÓGICA PARA VALIDACIÓN Y DETECCIÓN AUTOMÁTICA DEL TIPO DE DOCUMENTO
 ****/

// Función para validar NIF
function validarNIFspda(nif) {
    const re = /^(\d{8})([A-Z])$/i;
    const m = nif.toUpperCase().match(re);
    if (!m) return false;
    const numero = parseInt(m[1], 10);
    const letra  = m[2];
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKET';
    return letras[numero % 23] === letra;
}

// Función para validar NIE
function validarNIEspda(nie) {
    const re = /^[XYZ]\d{7}[A-Z]$/i;
    const m = nie.toUpperCase().match(re);
    if (!m) return false;
    const prefixMap = { X: '0', Y: '1', Z: '2' };
    const num       = prefixMap[nie[0].toUpperCase()] + nie.substr(1, 7);
    const letra     = nie.substr(8, 1).toUpperCase();
    const letras    = 'TRWAGMYFPDXBNJZSQVHLCKET';
    return letras[parseInt(num, 10) % 23] === letra;
}

// Función para validar CIF
function validarCIFspda(cif) {
    const re = /^([ABCDEFGHJNPQRSUVW])(\d{7})([0-9A-J])$/i;
    const m = cif.toUpperCase().match(re);
    if (!m) return false;
    const letra    = m[1];
    const numeros  = m[2];
    const control  = m[3];
    let sumPar     = 0;
    let sumImpar   = 0;

    for (let i = 0; i < numeros.length; i++) {
        const n = parseInt(numeros.charAt(i), 10);
        if ((i + 1) % 2 === 0) {
            sumPar += n;
        } else {
            const doubled = n * 2;
            sumImpar += doubled > 9 ? Math.floor(doubled / 10) + doubled % 10 : doubled;
        }
    }

    const suma     = sumPar + sumImpar;
    const unidad   = suma % 10;
    const dig      = unidad === 0 ? 0 : 10 - unidad;
    const letrasDC = 'JABCDEFGHI';
    let esperado   = '';

    // según inicial de CIF
    if ('KPQRSNW'.includes(letra)) {
        esperado = letrasDC[dig];
    } else if ('ABEH'.includes(letra)) {
        esperado = dig.toString();
    } else {
        esperado = dig.toString();
    }

    return control === esperado;
}

/**
 * Al perder el foco del campo "identificador-tomador", validamos:
 *   - si es NIF → valor 1
 *   - si es NIE → valor 3  
 *   - si es CIF → no permitido para tomador (persona física)
 * Si no es válido, marcamos error y mostramos un <label>.
 * Actualiza directamente el campo oculto que va al backend.
 */
$(function() {
    $('#identificador-tomador').on('blur', function() {
        const $input       = $(this);
        const val          = $.trim($input.val());
        const id           = this.id;
        const $hiddenTipo  = $('#tipo-documento-tomador');

        // Limpiar posible error anterior
        $input.removeClass('error').attr('aria-invalid', 'false');
        $(`#${id}-error`).remove();

        if (!val) {
            // si está vacío, limpiamos el campo oculto
            $hiddenTipo.val('');
            return;
        }

        // Determinar tipo y valor numérico para el backend
        if (validarNIFspda(val)) {
            $hiddenTipo.val('NIF'); // 1 = NIF según el backend
        } else if (validarNIEspda(val)) {
            $hiddenTipo.val('NIE'); // 3 = NIE según el backend
        } else if (validarCIFspda(val)) {
            // CIF detectado pero no está permitido para el tomador (persona física)
            $input
                .addClass('error')
                .attr('aria-invalid', 'true');
            $(`<label id="${id}-error" class="error" for="${id}">Para el tomador solo se permiten documentos de persona física (NIF/NIE).</label>`)
                .insertAfter($input);
            $hiddenTipo.val('');
            return;
        } else {
            // Documento NO válido → mostrar error
            $input
                .addClass('error')
                .attr('aria-invalid', 'true');
            $(`<label id="${id}-error" class="error" for="${id}">Introduce un documento válido (NIF/NIE).</label>`)
                .insertAfter($input);
            $hiddenTipo.val('');
        }
    });

    // Para el propietario del vehículo
    $('#identificador-propietario-veh').on('blur', function() {
        const $input       = $(this);
        const val          = $.trim($input.val());
        const id           = this.id;
        const $hiddenTipo  = $('#tipo-documento-propietario-veh');

        // Limpiar posible error anterior
        $input.removeClass('error').attr('aria-invalid', 'false');
        $(`#${id}-error`).remove();

        if (!val) {
            // si está vacío, limpiamos el campo oculto
            $hiddenTipo.val('');
            return;
        }

        // Determinar tipo y valor numérico para el backend
        if (validarNIFspda(val)) {
            $hiddenTipo.val('NIF'); // 1 = NIF según el backend
        } else if (validarNIEspda(val)) {
            $hiddenTipo.val('NIE'); // 3 = NIE según el backend  
        } else if (validarCIFspda(val)) {
            // CIF detectado - para propietario físico no es válido
            $input
                .addClass('error')
                .attr('aria-invalid', 'true');
            $(`<label id="${id}-error" class="error" for="${id}">CIF detectado. Para propietario físico solo se permiten NIF/NIE.</label>`)
                .insertAfter($input);
            $hiddenTipo.val('');
            return;
        } else {
            // Documento NO válido → mostrar error
            $input
                .addClass('error')
                .attr('aria-invalid', 'true');
            $(`<label id="${id}-error" class="error" for="${id}">Introduce un documento válido (NIF/NIE).</label>`)
                .insertAfter($input);
            $hiddenTipo.val('');
        }
    });

    // Para el propietario jurídico (CIF) - este campo ya funciona correctamente
    $('#identificador-propietario-juridico').on('blur', function() {
        const $input = $(this);
        const val    = $.trim($input.val());
        const id     = this.id;

        // Limpiar posible error anterior
        $input.removeClass('error').attr('aria-invalid', 'false');
        $(`#${id}-error`).remove();

        if (!val) {
            // si está vacío, no validamos
            return;
        }

        if (validarCIFspda(val)) {
            // CIF válido - no hacemos nada más, el campo es correcto
        } else {
            // CIF NO válido → mostrar error
            $input
                .addClass('error')
                .attr('aria-invalid', 'true');
            $(`<label id="${id}-error" class="error" for="${id}">Introduce un CIF válido.</label>`)
                .insertAfter($input);
        }
    });

    // Para el tomador jurídico (CIF) - validación similar
    $('#identificador-tomador-juridico').on('blur', function() {
        const $input = $(this);
        const val    = $.trim($input.val());
        const id     = this.id;

        // Limpiar posible error anterior
        $input.removeClass('error').attr('aria-invalid', 'false');
        $(`#${id}-error`).remove();

        if (!val) {
            // si está vacío, no validamos
            return;
        }

        if (validarCIFspda(val)) {
            // CIF válido - no hacemos nada más, el campo es correcto
        } else {
            // CIF NO válido → mostrar error
            $input
                .addClass('error')
                .attr('aria-invalid', 'true');
            $(`<label id="${id}-error" class="error" for="${id}">Introduce un CIF válido.</label>`)
                .insertAfter($input);
        }
    });
    
    // Inicializar event listeners para preguntas dinámicas
    agregarEventListenersPreguntasTrigger();
    
    // Llamar a la función de validaciones dinámicas
    agregarValidacionesCamposDinamicos();
    
    // Event listeners para los campos básicos del conductor
    $('#nombre-tomador, #primer_apellido-tomador, #identificador-tomador').on('input blur', function() {
        gestionarEstadoPreguntasDinamicas();
        
        // Si es el campo nombre, detectar género automáticamente
        if ($(this).attr('id') === 'nombre-tomador') {
            const nombre = $(this).val();
            if (nombre && nombre.length >= 2) {
                // Ejecutar detección con un pequeño delay para mejor UX
                setTimeout(() => {
                    actualizarSexoConductorAutomatico(nombre);
                }, 300);
            }
        }
    });
    
    // Verificar estado inicial
    gestionarEstadoPreguntasDinamicas();
    
    // Limpiar formularios dinámicos al cambiar los datos del conductor
    $('#nombre-tomador, #primer_apellido-tomador').on('input', function() {
        // Actualizar el nombre del conductor en los formularios dinámicos existentes
        actualizarNombreConductorEnOpciones();
        
        // Limpiar formularios dinámicos existentes cuando cambian los datos del conductor
        const container = document.getElementById('formularios-dinamicos-container');
        if (container && container.children.length > 0) {
            // Solo limpiar si hay formularios y hay un nombre/apellido
            const nombre = document.getElementById('nombre-tomador').value;
            const apellido = document.getElementById('primer_apellido-tomador').value;
            if (nombre || apellido) {
                // Actualizar títulos existentes
                const tituloPrincipal = document.getElementById('pregunta-propietario-titulo');
                if (tituloPrincipal && !tituloPrincipal.textContent.includes('¿Es el conductor que has indicado')) {
                    // Resetear pregunta principal si ya fue personalizada
                    tituloPrincipal.textContent = '¿Es el conductor que has indicado el propietario de este vehículo?';
                    // Reset radio buttons
                    document.querySelectorAll('input[name="es-conductor-y-propietario"]').forEach(radio => {
                        radio.checked = false;
                    });
                    // Limpiar formularios dinámicos
                    limpiarFormulariosDinamicos();
                }
            }
        }
    });
});

// Función para capitalizar la primera letra de cada palabra
function capitalizeWords(str) {
    return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
}

function traer_slug_landing() {
    return window.location.pathname.split('/').filter(Boolean).pop();
}

/***
 * SISTEMA DE DETECCIÓN AUTOMÁTICA DE GÉNERO POR NOMBRE ESPAÑOL
 ***/

// Base de datos de nombres españoles más comunes con género conocido
const nombresMasculinosEspanoles = {
    // Nombres muy comunes masculinos
    'antonio': 0.98, 'jose': 0.98, 'francisco': 0.98, 'juan': 0.98, 'manuel': 0.98,
    'pedro': 0.98, 'jesus': 0.98, 'angel': 0.97, 'miguel': 0.98, 'rafael': 0.98,
    'luis': 0.98, 'carlos': 0.98, 'fernando': 0.98, 'alejandro': 0.97, 'david': 0.97,
    'jorge': 0.98, 'ricardo': 0.97, 'javier': 0.98, 'daniel': 0.97, 'alberto': 0.98,
    'eduardo': 0.97, 'roberto': 0.98, 'ignacio': 0.98, 'sergio': 0.97, 'pablo': 0.97,
    'oscar': 0.97, 'ruben': 0.97, 'diego': 0.97, 'victor': 0.97, 'adrian': 0.96,
    'raul': 0.98, 'mario': 0.97, 'gonzalo': 0.98, 'ivan': 0.97, 'enrique': 0.98,
    'martin': 0.97, 'marcos': 0.97, 'cristian': 0.96, 'julian': 0.97, 'samuel': 0.96,
    'gabriel': 0.96, 'nicolas': 0.96, 'andres': 0.97, 'alvaro': 0.98, 'santiago': 0.97,
    'rodrigo': 0.98, 'sebastian': 0.96, 'emilio': 0.98, 'jaime': 0.97, 'bruno': 0.96,
    'mateo': 0.96, 'hugo': 0.95, 'aaron': 0.95, 'leo': 0.94, 'iker': 0.96,
    'tomas': 0.97, 'lucas': 0.94, 'matias': 0.96, 'elias': 0.95, 'isaias': 0.96,
    'adan': 0.97, 'abraham': 0.97, 'benjamin': 0.96, 'cesar': 0.97, 'domingo': 0.98,
    'esteban': 0.98, 'fabian': 0.96, 'gaspar': 0.98, 'hector': 0.97, 'ismael': 0.97,
    'joaquin': 0.97, 'lorenzo': 0.98, 'maximiliano': 0.97, 'natanael': 0.97, 'octavio': 0.98,
    'patricio': 0.97, 'quintin': 0.98, 'salvador': 0.97, 'teodoro': 0.98, 'ulises': 0.97,
    'valentin': 0.97, 'ximeno': 0.98, 'zacarias': 0.97, 'agustin': 0.97, 'bautista': 0.96,
    'cristobal': 0.98, 'demetrio': 0.98, 'eugenio': 0.98, 'florencio': 0.98, 'gregorio': 0.98,
    'herminio': 0.98, 'inocencio': 0.98, 'jeronimo': 0.98, 'leandro': 0.97, 'macedonio': 0.98,
    'nemesio': 0.98, 'olegario': 0.98, 'policarpo': 0.98, 'remigio': 0.98, 'silvestre': 0.97,
    'timoteo': 0.98, 'urbano': 0.98, 'venancio': 0.98, 'wenceslao': 0.98, 'xulio': 0.97
};

const nombresFemeninosEspanoles = {
    // Nombres muy comunes femeninos
    'maria': 0.98, 'carmen': 0.98, 'josefa': 0.98, 'ana': 0.98, 'isabel': 0.98,
    'teresa': 0.98, 'dolores': 0.98, 'rosa': 0.98, 'pilar': 0.98, 'concepcion': 0.98,
    'mercedes': 0.98, 'esperanza': 0.98, 'angeles': 0.97, 'antonia': 0.98, 'francisca': 0.98,
    'cristina': 0.97, 'patricia': 0.97, 'elena': 0.97, 'monica': 0.97, 'beatriz': 0.97,
    'laura': 0.97, 'lucia': 0.97, 'sara': 0.96, 'paula': 0.96, 'andrea': 0.95,
    'alba': 0.96, 'nuria': 0.97, 'silvia': 0.97, 'rocio': 0.97, 'sonia': 0.97,
    'marta': 0.97, 'julia': 0.96, 'eva': 0.96, 'nerea': 0.96, 'celia': 0.96,
    'sandra': 0.97, 'diana': 0.96, 'raquel': 0.97, 'natalia': 0.96, 'miriam': 0.96,
    'virginia': 0.97, 'gloria': 0.97, 'amparo': 0.98, 'remedios': 0.98, 'soledad': 0.98,
    'inmaculada': 0.98, 'encarnacion': 0.98, 'manuela': 0.98, 'rafael': 0.02, // Rafaela es femenino
    'gabriela': 0.97, 'daniela': 0.96, 'alejandra': 0.97, 'carolina': 0.97, 'valentina': 0.96,
    'sofia': 0.96, 'claudia': 0.96, 'lorena': 0.96, 'veronica': 0.97, 'yolanda': 0.97,
    'olga': 0.97, 'natividad': 0.98, 'trinidad': 0.96, 'aurora': 0.97, 'victoria': 0.96,
    'alicia': 0.97, 'barbara': 0.96, 'catalina': 0.97, 'emilia': 0.96, 'fatima': 0.97,
    'guadalupe': 0.96, 'helena': 0.96, 'irene': 0.96, 'juana': 0.98, 'luisa': 0.98,
    'margarita': 0.98, 'noelia': 0.96, 'olivia': 0.95, 'paloma': 0.97, 'rebeca': 0.96,
    'susana': 0.97, 'tamara': 0.96, 'ursula': 0.97, 'vanesa': 0.96, 'ximena': 0.95,
    'yaiza': 0.96, 'zoe': 0.94, 'adoracion': 0.98, 'asuncion': 0.98, 'begona': 0.97,
    'casilda': 0.98, 'delfina': 0.98, 'encarna': 0.98, 'felisa': 0.98, 'genoveva': 0.98,
    'herminia': 0.98, 'indalecia': 0.98, 'jacinta': 0.98, 'leonor': 0.97, 'macarena': 0.97,
    'nieves': 0.98, 'obdulia': 0.98, 'purificacion': 0.98, 'quintina': 0.98, 'rosario': 0.97,
    'serafina': 0.98, 'teofila': 0.98, 'ubaldina': 0.98, 'visitacion': 0.98, 'walkiria': 0.96
};

// Nombres ambiguos o unisex con probabilidades
const nombresAmbiguos = {
    'alex': { masculino: 0.65, femenino: 0.35 },
    'andrea': { masculino: 0.15, femenino: 0.85 }, // En España más femenino
    'angel': { masculino: 0.85, femenino: 0.15 },  // Ángel vs Ángela
    'cruz': { masculino: 0.40, femenino: 0.60 },
    'jesus': { masculino: 0.95, femenino: 0.05 },  // Muy raramente femenino
    'trinidad': { masculino: 0.20, femenino: 0.80 },
    'guadalupe': { masculino: 0.10, femenino: 0.90 },
    'francis': { masculino: 0.70, femenino: 0.30 },
    'kim': { masculino: 0.50, femenino: 0.50 },
    'jordan': { masculino: 0.75, femenino: 0.25 },
    'morgan': { masculino: 0.60, femenino: 0.40 },
    'camille': { masculino: 0.30, femenino: 0.70 },
    'rene': { masculino: 0.70, femenino: 0.30 },
    'dominique': { masculino: 0.45, femenino: 0.55 }
};

/**
 * Determina el género de una persona basándose en su nombre usando patrones españoles
 * @param {string} nombre - El nombre de la persona
 * @returns {object} - Objeto con el género predicho y la probabilidad
 */
function determinarGeneroPersona(nombre) {
    if (!nombre || typeof nombre !== 'string') {
        return { genero: 'hombre', probabilidad: 0.50, razon: 'Sin nombre proporcionado' };
    }

    // Limpiar y normalizar el nombre
    const nombreLimpio = nombre.trim().toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
        .replace(/[^a-z\s]/g, ''); // Eliminar caracteres especiales

    if (!nombreLimpio) {
        return { genero: 'hombre', probabilidad: 0.50, razon: 'Nombre vacío después de limpieza' };
    }

    // Tomar solo el primer nombre si hay varios
    const primerNombre = nombreLimpio.split(/\s+/)[0];

    // Verificar en base de datos de nombres masculinos
    if (nombresMasculinosEspanoles[primerNombre]) {
        return {
            genero: 'hombre',
            probabilidad: nombresMasculinosEspanoles[primerNombre],
            razon: `Nombre masculino conocido en base de datos`
        };
    }

    // Verificar en base de datos de nombres femeninos
    if (nombresFemeninosEspanoles[primerNombre]) {
        return {
            genero: 'mujer',
            probabilidad: nombresFemeninosEspanoles[primerNombre],
            razon: `Nombre femenino conocido en base de datos`
        };
    }

    // Verificar nombres ambiguos
    if (nombresAmbiguos[primerNombre]) {
        const ambiguo = nombresAmbiguos[primerNombre];
        if (ambiguo.masculino > ambiguo.femenino) {
            return {
                genero: 'hombre',
                probabilidad: ambiguo.masculino,
                razon: `Nombre ambiguo con tendencia masculina`
            };
        } else {
            return {
                genero: 'mujer',
                probabilidad: ambiguo.femenino,
                razon: `Nombre ambiguo con tendencia femenina`
            };
        }
    }

    // Análisis por patrones de terminaciones (basado en investigación)
    const analisisTerminacion = analizarTerminacionNombre(primerNombre);
    
    return analisisTerminacion;
}

/**
 * Analiza las terminaciones del nombre según patrones españoles
 * @param {string} nombre - Nombre a analizar
 * @returns {object} - Resultado del análisis
 */
function analizarTerminacionNombre(nombre) {
    // Terminaciones claramente femeninas (alta probabilidad)
    if (nombre.endsWith('a') && !nombre.endsWith('ía') && nombre.length > 2) {
        // Excepciones masculinas conocidas
        const excepcionesMasculinas = ['garcia', 'persona', 'problema', 'tema', 'sistema', 'programa'];
        if (excepcionesMasculinas.includes(nombre)) {
            return { genero: 'hombre', probabilidad: 0.75, razon: 'Excepción masculina terminada en -a' };
        }
        return { genero: 'mujer', probabilidad: 0.87, razon: 'Terminación -a (patrón femenino español)' };
    }

    // Terminaciones claramente masculinas (alta probabilidad)
    if (nombre.endsWith('o') && nombre.length > 2) {
        return { genero: 'hombre', probabilidad: 0.85, razon: 'Terminación -o (patrón masculino español)' };
    }

    // Terminaciones en -e (puede ser ambiguo pero ligeramente masculino en español)
    if (nombre.endsWith('e') && nombre.length > 2) {
        return { genero: 'hombre', probabilidad: 0.62, razon: 'Terminación -e (ligeramente masculino en español)' };
    }

    // Terminaciones específicamente femeninas
    if (nombre.endsWith('ía') || nombre.endsWith('ina') || nombre.endsWith('ana') || 
        nombre.endsWith('ela') || nombre.endsWith('isa') || nombre.endsWith('osa')) {
        return { genero: 'mujer', probabilidad: 0.82, razon: 'Terminación típicamente femenina' };
    }

    // Terminaciones específicamente masculinas
    if (nombre.endsWith('án') || nombre.endsWith('ón') || nombre.endsWith('és') || 
        nombre.endsWith('el') || nombre.endsWith('ar') || nombre.endsWith('ur')) {
        return { genero: 'hombre', probabilidad: 0.78, razon: 'Terminación típicamente masculina' };
    }

    // Terminaciones en consonante (generalmente masculino en español)
    if (/[bcdfghjklmnpqrstvwxyz]$/.test(nombre)) {
        return { genero: 'hombre', probabilidad: 0.68, razon: 'Terminación consonántica (tendencia masculina)' };
    }

    // Si no podemos determinar, sesgo ligeramente masculino (estadística general)
    return { genero: 'hombre', probabilidad: 0.52, razon: 'Patrón no reconocido, sesgo estadístico' };
}

/**
 * Actualiza automáticamente el campo sexo-conductor basado en el nombre
 * @param {string} nombre - Nombre del conductor
 */
function actualizarSexoConductorAutomatico(nombre) {
    const resultado = determinarGeneroPersona(nombre);
    
    // Actualizar el campo hidden
    const campoSexo = $('input[name="sexo-conductor"]');
    if (campoSexo.length > 0) {
        campoSexo.val(resultado.genero);
        
        // Debug info (comentar en producción)
        console.log(`🔍 Detección de género para "${nombre}":`);
        console.log(`   Género: ${resultado.genero}`);
        console.log(`   Probabilidad: ${(resultado.probabilidad * 100).toFixed(1)}%`);
        console.log(`   Razón: ${resultado.razon}`);
    }

    return resultado;
}



/***
 * FUNCIONALIDAD PARA FORMULARIOS DINÁMICOS EN PANTALLA 2
 ***/

let formularioDinamicoCount = 0; // Contador para controlar los formularios dinámicos

// Función para crear formularios dinámicos basados en las respuestas
function crearFormularioDinamico(tipoFormulario, datosPersona = {}) {
    const container = document.getElementById('formularios-dinamicos-container');
    
    // Verificar si ya existe un formulario del mismo tipo y eliminarlo
    const formularioExistente = container.querySelector(`[data-tipo="${tipoFormulario}"]`);
    if (formularioExistente) {
        formularioExistente.remove();
    }
    
    formularioDinamicoCount++; // Incrementa el contador para IDs únicos
    
    const nuevoFormulario = document.createElement('div');
    nuevoFormulario.classList.add('formulario-dinamico-item', 'card-forms', 'mt-3');
    nuevoFormulario.setAttribute('id', `formulario-dinamico-${formularioDinamicoCount}`);
    nuevoFormulario.setAttribute('data-tipo', tipoFormulario);
    
    let tituloFormulario = '';
    let contenidoHTML = '';
    
    switch (tipoFormulario) {
        case 'tipo-propietario':
            tituloFormulario = `¿Qué tipo de persona es la propietaria del vehículo?`;
            contenidoHTML = `
                <div class="d-flex justify-content-center align-items-center mb-3">
                    <h6 class="text-center mb-0 pb-0 border-0">${tituloFormulario}</h6>
                </div>
                <div class="row g-3">
                    <div class="col-12">
                        <div class="d-flex justify-content-center boxi-rb flex-wrap flex-md-nowrap justify-content-center two-points-multsp m-auto">
                            <div class="radio-button-container text-start col-md-6 col-12">
                                <input type="radio" name="tipo-propietario-vehiculo" 
                                       class="form-check-input pregunta-trigger" 
                                       id="tipo-propietario-fisica-${formularioDinamicoCount}" 
                                       value="fisica" data-pregunta="tipo-propietario" required>
                                <label for="tipo-propietario-fisica-${formularioDinamicoCount}">FÍSICA</label>
                            </div>
                            <div class="radio-button-container text-start col-md-6 col-12">
                                <input type="radio" name="tipo-propietario-vehiculo" 
                                       class="form-check-input pregunta-trigger" 
                                       id="tipo-propietario-juridica-${formularioDinamicoCount}" 
                                       value="juridica" data-pregunta="tipo-propietario" required>
                                <label for="tipo-propietario-juridica-${formularioDinamicoCount}">JURÍDICA</label>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            // Deshabilitar campo oculto para que este campo real tome precedencia
            if (document.getElementById('hidden-tipo-propietario-vehiculo')) {
                document.getElementById('hidden-tipo-propietario-vehiculo').disabled = true;
            }
            break;
            
        case 'propietario-fisica':
            tituloFormulario = `Datos del propietario del vehículo`;
            contenidoHTML = `
                <div class="d-flex justify-content-center align-items-center mb-3">
                    <h6 class="text-center mb-0 pb-0 border-0">${tituloFormulario}</h6>
                </div>
                <div class="row g-3">
                    <div class="col-12 col-md-6">
                        <label for="nombre-propietario-veh-${formularioDinamicoCount}" class="form-label">Nombre</label>
                        <input type="text" class="form-control" name="nombre-propietario-veh" 
                               id="nombre-propietario-veh-${formularioDinamicoCount}" 
                               placeholder="Ejemplo: Juan" required>
                    </div>
                    <div class="col-12 col-md-6">
                        <label for="primer_apellido-propietario-veh-${formularioDinamicoCount}" class="form-label">Primer apellido</label>
                        <input type="text" class="form-control" name="primer_apellido-propietario-veh" 
                               id="primer_apellido-propietario-veh-${formularioDinamicoCount}" 
                               placeholder="Ejemplo: Díaz" required>
                    </div>
                    <div class="col-12 col-md-6">
                        <label for="segundo-apellido-propietario-veh-${formularioDinamicoCount}" class="form-label">Segundo apellido</label>
                        <input type="text" class="form-control" name="segundo-apellido-propietario-veh" 
                               id="segundo-apellido-propietario-veh-${formularioDinamicoCount}" 
                               placeholder="Ejemplo: García">
                    </div>
                    <div class="col-12 col-md-6">
                        <label for="identificador-propietario-veh-${formularioDinamicoCount}" class="form-label">Documento</label>
                        <input type="text" class="form-control identificador-vrf" name="identificador-propietario-veh" 
                               id="identificador-propietario-veh-${formularioDinamicoCount}" 
                               placeholder="Ejemplo: 12345678X" required>
                    </div>
                    <!-- Campo oculto para el tipo de documento -->
                    <input type="hidden" name="tipo-documento-propietario-veh" id="tipo-documento-propietario-veh-${formularioDinamicoCount}" value="">
                </div>
            `;
            // Deshabilitar campos ocultos para que estos campos reales tomen precedencia
            document.getElementById('hidden-identificador-propietario-veh').disabled = true;
            document.getElementById('hidden-nombre-propietario-veh').disabled = true;
            document.getElementById('hidden-tipo-documento-propietario-veh').disabled = true;
            document.getElementById('hidden-primer_apellido-propietario-veh').disabled = true;
            document.getElementById('hidden-segundo-apellido-propietario-veh').disabled = true;
            break;
            
        case 'propietario-juridica':
            tituloFormulario = `Datos del propietario (persona jurídica) del vehículo`;
            contenidoHTML = `
                <div class="d-flex justify-content-center align-items-center mb-3">
                    <h6 class="text-center mb-0 pb-0 border-0">${tituloFormulario}</h6>
                </div>
                <div class="row g-3">
                    <div class="col-12 col-md-6">
                        <label for="nombre-propietario-juridico-${formularioDinamicoCount}" class="form-label">Razón Social</label>
                        <input type="text" class="form-control" name="nombre-propietario-juridico" 
                               id="nombre-propietario-juridico-${formularioDinamicoCount}" 
                               placeholder="Ejemplo: Telefónica SA" required>
                    </div>
                    <div class="col-12 col-md-6">
                        <label for="identificador-propietario-juridico-${formularioDinamicoCount}" class="form-label">CIF</label>
                        <input type="text" class="form-control cif-vrf" name="identificador-propietario-juridico" 
                               id="identificador-propietario-juridico-${formularioDinamicoCount}" 
                               placeholder="Ejemplo: B123456789" required>
                    </div>
                </div>
            `;
            break;
            
        case 'tomador-juridica':
            tituloFormulario = `Tomador`;
            contenidoHTML = `
                <div class="d-flex justify-content-center align-items-center mb-3">
                    <h6 class="text-center mb-0 pb-0 border-0">${tituloFormulario}</h6>
                </div>
                <div class="row g-3">
                    <div class="col-12">
                        <div class="d-flex justify-content-center boxi-rb flex-wrap flex-md-nowrap justify-content-center two-points-multsp m-auto">
                            <div class="radio-button-container text-start col-md-6 col-12">
                                <input type="radio" name="tomador-es-persona-juridica-${formularioDinamicoCount}" 
                                       class="form-check-input pregunta-trigger" 
                                       id="tomador-juridica-no-${formularioDinamicoCount}" 
                                       value="no" data-pregunta="tomador-juridica" required checked>
                                <label for="tomador-juridica-no-${formularioDinamicoCount}" id="label-tomador-es-conductor">
                                    <span class="nombre-conductor-placeholder">Nombre del conductor</span>
                                </label>
                            </div>
                            <div class="radio-button-container text-start col-md-6 col-12">
                                <input type="radio" name="tomador-es-persona-juridica-${formularioDinamicoCount}" 
                                       class="form-check-input pregunta-trigger" 
                                       id="tomador-juridica-si-${formularioDinamicoCount}" 
                                       value="si" data-pregunta="tomador-juridica" required>
                                <label for="tomador-juridica-si-${formularioDinamicoCount}">P. Jurídica</label>
                            </div>

                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'datos-tomador-juridica':
            tituloFormulario = `Datos del titular jurídico de la póliza (tomador) del vehículo`;
            contenidoHTML = `
                <div class="d-flex justify-content-center align-items-center mb-3">
                    <h6 class="text-center mb-0 pb-0 border-0">${tituloFormulario}</h6>
                </div>
                <div class="row g-3">
                    <div class="col-12 col-md-6">
                        <label for="nombre-tomador-juridico-${formularioDinamicoCount}" class="form-label">Nombre</label>
                        <input type="text" class="form-control" name="nombre-tomador-juridico" 
                               id="nombre-tomador-juridico-${formularioDinamicoCount}" 
                               placeholder="Ejemplo: Telefónica SA" required>
                    </div>
                    <div class="col-12 col-md-6">
                        <label for="identificador-tomador-juridico-${formularioDinamicoCount}" class="form-label">Número de documento</label>
                        <input type="text" class="form-control cif-vrf" name="identificador-tomador-juridico" 
                               id="identificador-tomador-juridico-${formularioDinamicoCount}" 
                               placeholder="Ejemplo: B123456789" required>
                    </div>
                </div>
            `;
            // Deshabilitar campos ocultos para que estos campos reales tomen precedencia
            document.getElementById('hidden-identificador-tomador-juridico').disabled = true;
            document.getElementById('hidden-nombre-tomador-juridico').disabled = true;
            document.getElementById('hidden-tomador-es-persona-juridica').disabled = true;
            // Establecer el valor de tomador-es-persona-juridica como "SI"
            const hiddenJuridico = document.createElement('input');
            hiddenJuridico.type = 'hidden';
            hiddenJuridico.name = 'tomador-es-persona-juridica';
            hiddenJuridico.value = 'SI';
            hiddenJuridico.id = 'tomador-es-persona-juridica-' + formularioDinamicoCount;
            contenidoHTML += hiddenJuridico.outerHTML;
            break;
    }
    
    nuevoFormulario.innerHTML = contenidoHTML;
    container.appendChild(nuevoFormulario);
    
    // Agregar event listeners a los nuevos elementos
    agregarEventListenersPreguntasTrigger();
    
    // Aplicar validaciones a los nuevos campos
    agregarValidacionesCamposDinamicos();
    
    // Actualizar el nombre del conductor después de crear el formulario
    actualizarNombreConductorEnOpciones();
    
    return nuevoFormulario;
}

// Función para limpiar formularios dinámicos
function limpiarFormulariosDinamicos() {
    const container = document.getElementById('formularios-dinamicos-container');
    if (container) {
        container.innerHTML = '';
    }
    formularioDinamicoCount = 0;
}

// Función para habilitar campos ocultos cuando se eliminan formularios dinámicos
function habilitarCamposOcultos() {
    const camposOcultos = ['hidden-identificador-propietario-veh', 'hidden-nombre-propietario-veh', 'hidden-tipo-documento-propietario-veh', 'hidden-primer_apellido-propietario-veh', 'hidden-segundo-apellido-propietario-veh', 'hidden-identificador-tomador-juridico', 'hidden-nombre-tomador-juridico', 'hidden-tomador-es-persona-juridica', 'hidden-tipo-propietario-vehiculo'];
    
    camposOcultos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.disabled = false;
        }
    });
}

// Función para manejar las respuestas de las preguntas dinámicas
function manejarRespuestaPreguntaDinamica(pregunta, respuesta, elemento) {
    // Obtener datos del conductor para personalización
    const nombreConductor = document.getElementById('nombre-tomador').value;
    const apellidoConductor = document.getElementById('primer_apellido-tomador').value;
    const datosPersona = {
        nombre: nombreConductor,
        apellido: apellidoConductor
    };
    
    switch (pregunta) {
        case 'propietario':
            // Limpiar formularios existentes relacionados con el propietario
            $('[data-tipo="tipo-propietario"]').remove();
            $('[data-tipo="propietario-fisica"]').remove();
            $('[data-tipo="propietario-juridica"]').remove();
            $('[data-tipo="tomador-juridica"]').remove();
            $('[data-tipo="datos-tomador-juridica"]').remove();
            
            // Habilitar todos los campos ocultos
            habilitarCamposOcultos();
            
            if (respuesta === 'no') {
                // Crear formulario para preguntar tipo de propietario
                crearFormularioDinamico('tipo-propietario', datosPersona);
            } else {
                // Si es el conductor, no se necesita formulario de propietario
                // Habilitar campos ocultos de propietario ya que se usarán los datos del conductor
                if (document.getElementById('hidden-identificador-propietario-veh')) {
                    document.getElementById('hidden-identificador-propietario-veh').disabled = false;
                }
                if (document.getElementById('hidden-nombre-propietario-veh')) {
                    document.getElementById('hidden-nombre-propietario-veh').disabled = false;
                }
                if (document.getElementById('hidden-tipo-documento-propietario-veh')) {
                    document.getElementById('hidden-tipo-documento-propietario-veh').disabled = false;
                }
                if (document.getElementById('hidden-primer_apellido-propietario-veh')) {
                    document.getElementById('hidden-primer_apellido-propietario-veh').disabled = false;
                }
                if (document.getElementById('hidden-segundo-apellido-propietario-veh')) {
                    document.getElementById('hidden-segundo-apellido-propietario-veh').disabled = false;
                }
                // Actualizar los campos ocultos con los datos del conductor
                actualizarCamposOcultosPropietario();
                // Crear directamente la pregunta del tomador jurídica
                crearFormularioDinamico('tomador-juridica', datosPersona);
            }
            break;
            
        case 'tipo-propietario':
            // Limpiar formularios existentes de propietario
            $('[data-tipo="propietario-fisica"]').remove();
            $('[data-tipo="propietario-juridica"]').remove();
            $('[data-tipo="tomador-juridica"]').remove();
            $('[data-tipo="datos-tomador-juridica"]').remove();
            
            // Habilitar campos ocultos al cambiar de opción
            habilitarCamposOcultos();
            
            if (respuesta === 'fisica') {
                crearFormularioDinamico('propietario-fisica', datosPersona);
                // Crear también la pregunta de tomador jurídica después
                setTimeout(() => {
                    crearFormularioDinamico('tomador-juridica', datosPersona);
                }, 100);
            } else if (respuesta === 'juridica') {
                crearFormularioDinamico('propietario-juridica', datosPersona);
                // Crear también la pregunta de tomador jurídica después
                setTimeout(() => {
                    crearFormularioDinamico('tomador-juridica', datosPersona);
                }, 100);
            }
            break;
            
        case 'tomador-juridica':
            // Limpiar formulario existente de datos del tomador jurídico
            $('[data-tipo="datos-tomador-juridica"]').remove();
            
            // Siempre habilitar campos ocultos cuando se cambia la respuesta
            habilitarCamposOcultos();
            
            if (respuesta === 'si') {
                crearFormularioDinamico('datos-tomador-juridica', datosPersona);
            }
            // Si es 'no', no se crea ningún formulario adicional
            break;
    }
}

// Función para verificar si los datos básicos del conductor están completos
function verificarDatosConductorCompletos() {
    const nombre = $('#nombre-tomador').val().trim();
    const apellido = $('#primer_apellido-tomador').val().trim();
    const documento = $('#identificador-tomador').val().trim();
    
    return nombre && apellido && documento;
}

// Función para actualizar el nombre del conductor en las opciones
function actualizarNombreConductorEnOpciones() {
    const nombre = $('#nombre-tomador').val().trim();
    const apellido = $('#primer_apellido-tomador').val().trim();
    
    if (nombre && apellido) {
        const nombreCompleto = `${nombre} ${apellido}`;
        $('#label-si-propietario .nombre-conductor-placeholder').text(nombreCompleto);
        $('#label-tomador-es-conductor .nombre-conductor-placeholder').text(nombreCompleto);
    } else {
        $('#label-si-propietario .nombre-conductor-placeholder').text('Nombre del conductor');
        $('#label-tomador-es-conductor .nombre-conductor-placeholder').text('Nombre del conductor');
    }
}

// Función para habilitar/deshabilitar preguntas dinámicas
function gestionarEstadoPreguntasDinamicas() {
    const datosCompletos = verificarDatosConductorCompletos();
    
    if (datosCompletos) {
        // Habilitar preguntas dinámicas
        $('.pregunta-trigger').prop('disabled', false);
        
        // Restaurar el estado checked por defecto para "sí es conductor y propietario" y disparar el evento change
        $('#si-es-conductor-y-propietario').prop('checked', true).trigger('change');
        
        $('#preguntas-dinamicas-section').removeClass('disabled-section');
        actualizarNombreConductorEnOpciones();
    } else {
        // Deshabilitar preguntas dinámicas y limpiar selecciones
        $('.pregunta-trigger').prop('disabled', true).prop('checked', false);
        $('#preguntas-dinamicas-section').addClass('disabled-section');
        $('#formularios-dinamicos-container').empty();
        $('#label-si-propietario .nombre-conductor-placeholder').text('Nombre del conductor');
        $('#label-tomador-es-conductor .nombre-conductor-placeholder').text('Nombre del conductor');
    }
}

// Función para agregar event listeners a las preguntas trigger
function agregarEventListenersPreguntasTrigger() {
    $('.pregunta-trigger').off('change').on('change', function() {
        const pregunta = $(this).data('pregunta');
        const respuesta = $(this).val();
        
        // NO limpiar todos los formularios, solo manejar la lógica específica
        manejarRespuestaPreguntaDinamica(pregunta, respuesta, this);
    });
}

// Función para actualizar campos ocultos del propietario con datos del conductor
function actualizarCamposOcultosPropietario() {
    const nombreTomador = document.getElementById('nombre-tomador').value;
    const primerApellidoTomador = document.getElementById('primer_apellido-tomador').value;
    const segundoApellidoTomador = document.getElementById('segundo-apellido-tomador').value;
    const identificadorTomador = document.getElementById('identificador-tomador').value;
    const tipoDocumentoTomador = document.getElementById('tipo-documento-tomador').value;
    
    // Actualizar campos ocultos del propietario
    if (document.getElementById('hidden-nombre-propietario-veh')) {
        document.getElementById('hidden-nombre-propietario-veh').value = nombreTomador;
    }
    if (document.getElementById('hidden-primer_apellido-propietario-veh')) {
        document.getElementById('hidden-primer_apellido-propietario-veh').value = primerApellidoTomador;
    }
    if (document.getElementById('hidden-segundo-apellido-propietario-veh')) {
        document.getElementById('hidden-segundo-apellido-propietario-veh').value = segundoApellidoTomador;
    }
    if (document.getElementById('hidden-identificador-propietario-veh')) {
        document.getElementById('hidden-identificador-propietario-veh').value = identificadorTomador;
    }
    if (document.getElementById('hidden-tipo-documento-propietario-veh')) {
        document.getElementById('hidden-tipo-documento-propietario-veh').value = tipoDocumentoTomador;
    }
}

// Función para agregar validaciones a campos dinámicos
function agregarValidacionesCamposDinamicos() {
    // Validaciones para campos de identificador de formularios dinámicos
    $(document).off('blur', '[id^="identificador-propietario-veh-"]').on('blur', '[id^="identificador-propietario-veh-"]', function() {
        const $input = $(this);
        const val    = $.trim($input.val());
        const id     = this.id;
        const hiddenId = id.replace('identificador-', 'tipo-documento-');
        const $hiddenTipo = $(`#${hiddenId}`);

        // Limpiar posible error anterior
        $input.removeClass('error').attr('aria-invalid', 'false');
        $(`#${id}-error`).remove();

        if (!val) {
            $hiddenTipo.val('');
            return;
        }

        if (validarNIFspda(val)) {
            $hiddenTipo.val('NIF'); // NIF
        } else if (validarNIEspda(val)) {
            $hiddenTipo.val('NIE'); // NIE
        } else if (validarCIFspda(val)) {
            $input
                .addClass('error')
                .attr('aria-invalid', 'true');
            $(`<label id="${id}-error" class="error" for="${id}">CIF detectado. Para propietario físico solo se permiten NIF/NIE.</label>`)
                .insertAfter($input);
            $hiddenTipo.val('');
            return;
        } else {
            $input
                .addClass('error')
                .attr('aria-invalid', 'true');
            $(`<label id="${id}-error" class="error" for="${id}">Introduce un documento válido (NIF/NIE).</label>`)
                .insertAfter($input);
            $hiddenTipo.val('');
        }
    });

    // Validaciones para campos CIF de formularios dinámicos
    $(document).off('blur', '[id^="identificador-propietario-juridico-"], [id^="identificador-tomador-juridico-"]').on('blur', '[id^="identificador-propietario-juridico-"], [id^="identificador-tomador-juridico-"]', function() {
        const $input = $(this);
        const val    = $.trim($input.val());
        const id     = this.id;

        // Limpiar posible error anterior
        $input.removeClass('error').attr('aria-invalid', 'false');
        $(`#${id}-error`).remove();

        if (!val) {
            return;
        }

        if (validarCIFspda(val)) {
            // CIF válido - no hacemos nada más, el campo es correcto
        } else {
            // CIF NO válido → mostrar error
            $input
                .addClass('error')
                .attr('aria-invalid', 'true');
            $(`<label id="${id}-error" class="error" for="${id}">Introduce un CIF válido.</label>`)
                .insertAfter($input);
        }
    });
}




