obtenerProductos();
function obtenerProductos() {
    makeRequest('https://daswpi.herokuapp.com/api/misproducts', 'GET', null, {'x-auth-user': localStorage.tokenUser}, 
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
                productosprube.push(value);
                paginado(productosprube);
        },(err)=>{
            console.log('Error');
            console.log(err);
        });
    });
}

document.getElementById("BtnSubirReg").addEventListener("click", function(event){
    event.preventDefault();
    let url="";
    if (document.getElementById("UrlReg").value==""){
        url='https://definicion.de/wp-content/uploads/2009/06/producto.jpg';
    }else {
        url=document.getElementById("UrlReg").value;
    }
    let newProduct = {
        "nombre": document.getElementById("NombreRegProd").value,
        "uso": document.getElementById("UsoReg").value,
        "condicion": document.getElementById("CondicionReg").value,
        "precio" : document.getElementById("PrecioReg").value,
        "producto" : document.getElementById("ProductoReg").value,
        "descripcion" : document.getElementById("DescReg").value,
        "url" : url
    };
    RegistrarProducto(newProduct);
    document.getElementById("BtnSubCanReg").click();
  });
  
//Registra el usuario mediante un req
function RegistrarProducto(Usuario){
    makeRequest('https://daswpi.herokuapp.com/api/products', 'POST',Usuario,{'x-auth-user': localStorage.tokenUser},
    (Ok) => {
        alert("Producto Registrado");
        window.location.href='MisProductos.html'
    }, (err) => {
        console.log(err);
        alert(err);
    });
}

//Funcion para precargar los datos y modal para editar
function editProduct(product){
    let datos=product.split(",/$");
    let nombre= datos[0];
    let condicion=datos[1];
    let uso= datos[2];
    let precio = datos[3];
    let producto = datos[4];
    let descripcion=datos[5];
    let url=datos[6];
    let id=datos[7];
    let modal =`<div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Editar producto</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
              <div class="mb-3">
                  <input type="text" class="form-control" id="NombreEditProd" value="${nombre}" required minlength="2" maxlength="25">
              </div>
              <div class="mb-3">
                  <input type="text" class="form-control" id="UsoEdit" value="${uso}" required minlength="2" maxlength="20">
              </div>
          <div class="mb-3">
              <input type="text" class="form-control" id="CondicionEdit" value="${condicion}" required>
          </div>
          <div class="mb-3">
              <input type="text" class="form-control" id="PrecioEdit" value="${precio}" required>
          </div>
          <div class="mb-3">
            <input type="text" class="form-control" id="ProductoEdit" value="${producto}" required>
        </div>
        <div class="mb-3">
          <textarea type="text" class="form-control" id="DescEdit"  required>${descripcion}</textarea>
      </div>
          <div class="mb-3">
              <input type="url" class="form-control" id="UrlEdit" value="${url}">
          </div>
      </div>
      <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="BtnEditCan" data-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary" onclick="editar('${id}')" id="BtnEdit" >Editar</button>
      </div>
     </div>
    </div>`
     document.getElementById('ModalEditarSubir').innerHTML=modal;
     $('#ModalEditarSubir').modal('show')
}
//Funcion para guardar y enviar el usuario que se va a editar
function editar(id){
    event.preventDefault();
    let newUser = {
        "nombre": document.getElementById("NombreEditProd").value,
        "uso": document.getElementById("UsoEdit").value,
        "condicion": document.getElementById("CondicionEdit").value,
        "precio" : document.getElementById("PrecioEdit").value,
        "producto" : document.getElementById("ProductoEdit").value,
        "descripcion" : document.getElementById("DescEdit").value,
        "url" : document.getElementById("UrlEdit").value
    };
    console.log(newUser);
    ReqEditar(newUser,id);
}
//Funcion para que cada vez que el modal sea cambiado invoque a checkRegistro
window.onload = function () {
    document.getElementById("ModalEditarSubir").onchange = checkEditar;
    document.getElementById("ModalSubir").onchange = checkSubir;
}
//Funcion para checar los datos del registro
function checkSubir(){
    let modal = document.getElementById("ModalSubir")
    let invalidos = modal.querySelectorAll("input:invalid")
    var cansubmit = true;
    console.log(invalidos.length);
    if (invalidos.length>=1){
        document.getElementById('BtnSubirReg').disabled = "disabled";
    }else {
        document.getElementById('BtnSubirReg').removeAttribute('disabled');
    }
}
function checkEditar(){
    let modal = document.getElementById("ModalEditarSubir")
    let invalidos = modal.querySelectorAll("input:invalid")
    var cansubmit = true;
    console.log(invalidos.length);
    if (invalidos.length>=1){
        document.getElementById('BtnEdit').disabled = "disabled";
    }else {
        document.getElementById('BtnEdit').removeAttribute('disabled');
    }
}
//Req para editar
function ReqEditar(product ,id){
    makeRequest(`https://daswpi.herokuapp.com/api/products/${id}`, 'PUT', product, {'x-auth-user': localStorage.tokenUser}, 
    (value) => {
        console.log(value);
        window.location.href='MisProductos.html'
    }, (err) => {
        console.log('Error');
        console.log(err);
    });
}


//Funcion para mostar que usuario se va a eliminar y mensaje de confirmacion
function deleteProduct(product) {
    let datos=product.split(",/$");
    let nombre= datos[0];
    let user_nombre=datos[1];
    let user_apellido= datos[2];
    let precio = datos[3];
    let descripcion = datos[4];
    let url=datos[5];
    let id=datos[6];
    let modal=`<div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">¿Desea borrar este producto?</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="media" class="mb-10">
          <div class="media-left">
              <img src="${url}">
          </div>
          <div class="media-body">
              <h5>&nbsp;${nombre}</h5>
              <p>Dueño: ${user_nombre} ${user_apellido}</p>
              <p>Precio: ${precio}</p>
              <p>Descripcion: ${descripcion}</p>
          </div>
      </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="ReqEliminar('${id}')">Si</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
      </div>
    </div>
  </div>`
  document.getElementById('BorrarProducto').innerHTML=modal;
    $('#BorrarProducto').modal('show')
}
//Mandar un req para eliminar
function ReqEliminar(id){
    makeRequest(`https://daswpi.herokuapp.com/api/products/${id}`, 'DELETE', null, {'x-auth-user': localStorage.tokenUser}, 
    (value) => {
        console.log(value);
        window.location.href='MisProductos.html'
    }, (err) => {
        console.log('Error');
        console.log(err);
    });
}

//Busqueda por nombre

function obtenerUsuariosBusqueda(nombre) {
    makeRequest('https://daswpi.herokuapp.com/api/misproducts', 'GET', null, {'x-auth-user': localStorage.tokenUser}, 
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
                productsprube2.push(value);
                console.log(productsprube2);
                paginado(productsprube2);
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
            <p id="Ofertade${i}">Oferta de: ${productos[i].ofertador}</p>
        </div>
        <div class="media-right align-self-center">
            <div class="row">
                <a href="#" id="Editar${i}" onclick="editProduct('${productos[i].nombre},/$${productos[i].condicion},/$${productos[i].uso},/$${productos[i].precio},/$${productos[i].producto},/$${productos[i].descripcion},/$${productos[i].url},/$${id}')" class="btn btn-primary mt-2"><i class="fa fa-edit edit  "></i></a>
            </div>
            <div class="row">
                <a href="#" id="Eliminar${i}" onclick="deleteProduct('${productos[i].nombre},/$${productos[i].user_nombre},/$${productos[i].user_apellido},/$${productos[i].precio},/$${productos[i].descripcion},/$${productos[i].url},/$${id}')" class="btn btn-primary mt-2"><i class="fa fa-trash  remove "></i></i></a>
            </div>
        </div>
    </div>`;

    if (productos[i].ofertador==""){
        document.getElementById(`Editar${i}`).removeAttribute('style');
        document.getElementById(`Eliminar${i}`).removeAttribute('style');
        document.getElementById(`Ofertade${i}`).innerText=`Sin oferta`
    }else {
        document.getElementById(`Editar${i}`).style.display='none';
        document.getElementById(`Eliminar${i}`).style.display='none';
        document.getElementById(`Ofertade${i}`).innerText=`Oferta de: ${productos[i].ofertador}`
    }
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