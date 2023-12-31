//ubicacion carrito
const cart = document.querySelector("#carrito");
//div de los articulos
const prodlist = document.querySelector("#lista-cursos");
//seleccion del tbody donde van los productos
const contCart = document.querySelector("#lista-carrito tbody");
//boton clean
const clnBtn = document.querySelector("#vaciar-carrito");
//arreglo de articulos
let articles = [];

//recibe el click del boton
registEventListener();

function registEventListener() {
  //funcion que escuha el clikc y manda a llamar a la funcion add course
  prodlist.addEventListener("click", addCourse);

  //ELimina curso del cart
  cart.addEventListener("click", deleteCourse);

  //ELimina TODO del cart
  clnBtn.addEventListener("click", cleanCart);

  //Carga los items del Local Storage

  document.addEventListener("DOMContentLoaded", () => {
    articles = JSON.parse(localStorage.getItem("Cart")) || [];
    cartHTML();
  });
}

function addCourse(e) {
  //previene la accion por defecto
  e.preventDefault();
  //Si el evento contiene la clase add cart se selcciona
  if (e.target.classList.contains("agregar-carrito")) {
    //selecciona el padre del boton ue se selecciono
    let divParent = e.target.parentNode.parentNode;
    //manda a llamar funcion que lee y registra los datos
    readData(divParent);
  }
}

function deleteCourse(e) {
  if (e.target.classList.contains("borrar-curso")) {
    //se obtiene el id del articulo
    const article = e.target.getAttribute("data-id");

    //Se llama el carrito y quita el que es igual al id obtenido al precionar el boton
    articles = articles.filter((art) => art.id !== article);

    //se actualiza en HTML
    cartHTML();
  }
}

function cleanCart(e) {
  e.preventDefault();
  articles = [];

  //se actualiza en HTML
  cartHTML();
}

function readData(product) {
  //se crea un objeto con los datos de los productos
  const prodInfo = {
    name: product.querySelector("h4").textContent,
    owner: product.querySelector("p").textContent,
    image: product.querySelector("img").src,
    price: product.querySelector(".precio span ").textContent,
    id: product.querySelector("a").getAttribute("data-id"),
    qty: 1,
  };
  //SOME es un if para un array
  //Se verifica si el arreglo contiene un id que ya existe en el mismo
  const productExist = articles.some((article) => article.id === prodInfo.id);
  // si es verdadero
  if (productExist) {
    //Se mapea el articulo y verifica cual id es el que se repite y añade uno a la cantidad
    const products = articles.map((article) => {
      if (article.id === prodInfo.id) {
        article.qty++;
        //se devuelve el valor del arreglo
        return article;
      } else {
        //no hace nada
        return article;
      }
    });

    articles = [...products];
  } else {
    //Si no se llena como siempre con la info del prod antes recabada
    //Add elements
    articles = [...articles, prodInfo];
  }
  //Se manda a crear el html para cada articulo
  cartHTML(articles);
}

function cartHTML() {
  cleanHTML();
  articles.forEach((element) => {
    const row = document.createElement("tr");
    row.innerHTML =
      "<td> <img src = '" +
      element.image +
      "' width='100rem' /></td>" +
      "<td>  " +
      element.name +
      "</td>" +
      "<td>  " +
      element.price +
      "</td>" +
      "<td>  " +
      element.qty +
      "</td>" +
      "<td>  <a href='#' class='borrar-curso' data-id='" +
      element.id +
      "'> X </a> </td>";
    contCart.appendChild(row);
  });

  //Add the articles to Local Storage
  syncStorage();
}

//Limpia el carrito de los arrays anteriores para que no se repite cada vez
function cleanHTML() {
  while (contCart.firstChild) {
    contCart.removeChild(contCart.firstChild);
  }
}
function syncStorage() {
  localStorage.setItem("Cart", JSON.stringify(articles));
}
