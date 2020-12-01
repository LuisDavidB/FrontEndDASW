// headers es un objeto: {'x-auth': 'valor', 'x-token-user': 'valor2'}
function makeRequest(url, method, data, headers, cbOk, cbErr) {

    // 1. Crear XMLHttpRequest object    
    let xhr = new XMLHttpRequest();

    // 2. Configurar petición  
    xhr.open(method, url);

    xhr.setRequestHeader('Content-Type', 'application/json');
    for(let key in headers) {
        xhr.setRequestHeader(key, headers[key]);
    }

// 4. Enviar solicitud    
if(data) {
    xhr.send(JSON.stringify(data));
}
else {
    xhr.send();
}

    // 5. Una vez recibida la respuesta del servidor    
    xhr.onload = function () {
        if (xhr.status != 200 && xhr.status != 201 && xhr.status!=202) { // analizar el estatus de la respuesta HTTP
            let err=xhr.response
            // Ocurrió un error
            console.log(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
            // ejecutar algo si error
            cbErr(err);

        } if(xhr.response!="" && (xhr.status==200 || xhr.status==201)) {
                datos = JSON.parse(xhr.response);
            // Ejecutar algo si todo está correcto
            console.log(datos); // Significa que fue exitoso
            cbOk(datos);
        }if (xhr.response=="" && (xhr.status==200 || xhr.status==201)) {
            cbOk();
        }if (xhr.status==202){
            datos=xhr.response;
            cbOk(datos);
        }
    };
}