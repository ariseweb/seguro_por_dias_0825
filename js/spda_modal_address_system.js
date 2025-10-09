/**
 * Sistema de Dirección Modal para Seguro Por Días API
 * Implementa un modal de dirección usando SweetAlert2 y Mapbox Search JS
 * Version: 1.0
 */

(function($) {
    'use strict';

    // Variables globales
    let mapboxSearchInstance = null;
    let selectedAddressData = null;

    /**
     * Inicializar el sistema de modal de dirección
     */
    function initAddressModalSystem() {
        console.log('Inicializando sistema de modal de dirección...');
        
        // Configurar el botón "Añadir dirección"
        setupAddAddressButton();
    }

    /**
     * Configurar el botón "Añadir dirección"
     */
    function setupAddAddressButton() {
        $(document).on('click', '#btn_anadir_direccion', function(e) {
            e.preventDefault();
            console.log('Botón "Añadir dirección" clicado');
            showAddressModal();
        });
    }

    /**
     * Mostrar el modal de dirección (Imagen 2)
     */
    function showAddressModal() {
        Swal.fire({
            title: 'Ingresa tu dirección',
            html: `
                <div class="address-modal-content">
                    <div class="mb-2">
                        <label class="form-label text-start d-block">Buscar dirección</label>
                        <input type="text" id="modal_address_search" class="form-control" placeholder="Escribe tu dirección incluyendo el número de la calle">
                    </div>
                    
                    <div class="row g-3 mt-3">
                        <div class="col-12 mt-0">
                            <label class="form-label text-start d-block">Piso/Puerta</label>
                            <input type="text" id="modal_floor_door" class="form-control" placeholder="Ej: 3º A">
                        </div>
                    </div>
                    
                    <div class="mt-4 text-center">
                        <a href="#" id="no_encuentro_direccion" class="text-decoration-none">
                            <i class="fas fa-question-circle me-1"></i>
                            No encuentro la dirección
                        </a>
                    </div>
                </div>
            `,
            width: 500,
            imageUrl: '/wp-content/plugins/seguro-por-dias-api/img/South Diration.svg',
            imageWidth: 80,
            imageAlt: 'Ilustración de dirección',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#6c757d',
            allowOutsideClick: false,
            didOpen: () => {
                // Inicializar Mapbox Search en el modal
                initMapboxSearchInModal();
                
                // Configurar el enlace "No encuentro la dirección"
                $(document).on('click', '#no_encuentro_direccion', function(e) {
                    e.preventDefault();
                    showManualAddressForm();
                });
            },
            preConfirm: () => {
                const addressSearch = document.getElementById('modal_address_search').value;
                const floorDoor = document.getElementById('modal_floor_door').value;
                
                if (!addressSearch.trim()) {
                    Swal.showValidationMessage('Por favor, selecciona una dirección');
                    return false;
                }
                
                if (!selectedAddressData) {
                    Swal.showValidationMessage('Por favor, selecciona una dirección válida de la lista');
                    return false;
                }

                //si el addressSearch no contiene un número de casa, mostrar mensaje de error obligando al usuario a ingresarlo
                if (!/\d+/.test(mapboxSearchInstance.value)) {
                    Swal.showValidationMessage('Por favor, ingresa un número de casa en la dirección');
                    return false;
                }

                return {
                    addressData: selectedAddressData,
                    floorDoor: floorDoor
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('Dirección confirmada:', result.value);
                // Mostrar formulario pre-rellenado para edición
                showPrefilledAddressForm(result.value);
            }
        });
    }

    /**
     * Inicializar Mapbox Search dentro del modal
     */
    function initMapboxSearchInModal() {
        const searchInput = document.getElementById('modal_address_search');
        if (!searchInput || !window.MapboxSearchBox) {
            console.error('MapboxSearchBox no está disponible o elemento no encontrado');
            return;
        }

        try {
            // Limpiar instancia anterior si existe
            if (mapboxSearchInstance) {
                try {
                    mapboxSearchInstance.remove();
                } catch (e) {
                    console.log('Error al limpiar instancia anterior:', e);
                }
                mapboxSearchInstance = null;
            }

            // Limpiar cualquier elemento de Mapbox anterior que pueda existir
            const existingMapboxElements = searchInput.parentNode.querySelectorAll('mapbox-search-box');
            existingMapboxElements.forEach(el => el.remove());

            // Crear instancia de Mapbox Search
            const search = new MapboxSearchBox();
            search.accessToken = 'pk.eyJ1IjoiYXJpc2V3ZWIiLCJhIjoiY21nOXFnamEwMGw3ZTJrcXdpaDk3c28xayJ9.m3hzygl6Wob34BLyr5awiQ';
            search.options = {
                language: 'es',
                country: 'ES',
                types: 'address,street',
                limit: 5
            };
            search.placeholder = 'Empieza a escribir tu dirección...';
            
            // Configurar tema personalizado
            search.theme = {
                variables: {
                    fontFamily: 'inherit',
                    fontWeight: '400',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    borderRadius: '0.375rem',
                    colorPrimary: '#0d6efd',
                    colorSecondary: '#6c757d',
                    colorText: '#212529',
                    colorTextSecondary: '#6c757d',
                    colorBackground: '#ffffff',
                    colorBackgroundHover: '#f8f9fa',
                    colorBorder: '#ced4da',
                    colorBorderHover: '#0d6efd',
                    boxShadow: 'none',
                    spacing: '0.5rem 0.75rem'
                },
                icons: {
                    search: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                            <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                              <rect width="18" height="18" fill="transparent" opacity="0"/>
                            </svg>`,
                },
                cssText: `
                    /* Eliminar box-shadow del contenedor principal */
                    mapbox-search-box {
                        box-shadow: none !important;
                    }
                    
                    /* Estilos del input */
                    .Input {
                        padding: 12px 17px 8px !important;
                        border-radius: 13px !important;
                        height: auto !important;
                        color: var(--color-b) !important;
                        position: relative;
                        font-size: 1rem;
                        font-weight: 400;
                        line-height: 1.5;
                        border: 1px solid #ced4da;
                        box-shadow: none !important;
                    }
                    
                    .Input:focus,
                    .Input:active {
                        background-color: #fff;
                        border: 1px solid var(--color-c) !important;
                        outline: 0;
                        box-shadow: 0 0 0 0.25rem rgb(49 203 168 / 20%) !important;
                    }
                    
                    /* Estilos del dropdown de resultados */
                    .Results {
                        z-index: 99999 !important;
                        position: absolute !important;
                        text-align: left !important;
                        margin-top: 4px !important;
                    }
                    
                    /* Estilos de los items del dropdown */
                    .Result {
                        text-align: left !important;
                        padding: 12px 16px !important;
                        cursor: pointer !important;
                    }
                    
                    .Result:hover {
                        background-color: #f8f9fa !important;
                    }
                    
                    /* Título de cada dirección */
                    .Result-title {
                        text-align: left !important;
                        font-weight: 500 !important;
                        color: #212529 !important;
                    }
                    
                    /* Descripción/dirección completa */
                    .Result-description {
                        text-align: left !important;
                        font-size: 0.875rem !important;
                        color: #6c757d !important;
                        margin-top: 4px !important;
                    }
                `
            };
            
            // Insertar el componente de búsqueda
            searchInput.parentNode.insertBefore(search, searchInput.nextSibling);
            searchInput.style.display = 'none';

            // Manejar la selección de dirección
            search.addEventListener('retrieve', (event) => {
                console.log('Dirección seleccionada:', event.detail);
                const feature = event.detail.features[0];
                
                if (feature) {
                    selectedAddressData = parseMapboxFeature(feature);
                    console.log('Datos parseados:', selectedAddressData);
                    
                    // Actualizar el campo visible (aunque esté oculto)
                    searchInput.value = selectedAddressData.fullAddress;
                }
            });

            mapboxSearchInstance = search;
            
        } catch (error) {
            console.error('Error inicializando Mapbox Search en modal:', error);
            // Fallback: mantener el input normal
            searchInput.style.display = 'block';
        }
    }

    /**
     * Parsear la respuesta de Mapbox en datos estructurados
     */
    function parseMapboxFeature(feature) {
        const properties = feature.properties;
        const context = properties.context || {};
        
        // Parsear la dirección principal
        const fullAddress = properties.full_address || properties.name || '';
        const addressParts = parseSpanishAddress(fullAddress);
        
        // Extraer el número de la dirección desde el contexto
        const addressNumber = context.address?.address_number || '';
        
        // Extraer el nombre de la calle desde el contexto o parsearlo
        const streetName = context.address?.street_name || context.street?.name || addressParts.streetName || properties.name || '';
        
        //Eliminamos la palabra provincia de del state si es que existe
        let stateName = context.region?.name || '';
        stateName = stateName.replace(/\bprovincia de \b/i, '').trim();

        return {
            fullAddress: fullAddress,
            streetName: streetName,
            streetType: addressParts.streetType || '',
            addressNumber: addressNumber,
            city: context.place?.name || '',
            state: stateName,
            postalCode: context.postcode?.name || '',
            coordinates: feature.geometry.coordinates
        };
    }

    /**
     * Parsear direcciones españolas
     */
    function parseSpanishAddress(address) {
        const streetTypes = [
            'Alameda', 'Apartamento', 'Avenida', 'Bajada', 'Bloque', 'Barrio', 'Barranco',
            'Chalet', 'Callejón', 'Calle', 'Camino', 'Colonia', 'Carretera', 'Casas',
            'Cuesta', 'Diseminado', 'Edificio', 'Glorieta', 'Grupo', 'Lugar', 'Mercado',
            'Poblado', 'Partida', 'Polígono', 'Poligono', 'Pasaje', 'Prolongación', 
            'Prolongacion', 'Paseo', 'Plaza', 'Rambla', 'Ronda', 'Subida', 'Senda',
            'Torrente', 'Travesía', 'Travesia', 'Urbanización', 'Urbanizacion',
            // Abreviaturas comunes
            'C/', 'Av.', 'Avda.', 'Pl.', 'P.', 'Ctra.', 'Trav.', 'Rda.', 'Urb.', 'Prol.'
        ];
        
        let streetType = '';
        let streetName = address;
        
        for (const type of streetTypes) {
            const regex = new RegExp(`^${type}\\s+`, 'i');


            if (regex.test(address)) {
                streetType = type;
                streetName = address.replace(regex, '').trim();
                break;
            }

             //Si no coincide con un street name colocamos Calle por defecto
            if (streetType === '' ) {
                streetType = 'Calle';
            }
        }
        
        // Limpiar números del final
        streetName = streetName.replace(/,?\s*\d+.*$/, '').trim();
        
        return {
            streetType: streetType,
            streetName: streetName
        };
    }

    /**
     * Mostrar formulario pre-rellenado con datos de Mapbox
     */
    function showPrefilledAddressForm(data) {
        const { addressData, streetNumber, floorDoor } = data;
        
        Swal.fire({
            title: 'Confirmar y editar dirección',
            html: `
                <div class="manual-address-form">
                    <div class="row g-3 mb-4">
                        <div class="col-12">
                            <input type="hidden" id="prefilled_street_type" class="form-control" value="${addressData.streetType || ''}" readonly>
                        </div>
                        <div class="col-12">
                            <label class="form-label text-start d-block">Nombre de la vía</label>
                            <input type="text" id="prefilled_street_name" class="form-control" placeholder="Ej: Gran Vía" value="${addressData.streetName || ''}">
                        </div>
                        <div class="col-6">
                            <label class="form-label text-start d-block">Número</label>
                            <input type="text" id="prefilled_street_number" class="form-control" placeholder="Ej: 123" value="${addressData.addressNumber || streetNumber || ''}">
                        </div>
                        <div class="col-6">
                            <label class="form-label text-start d-block">Piso/Puerta</label>
                            <input type="text" id="prefilled_floor_door" class="form-control" placeholder="Ej: 3º A" value="${floorDoor || ''}">
                        </div>
                        <div class="col-12">
                            <label class="form-label text-start d-block">Población</label>
                            <input type="text" id="prefilled_city" class="form-control" placeholder="Ej: Madrid" value="${addressData.city || ''}">
                        </div>
                        <div class="col-6">
                            <label class="form-label text-start d-block">Provincia</label>
                            <input type="text" id="prefilled_state" class="form-control" placeholder="Ej: Madrid" value="${addressData.state || ''}">
                        </div>
                        <div class="col-6">
                            <label class="form-label text-start d-block">Código Postal</label>
                            <input type="text" id="prefilled_postal_code" class="form-control" placeholder="Ej: 28001" value="${addressData.postalCode || ''}">
                        </div>
                    </div>
                </div>
            `,
            width: 500,
            showCancelButton: true,
            confirmButtonText: 'Confirmar dirección',
            cancelButtonText: 'Volver',
            confirmButtonColor: '#198754',
            cancelButtonColor: '#6c757d',
            didOpen: () => {
                // Inicializar Select2 para el tipo de vía
                initSelect2ForAddressModal();
            },
            preConfirm: () => {
                const streetType = document.getElementById('prefilled_street_type').value;
                const streetName = document.getElementById('prefilled_street_name').value;
                const streetNumber = document.getElementById('prefilled_street_number').value;
                const floorDoor = document.getElementById('prefilled_floor_door').value;
                const city = document.getElementById('prefilled_city').value;
                const state = document.getElementById('prefilled_state').value;
                const postalCode = document.getElementById('prefilled_postal_code').value;
                
                if (!streetType.trim()) {
                    Swal.showValidationMessage('Por favor, selecciona un tipo de vía');
                    return false;
                }
                
                if (!streetName.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
                    Swal.showValidationMessage('Por favor, completa todos los campos obligatorios');
                    return false;
                }
                
                const fullAddress = `${streetType} ${streetName}${streetNumber ? ', ' + streetNumber : ''}${floorDoor ? ', ' + floorDoor : ''}, ${city}, ${state}`;
                
                return {
                    addressData: {
                        fullAddress: fullAddress,
                        streetName: streetName,
                        streetType: streetType,
                        city: city,
                        state: state,
                        postalCode: postalCode,
                        addressNumber: streetNumber
                    },
                    streetNumber: streetNumber,
                    floorDoor: floorDoor
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Guardar dirección directamente en el formulario
                saveAddressToForm(result.value, result.value.addressData.fullAddress);
                
                Swal.fire({
                    icon: 'success',
                    title: '¡Dirección guardada!',
                    text: 'La dirección se ha añadido correctamente al formulario.',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Volver al modal de direcciones
                showAddressModal();
            }
        });
    }



    /**
     * Mostrar formulario manual de dirección
     */
    function showManualAddressForm() {
        Swal.fire({
            title: 'Introducir dirección manualmente',
            html: `
                <div class="manual-address-form">
                    <div class="row g-3">
                        <div class="col-12">
                            <input type="hidden" id="manual_street_type" class="form-control" value="Calle" readonly>
                        </div>
                        <div class="col-12">
                            <label class="form-label text-start d-block">Nombre de la vía</label>
                            <input type="text" id="manual_street_name" class="form-control" placeholder="Ej: Gran Vía">
                        </div>
                        <div class="col-6">
                            <label class="form-label text-start d-block">Número</label>
                            <input type="text" id="manual_street_number" class="form-control" placeholder="Ej: 123">
                        </div>
                        <div class="col-6">
                            <label class="form-label text-start d-block">Piso/Puerta</label>
                            <input type="text" id="manual_floor_door" class="form-control" placeholder="Ej: 3º A">
                        </div>
                        <div class="col-12">
                            <label class="form-label text-start d-block">Población</label>
                            <input type="text" id="manual_city" class="form-control" placeholder="Ej: Madrid">
                        </div>
                        <div class="col-6">
                            <label class="form-label text-start d-block">Provincia</label>
                            <input type="text" id="manual_state" class="form-control" placeholder="Ej: Madrid">
                        </div>
                        <div class="col-6">
                            <label class="form-label text-start d-block">Código Postal</label>
                            <input type="text" id="manual_postal_code" class="form-control" placeholder="Ej: 28001">
                        </div>
                    </div>
                </div>
            `,
            width: 500,
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Volver',
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#6c757d',
            didOpen: () => {
                // Inicializar Select2 para el tipo de vía
                initSelect2ForAddressModal();
            },
            preConfirm: () => {
                const streetType = document.getElementById('manual_street_type').value;
                const streetName = document.getElementById('manual_street_name').value;
                const streetNumber = document.getElementById('manual_street_number').value;
                const floorDoor = document.getElementById('manual_floor_door').value;
                const city = document.getElementById('manual_city').value;
                const state = document.getElementById('manual_state').value;
                const postalCode = document.getElementById('manual_postal_code').value;
                
                if (!streetType.trim()) {
                    Swal.showValidationMessage('Por favor, selecciona un tipo de vía');
                    return false;
                }
                
                if (!streetName.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
                    Swal.showValidationMessage('Por favor, completa todos los campos obligatorios');
                    return false;
                }
                
                const fullAddress = `${streetType} ${streetName}${streetNumber ? ', ' + streetNumber : ''}${floorDoor ? ', ' + floorDoor : ''}, ${city}, ${state}`;
                
                return {
                    addressData: {
                        fullAddress: fullAddress,
                        streetName: streetName,
                        streetType: streetType,
                        city: city,
                        state: state,
                        postalCode: postalCode
                    },
                    streetNumber: streetNumber,
                    floorDoor: floorDoor
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Guardar dirección directamente en el formulario
                saveAddressToForm(result.value, result.value.addressData.fullAddress);
                
                Swal.fire({
                    icon: 'success',
                    title: '¡Dirección guardada!',
                    text: 'La dirección se ha añadido correctamente al formulario.',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Volver al modal anterior
                showAddressModal();
            }
        });
    }



    /**
     * Guardar la dirección en el formulario
     */
    function saveAddressToForm(data, displayAddress) {
        const { addressData, streetNumber, floorDoor } = data;
        
        // Actualizar el campo de dirección completa (readonly)
        $('#direccion_completa_display').val(displayAddress);
        
        // Actualizar los campos ocultos con el mapeo correcto
        $('#tipo_via').val(addressData.streetType || '');
        $('#nombre_via').val(addressData.streetName || '');
        $('#numero_via').val(streetNumber || '');
        $('#codigo_postal').val(addressData.postalCode || '');
        $('#provincia').val(addressData.state || '');
        $('#poblacion').val(addressData.city || '');
        
        // Guardar el piso/puerta agregándolo al número si existe
        if (floorDoor) {
            const currentNumber = $('#numero_via').val();
            $('#numero_via').val(currentNumber + (currentNumber ? ', ' : '') + floorDoor);
        }
        
        // Validar los campos de dirección para eliminar errores
        if (typeof $.validator !== 'undefined') {
            // Validar específicamente el campo tipo_via que tiene la validación direccionRequerida
            $('#tipo_via').valid();
            
            // Remover manualmente cualquier error que pudiera quedar debajo del botón
            $('#btn_anadir_direccion').parent().find('label.error').remove();
        }
        
        // Mostrar campos individuales como readonly para que el usuario vea los datos
        showIndividualAddressFields(addressData, streetNumber, floorDoor);
        
        console.log('Dirección guardada en el formulario:', {
            tipo_via: addressData.streetType,
            nombre_via: addressData.streetName,
            numero_via: streetNumber + (floorDoor ? ', ' + floorDoor : ''),
            codigo_postal: addressData.postalCode,
            provincia: addressData.state,
            poblacion: addressData.city
        });
    }

    /**
     * Mostrar campos individuales de dirección como readonly
     */
    function showIndividualAddressFields(addressData, streetNumber, floorDoor) {
        // Buscar el contenedor de la dirección y añadir campos individuales
        const addressContainer = $('#direccion_completa_display').closest('.col-12');
        
        //Buscar contenedor del boton btn_anadir_direccion
        const addButtonContainer = $('#btn_anadir_direccion').parent();

        // Remover campos anteriores si existen
        addressContainer.find('.card').remove();
        
        // Crear HTML para campos individuales
        const fieldsHtml = `
            <div class="card mt-3 border-rounded-13px">
                <div class="card-header bg-light border-rounded-13px">
                    <h6 class="mb-0"><i class="fas fa-map-marker-alt me-2"></i>Datos de la dirección</h6>
                </div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-12 col-md-6">
                            <label class="form-label">Tipo de vía</label>
                            <input name="tipo_via" type="text" class="form-control insulead-direccion" value="${addressData.streetType || 'Sin especificar'}" readonly>
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="form-label">Nombre de la vía</label>
                            <input name="nombre_via" type="text" class="form-control insulead-direccion" value="${addressData.streetName || 'N/A'}" readonly>
                        </div>
                        <div class="col-12 col-md-4">
                            <label class="form-label">Número</label>
                            <input name="numero_via" type="text" class="form-control insulead-direccion" value="${streetNumber || 'N/A'}" readonly>
                        </div>
                        <div class="col-12 col-md-4">
                            <label class="form-label">Piso/Puerta</label>
                            <input name="piso_puerta" type="text" class="form-control insulead-direccion" value="${floorDoor || 'N/A'}" readonly>
                        </div>
                        <div class="col-12 col-md-4">
                            <label class="form-label">Código Postal</label>
                            <input name="codigo_postal" type="text" class="form-control codigo_postal_vrf insulead-codigo-postal" value="${addressData.postalCode || 'N/A'}" readonly>
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="form-label">Población</label>
                            <input name="poblacion" type="text" class="form-control poblacion-vrf insulead-poblacion" value="${addressData.city || 'N/A'}" readonly>
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="form-label">Provincia</label>
                            <input name="provincia" type="text" class="form-control provincia_vrf insulead-provincia" value="${addressData.state || 'N/A'}" readonly>
                        </div>
                    </div>
                    <div class="mt-3 text-center">
                        <button type="button" class="btn btn-outline-primary btn-sm" id="btn_editar_direccion">
                            <i class="fas fa-edit me-1"></i>Editar dirección
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Añadir los campos al contenedor
        addressContainer.append(fieldsHtml);

        //Quitamos clase d-none a container para que se vea
        addressContainer.removeClass('d-none');

        //Ocultar el botón de añadir dirección
        addButtonContainer.addClass('d-none');

        // Configurar botón de editar
        $(document).on('click', '#btn_editar_direccion', function(e) {
            e.preventDefault();
            showAddressModal();
        });
    }


    /**
     * Inicializar Select2 para los modales de dirección
     */
    function initSelect2ForAddressModal() {
        setTimeout(() => {
            if (typeof $.fn.select2 !== 'undefined') {
                $('.select2-tipo-via').select2({
                    dropdownParent: $('.swal2-popup'),
                    placeholder: 'Seleccionar tipo de vía...',
                    allowClear: false,
                    width: '100%',
                    minimumResultsForSearch: Infinity // Deshabilitar búsqueda
                });
            } else {
                console.warn('Select2 no está disponible, usando select estándar');
            }
        }, 100);
    }

    /**
     * Validar que se haya seleccionado una dirección antes de enviar el formulario
     */
    function setupFormValidation() {
        // Interceptar envío del formulario principal
        $('form').on('submit', function(e) {
            const direccionCompleta = $('#direccion_completa_display').val();
            const tipoVia = $('#tipo_via').val();
            const nombreVia = $('#nombre_via').val();
            const codigoPostal = $('#codigo_postal').val();
            
            // Verificar si hay datos de dirección
            if (!direccionCompleta.trim() || 
                direccionCompleta === 'Haz clic en \'Añadir dirección\' para completar' ||
                !tipoVia.trim() || !nombreVia.trim() || !codigoPostal.trim()) {
                
                e.preventDefault();
                
                Swal.fire({
                    icon: 'warning',
                    title: 'Dirección requerida',
                    text: 'Por favor, añade una dirección antes de continuar.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#0d6efd'
                }).then(() => {
                    // Scroll a la sección de dirección
                    $('#direccion_completa_display')[0].scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                });
                
                return false;
            }
        });
    }

    // Inicializar cuando el DOM esté listo
    $(document).ready(function() {
        console.log('DOM listo, inicializando sistema de modal de dirección...');
        initAddressModalSystem();
        setupFormValidation();
    });

})(jQuery);