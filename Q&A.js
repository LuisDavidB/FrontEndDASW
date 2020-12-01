
obtenerPreguntas();
function obtenerPreguntas() {
    makeRequest('https://daswpi.herokuapp.com/api/preguntas', 'GET', null, {'x-auth-user': localStorage.tokenUser}, 
    (value) => {
        console.log('Ok');
        console.log(value);
        mostrarPreguntas(value);
    }, (err) => {
        console.log('Error');
        console.log(err);
    });
}

function mostrarPreguntas(preguntas){
    let lista = document.getElementById("preguntas");
    lista.innerHTML = "";
    for (let i=0;i<preguntas.length;i++) {
        if (preguntas[i]!=undefined){
        lista.innerHTML += `<p>${i+1}.- ${preguntas[i].pregunta} <a href="#"onclick="Aparecer(${i})" class="alternar-respuesta fa fa-arrow-down"></a>
        <a href="#"onclick="Desaparecer(${i})" class="alternar-respuesta fa fa-arrow-up"></a>
        <a href="#"onclick="editQuestion('${preguntas[i]._id},${preguntas[i].pregunta},${preguntas[i].respuesta}')" class="alternar-respuesta fa fa-pencil" id="IconoEditar${i}"></a>
        <a href="#"onclick="EliminarPregunta('${preguntas[i]._id}')" class="alternar-respuesta fa fa-trash" id="IconoEliminar${i}"></a></p>
        <p class="respuesta"style="display:none" id=pregunta${i}>${preguntas[i].respuesta}</p>`;
        }
        if (localStorage.tokenUser===undefined){
            document.getElementById(`IconoEditar${i}`).style.display='none';
            document.getElementById(`IconoEliminar${i}`).style.display='none';
            document.getElementById("Administrador").style.display='none';
            document.getElementById("Pregunta").style.display='none';
            
        }else{
            document.getElementById(`IconoEditar${i}`).removeAttribute('style');
            document.getElementById(`IconoEliminar${i}`).removeAttribute('style');
            document.getElementById("Administrador").removeAttribute('style');
            document.getElementById("Pregunta").removeAttribute('style');
        }
    }
}
function Aparecer(i){
    document.getElementById(`pregunta${i}`).removeAttribute('style');
}
function Desaparecer(i){
    document.getElementById(`pregunta${i}`).style="display:none";
}


document.getElementById("BtnCrear").addEventListener("click", function(event){
    event.preventDefault();
    let newQuestion = {
        "pregunta": document.getElementById("CrearPregunta").value,
        "respuesta": document.getElementById("CrearRespuesta").value,
    };
    RegistrarPregunta(newQuestion);
  });

function RegistrarPregunta(pregunta){
    makeRequest('https://daswpi.herokuapp.com/api/preguntas', 'POST',pregunta,{'x-auth-user': localStorage.tokenUser},
    (Ok) => {
        alert("Pregunta Registrada");
        window.location.href='Q&A.html'
    }, (err) => {
        console.log(err);
    });
}
function EditarPregunta(id){
    event.preventDefault();
    let newQuestion = {
        "pregunta": document.getElementById("EditPregunta").value,
        "respuesta": document.getElementById("EditRespuesta").value,
    };
    ReqEditarPregunta(newQuestion,id);
}

function editQuestion(preguntas){
    let datos=preguntas.split(",");
    let _id= datos[0];
    let pregunta=datos[1];
    let respuesta= datos[2];
    let modal =`        <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Editar Pregunta</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form>
      <div class="modal-body">
              <div class="form-group">
                <label for="EditPregunta">Pregunta</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">
                          <div class="fa fa-question"></div> 
                      </div>
                    </div>
                  <textarea  type="text" class="form-control" id="EditPregunta"  required>${pregunta}</textarea>
                </div>
              </div>
              <div class="form-group">
                <label for="EditRespuesta">Respuesta</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                        <div class="fa fa-bars"></div> 
                    </div>
                  </div>
                  <textarea  type="text" class="form-control" id="EditRespuesta" required>${respuesta}</textarea>
                </div>
              </div>     
      </div>
      <div class="modal-footer">
          <div class="d-flex flex-column">
              <div class="p-2"> 
                  <div class=w-100>
                      <div class="d-flex justify-content-end">
                          <button type="button" class="btn btn-secondary" id="BtnCanEditar" data-dismiss="modal">Cancelar</button>
                          <button type="submit" class="btn btn-primary" onclick=EditarPregunta('${_id}') id="BtnEditarPregunta">Editar</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      </form>
     </div>
    </div>`
     document.getElementById('ModalEditarPregunta').innerHTML=modal;
     $('#ModalEditarPregunta').modal('show')
}
function ReqEditarPregunta(pregunta,id){
    makeRequest(`https://daswpi.herokuapp.com/api/preguntas/${id}`, 'PUT', pregunta, {'x-auth-user': localStorage.tokenUser}, 
    (value) => {
        console.log(value);
        window.location.href='Q&A.html'
    }, (err) => {
        console.log('Error');
        console.log(err);
    });
}
function EliminarPregunta(id){
    makeRequest(`https://daswpi.herokuapp.com/api/preguntas/${id}`, 'DELETE', null, {'x-auth-user': localStorage.tokenUser}, 
    (value) => {
        console.log(value);
        window.location.href='Q&A.html'
    }, (err) => {
        console.log('Error');
        console.log(err);
    });
}