function armarPeticionAjax(formData, resolve, reject){
    $.ajax({
        url: miAjax.ajaxurl, // WordPress AJAX handler URL
        type: 'POST',
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.success) {
                resolve(response.data.respuesta);
            } else {
                reject(response.data.errores);
            }        
        },
        error: function (xhr, status, error) {
            reject([`Error ${xhr.status}: ${xhr.responseText}`]);
        }
    });
}

function crearFormularioAjax(action, data = {}){
    try {
        //Obtengo datos del form
        let formData = new FormData();
        //seteo accion de wordpress
        formData.append("action", action);

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
            }
        }
        return formData;
    } catch  {
        return null;
    }

}