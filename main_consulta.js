// Funcion para obtener todos los usuarios
obtenerUsuarios();
ChecarLoggin();
function obtenerUsuarios() {
    makeRequest('https://daswpi.herokuapp.com/api/users', 'GET', null, {'x-auth-user': localStorage.tokenUser}, 
    (value) => {
        console.log('Ok');
        console.log(value);
        mostrarUsuarios(value);
    }, (err) => {
        console.log('Error');
        console.log(err);
    });
}

function ChecarLoggin(){
    if (localStorage.tokenUser===undefined){
        document.getElementById("CrearUsuario").style.display='none';
    }else{
        document.getElementById("CrearUsuario").removeAttribute('style');
    }
}

//Funcion que invoca el card y obtiene los datos completos de cada usuario
function mostrarUsuarios(users){
    let usuariosprube=[];
    users.forEach(user => {
        makeRequest(`https://daswpi.herokuapp.com/api/users/${user.correo}`, 'GET', null, {'x-auth-user': localStorage.tokenUser},
        (value)=>{
            usuariosprube.push(value);
            paginado(usuariosprube);
        },(err)=>{
            console.log('Error');
            console.log(err);
        });
    });
}

//Funcion para precargar los datos y modal para editar
function editUser(user){
    let datos=user.split(",/$");
    let nombre= datos[0];
    let apellido=datos[1];
    let correo= datos[2];
    let fecha = datos[3];
    let sexo = datos[4];
    let url=datos[5];
    let modal =`<div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Editar cuenta</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form  oninput='up2.setCustomValidity(up2.value != up.value ? "Las contraseñas no coinciden" : "")'>
          
      <div class="modal-body">
          <div class="form-row">
              <div class="col-md-6 mb-3">
                  <input type="text" class="form-control" id="NombreEdit" value="${nombre}"required minlength="2" maxlength="15">
              </div>
              <div class="col-md-6 mb-3">
                  <input type="text" class="form-control" id="ApellidosEdit" value="${apellido}"required minlength="2" maxlength="20">
              </div>
          </div>
          <div class="mb-3">
              <input type="email" class="form-control" id="EmailEdit" value="${correo}"required disabled>
          </div>
          <div class="mb-3">
              <input type="password" class="form-control" id="passwordEdit" placeholder="Contraseña"required name=upE>
          </div>
          <div class="mb-3">
              <input type="password" class="form-control" id="password2Edit" placeholder="Confirmar contraseña"required name=upE2>
          </div>
          <div class="mb-3">
              <input type="date" class="form-control" id="FechaEdit" value="${fecha}" min="1950-01-01" max="2050-12-31" required>
          </div>
          <div class="radioB mt-3 border">
            <div class="form-check">
                <label class="form-check-label ml-3">
                    <input type="radio" class="form-check-input sexoF" name="sexo" id="SexoMEdit" value="M" disabled>
                    Mujer
                </label>
            </div>
            <div class="form-check">
                <label class="form-check-label ml-3">
                    <input type="radio" class="form-check-input sexoM" name="sexo" id="SexoHEdit" value="H" disabled>
                    Hombre
                </label>
            </div>
        </div>
          <div class="mb-3">
              <input type="url" class="form-control" id="URLEdit" value="${url}">
          </div>
      </div>
      <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="BtnCancelarEditar" data-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary" onclick="editar()" id="BtnEditar" disabled  >Editar</button>
      </div>
      </form>
     </div>
    </div>`
     document.getElementById('ModalEditar').innerHTML=modal;
     if (sexo=="M"){
         document.getElementById('SexoMEdit').setAttribute("checked", "true")
     }else document.getElementById('SexoHEdit').setAttribute("checked", "true")
     $('#ModalEditar').modal('show')
}
//Funcion para guardar y enviar el usuario que se va a editar
function editar(){
    event.preventDefault();
    let sexo="";
    if (document.getElementById("SexoMEdit").checked){
        sexo="M";
    }else sexo="H";
    let newUser = {
        "nombre": document.getElementById("NombreEdit").value,
        "apellido": document.getElementById("ApellidosEdit").value,
        "correo": document.getElementById("EmailEdit").value,
        "password" : document.getElementById("passwordEdit").value,
        "url" : document.getElementById("URLEdit").value,
        "sexo":sexo,
        "fecha" : document.getElementById("FechaEdit").value
    };
    console.log(newUser);
    ReqEditar(newUser);
}
//Funcion para que cada vez que el modal sea cambiado invoque a checkRegistro
window.onload = function () {
    document.getElementById("ModalEditar").onchange = checkEditar;
    document.getElementById("ModalRegistro").onchange = checkRegistro;
}
//Funcion para checar los datos del registro
function checkEditar(){
    let modal = document.getElementById("ModalEditar")
    let invalidos = modal.querySelectorAll("input:invalid")
    var cansubmit = true;
    if (invalidos.length>=1){
        document.getElementById('BtnEditar').disabled = "disabled";
    }else {
        document.getElementById('BtnEditar').removeAttribute('disabled');
    }
}
//Funcion para checar
function checkRegistro(){
    let modal = document.getElementById("ModalRegistro")
    let invalidos = modal.querySelectorAll("input:invalid")
    var cansubmit = true;
    if (invalidos.length>=1){
        document.getElementById('BtnReg').disabled = "disabled";
    }else {
        document.getElementById('BtnReg').removeAttribute('disabled');
    }
}
//Escucha el click de BtnReg y obtiene los datos del usuario
document.getElementById("BtnReg").addEventListener("click", function(event){
    event.preventDefault();
    let sexo="";
    let url="";
    if (document.getElementById("SexoMReg").checked){
        sexo="M";
    }else sexo="H";
    if (document.getElementById("URLReg").value==""){
        url='https://blog.aulaformativa.com/wp-content/uploads/2016/08/consideraciones-mejorar-primera-experiencia-de-usuario-aplicaciones-web-perfil-usuario.jpg';
    }else {
        url=document.getElementById("URLReg").value;
    }
    let newUser = {
        "nombre": document.getElementById("NombreReg").value,
        "apellido": document.getElementById("ApellidosReg").value,
        "correo": document.getElementById("EmailReg").value,
        "password" : document.getElementById("passwordReg").value,
        "url" : url,
        "sexo": sexo,
        "fecha" : document.getElementById("FechaReg").value
    };
    RegistrarUsuario(newUser);
    document.getElementById("BtnCancelarReg").click();
  });
  
//Registra el usuario mediante un req
function RegistrarUsuario(Usuario){
    makeRequest('https://daswpi.herokuapp.com/api/users', 'POST',Usuario,null,
    (Ok) => {
        alert("Usuario Registrado");
        window.location.href='Consultas.html'
    }, (err) => {
        console.log(err);
        alert(err);
    });
}
//Req para editar
function ReqEditar(user){
    console.log(user);
    makeRequest(`https://daswpi.herokuapp.com/api/users/${user.correo}`, 'PUT', user, {'x-auth-user': localStorage.tokenUser}, 
    (value) => {
        console.log(value);
        window.location.href='Consultas.html'
    }, (err) => {
        console.log('Error');
        console.log(err);
    });
}


//Funcion para mostar que usuario se va a eliminar y mensaje de confirmacion
function deleteUser(user) {
    let datos=user.split(",/$");
    let nombre= datos[0]+" "+datos[1];
    let correo= datos[2];
    let fecha = datos[3];
    let sexo = datos[4];
    let url=datos[5];
    let modal=`<div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">¿Desea borrar este usuario?</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="media" class="mb-3">
          <div class="media-left">
              <img src="${url}">
          </div>
          <div class="media-body">
              <h5>&nbsp;${nombre}</h5>
              <p>&nbsp;Correo:${correo}</p>
          </div>
      </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="ReqEliminar('${correo}')">Si</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
      </div>
    </div>
  </div>`
  document.getElementById('BorrarUsuario').innerHTML=modal;
    $('#BorrarUsuario').modal('show')
}
//Mandar un req para eliminar
function ReqEliminar(correo){
    makeRequest(`https://daswpi.herokuapp.com/api/users/${correo}`, 'DELETE', null, {'x-auth-user': localStorage.tokenUser}, 
    (value) => {
        console.log(value);
        window.location.href='Consultas.html'
    }, (err) => {
        console.log('Error');
        console.log(err);
    });
}
//Detalle
function detalle (usuario){
    let datos=usuario.split(",/$");
    let nombre= datos[0];
    let apellido=datos[1];
    let correo= datos[2];
    let fecha = datos[3];
    let sexo = datos[4];
    let url=datos[5];
    document.getElementById("todo").innerHTML= `  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <title>Detalle Usuario</title>
  </head>
  <body>
    <nav class="navbar navbar-expand-lg navbar-light" style=background-color:dimgray>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <a class="nav-link" href="Consultas.html" style="color: white;">Volver <span class="sr-only">(current)</span></a>
            </li>
          </ul>
        </div>
      </nav>
      <p></p>
      <div class="media" class="mb-3 ">
        <div class="media-left">
            <img src="${url}" class="rounded" width="170" height="250">
        </div>
        <div class="media-body" id="DetalleUsuario">
            <h5>&nbsp;${nombre} ${apellido}</h5>
            <p>&nbsp;Correo:${correo}</p>
            <p>&nbsp;Fecha de nacimiento: ${fecha}</p>
            <p>Sexo: ${sexo}</p>
            <p>Url:${url}</p>

        </div>
    </div>
    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <script src="./request.js"></script>
    <script src="./main_consulta.js"></script>
  </body>`;
}

//Busqueda por nombre

function obtenerUsuariosBusqueda(nombre) {
    makeRequest('https://daswpi.herokuapp.com/api/users', 'GET', null, {'x-auth-user': localStorage.tokenUser}, 
    (value) => {
        console.log('Ok');
        mostrarUsuariosBusqueda(value,nombre);
    }, (err) => {
        console.log('Error');
        console.log(err);
    });
}
function mostrarUsuariosBusqueda(users,nombre){
    let usuariosprube2=[];
    let minusculas =nombre.toLowerCase();
    users.forEach(user => {
        let nombreusuario= user.nombre.toLowerCase();
        if (nombreusuario.startsWith(minusculas)){
            makeRequest(`https://daswpi.herokuapp.com/api/users/${user.correo}`, 'GET', null, {'x-auth-user': localStorage.tokenUser},
            (value)=>{
                //let lista = document.getElementById('lista');
                //let userHTML = obtenerCardUsuario(value);
                usuariosprube2.push(value);
                paginado(usuariosprube2);
                //lista.insertAdjacentHTML('beforeend', userHTML);
            },(err)=>{
                console.log('Error');
                console.log(err);
            });   
        }
    });
}
document.getElementById("BuscarNombre").addEventListener("click", function(event){
    document.getElementById("lista").innerHTML="";
    event.preventDefault();
    let nombre=document.getElementById("NombreBuscar").value;
    obtenerUsuariosBusqueda(nombre);
  });





function paginado(usuarios){
    let current_page = 1;
    let records_per_page = 4;
    changePage(1);
    document.getElementById("btn_next").addEventListener("click", function(event){
        //console.log(current_page)
        nextPage();
        //console.log(current_page)
    });
    document.getElementById("btn_prev").addEventListener("click", function(event){
        prevPage();
    });


    let objJson = usuarios; 
function prevPage()
{
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}
function nextPage()
{
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}
function numPages()
{
    return Math.ceil(usuarios.length / records_per_page);
}
function changePage(page)
{

    let btn_next = document.getElementById("btn_next");
    let btn_prev = document.getElementById("btn_prev");
    let lista = document.getElementById("lista");
    let page_span = document.getElementById("page");

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    lista.innerHTML = "";

    for (var i = (page-1) * records_per_page; i < (page * records_per_page); i++) {
        if (usuarios[i]!=undefined){
        lista.innerHTML += `<div class="media col-8 mt-2" id="modelo">
        <div class="media-left align-self-center mr-3">
            <img class="rounded-circle" width="150" height="150" src="${usuarios[i].url}">
        </div>
        <div class="media-body">
            <h4>${usuarios[i].nombre} ${usuarios[i].apellido}</h4>
            <p >Correo: ${usuarios[i].correo}</p>
        </div>
        <div class="media-right align-self-center">
            <div class="row">
                <a href="#" onclick="detalle('${usuarios[i].nombre},/$${usuarios[i].apellido},/$${usuarios[i].correo},/$${usuarios[i].fecha},/$${usuarios[i].sexo},/$${usuarios[i].url}')" class="btn btn-primary edit"><i class="fa fa-search edit  "></i></a>
            </div>
            <div class="row">
                <a href="#" onclick="editUser('${usuarios[i].nombre},/$${usuarios[i].apellido},/$${usuarios[i].correo},/$${usuarios[i].fecha},/$${usuarios[i].sexo},/$${usuarios[i].url}')" class="btn btn-primary mt-2"><i class="fa fa-edit edit  "></i></a>
            </div>
            <div class="row">
                <a href="#" onclick="deleteUser('${usuarios[i].nombre},/$${usuarios[i].apellido},/$${usuarios[i].correo},/$${usuarios[i].fecha},/$${usuarios[i].sexo},/$${usuarios[i].url}')" class="btn btn-primary mt-2"><i class="fa fa-trash  remove "></i></i></a>
            </div>
        </div>
    </div>`;
        }
    }
    page_span.innerHTML = page;

    if (page != 1) {
        document.getElementById('btn_prev').removeAttribute('disabled');
    }
    if (page==1){
        document.getElementById('btn_prev').disabled = "disabled";
    }
    if (page==numPages()){
        document.getElementById('btn_next').disabled = "disabled";
    }else{
        document.getElementById('btn_next').removeAttribute('disabled');
    }
}
}

