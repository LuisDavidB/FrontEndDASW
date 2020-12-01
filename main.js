VerLogin();
makeRequest('https://daswpi.herokuapp.com/api','GET',null,null,
    (value)=>{
        console.log('BackEnd y FrontEnd Conectados ');
    }, (err)=>{
        console.log('Error');
        console.log(err);
    });

//Manda a llamar a Checar cada vez que hay cambios o click
window.onload = function () {
    document.getElementById("ModalRegistro").onclick = checkRegistro;
    document.getElementById("NombreReg").oninput = checkRegistro;
    document.getElementById("ApellidosReg").oninput = checkRegistro;
    document.getElementById("EmailReg").oninput=checkRegistro;
    document.getElementById("passwordReg").oninput = checkRegistro;
    document.getElementById("password2Reg").oninput = checkRegistro;
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
    }, (err) => {
        console.log(err);
        alert(err);
    });
}

document.getElementById("CerrarSesion").addEventListener("click",function(event){
    localStorage.clear();
    VerLogin();
});

function VerLogin(){
    if (localStorage.tokenUser===undefined){
        document.getElementById("OpcionRegistro").removeAttribute('style');
        document.getElementById("OpcionLogin").removeAttribute('style');
        document.getElementById("OpcionesUsuario").style.display='none';
        document.getElementById("Administrador").style.display='none';
        
    }else{
        document.getElementById("OpcionLogin").style.display='none';
        document.getElementById("OpcionRegistro").style.display='none';
        document.getElementById("OpcionesUsuario").removeAttribute('style');
        document.getElementById("Administrador").removeAttribute('style');
        makeRequest('https://daswpi.herokuapp.com/api/UsuarioLoggeado', 'GET',null, {'x-auth-user': localStorage.tokenUser},
        (value) => {
            document.getElementById("Saludo").innerText="Hola " + value.nombre + " "+ value.apellido;
        },(err) =>{
            console.log(err);
        }
        )};
};

document.getElementById("BtnLog").addEventListener("click",function(event){
    event.preventDefault();
    let newUser = {
        "correo": document.getElementById("formGroupCorreoInput").value,
        "password": document.getElementById("formGroupPasswordInput").value
    };
    obtenerTokenUsuario(newUser);
});
//Obtiene el token usuario (Login)
function obtenerTokenUsuario(newUser) {
    makeRequest('https://daswpi.herokuapp.com/api/login', 'POST', newUser,null,
    (value) => {
        console.log('Ok logueado');
        console.log(value);
        localStorage.tokenUser = value;
        document.getElementById("BtnLogCan").click();
        VerLogin();
    }, (err) => {
        alert(err);
    });
}

// Funcion para obtener todos los usuarios
obtenerProductos();
function obtenerProductos() {
    makeRequest('https://daswpi.herokuapp.com/api/products', 'GET', null, {'x-auth-user': localStorage.tokenUser}, 
    (value) => {
        console.log('Ok');
        console.log(value);
        mostrarProductos(value);
    }, (err) => {
        console.log('Error');
        console.log(err);
    });
}

//Funcion que invoca el card y obtiene los datos completos de cada usuario
function mostrarProductos(productos){
    let productosprube=[];
    productos.forEach(producto => {
        let id=producto._id;
        makeRequest(`https://daswpi.herokuapp.com/api/products/${id}`, 'GET', null, {'x-auth-user': localStorage.tokenUser},
        (value)=>{
            if (value.ofertador==""){
                productosprube.push(value);
                paginado(productosprube);
            }
        },(err)=>{
            console.log('Error');
            console.log(err);
        });
    });
}

function Ofertar(user) {
    let datos=user.split(",/$");
    let nombre= datos[0];
    let user_nombre= datos[1];
    let user_apellido = datos[2];
    let condicion = datos[3];
    let producto = datos[4];
    let url=datos[5];
    let id =datos[6];
    let idusuario =datos[7];
    console.log(datos);
    let modal=`<div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">¿Desea ofertar por este articulo?</h5>
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
              <p>&nbsp;Dueño:${user_nombre} ${user_apellido}</p>
              <p>&nbsp;Condicion:${condicion}</p>
              <p>&nbsp;Producto deseado:${producto}</p>
          </div>
      </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="ReqOfertar('${id},/$${idusuario}')">Si</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
      </div>
    </div>
  </div>`
  document.getElementById('OfertarProducto').innerHTML=modal;
    $('#OfertarProducto').modal('show')
}

//Req para editar
function ReqOfertar(datos){
    let dato = datos.split(",/$");
    let id = dato[0];
    let idusuario={id:dato[1]};
    makeRequest(`https://daswpi.herokuapp.com/api/products/ofertar/${id}`, 'PUT', idusuario, {'x-auth-user': localStorage.tokenUser}, 
    (value) => {
        console.log(value);
        window.location.href='index.html'
    }, (err) => {
        alert("Necesitas estar loggeado");
        console.log(err);
    });
}



//Busqueda por nombre

function obtenerUsuariosBusqueda(nombre) {
    makeRequest('https://daswpi.herokuapp.com/api/products', 'GET', null, {'x-auth-user': localStorage.tokenUser}, 
    (value) => {
        console.log('Ok');
        mostrarUsuariosBusqueda(value,nombre);
    }, (err) => {
        console.log('Error');
        console.log(err);
    });
}
function mostrarUsuariosBusqueda(products,nombre){
    let productsprube2=[];
    let minusculas =nombre.toLowerCase();
    products.forEach(product => {
        let id =product._id
        let nombreproducto= product.nombre.toLowerCase();
        if (nombreproducto.startsWith(minusculas)){
            makeRequest(`https://daswpi.herokuapp.com/api/products/${id}`, 'GET', null, {'x-auth-user': localStorage.tokenUser},
            (value)=>{
                if (value.ofertador==""){
                    productsprube2.push(value);
                    paginado(productsprube2);
                }
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





function paginado(productos){
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


    let objJson = productos; 
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
    return Math.ceil(productos.length / records_per_page);
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
        if (productos[i]!=undefined){
        let id=productos[i]._id;
        lista.innerHTML += `<div class="media col-8 mt-2" id="modelo">
        <div class="media-left align-self-center mr-3">
            <img class="rounded-circle" width="150" height="150" src="${productos[i].url}">
        </div>
        <div class="media-body">
            <h4>${productos[i].nombre}</h4>
            <p>Dueño: ${productos[i].user_nombre} ${productos[i].user_apellido}</p>
            <p>Condicion: ${productos[i].condicion}</p>
            <p>Tiempo de uso: ${productos[i].uso}</p>
            <p>Valor Aprox.: ${productos[i].precio}</p>
            <p>Producto que desea : ${productos[i].producto}</p>
            <p>Descripcion: ${productos[i].descripcion}</p>
        </div>
        <div class="media-right align-self-center">
            <div class="row">
                <a href="#" onclick="Ofertar('${productos[i].nombre},/$${productos[i].user_nombre},/$${productos[i].user_apellido},/$${productos[i].condicion},/$${productos[i].producto},/$${productos[i].url},/$${id},/$${productos[i].user_id}')" class="btn btn-primary mt-2"><i class="fa fa-gavel gavel  "></i></a>
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

