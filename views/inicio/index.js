document.addEventListener("DOMContentLoaded", async () => {
  // ========================================== //
  //          1. REFERENCIAS DEL DOM            //
  // ========================================== //
  const contenedor = document.getElementById("componentes-contenedor");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalContainer = document.getElementById("modal-container");
  const modalCloseBtn = document.getElementById("modal-close");
  const modalCartButton = document.getElementById("modal-add-to-cart-button");
  const sideCartPanel = document.getElementById("side-cart-panel");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartTotalElement = document.getElementById("cart-total");
  const cartCountElement = document.getElementById("cart-count");
  const emptyCartMessage = document.getElementById("empty-cart-message");
  let COMPONENTS_DATA = [];

  if (!contenedor) {
    console.error("Error: No se encontró el contenedor de productos.");
    return;
  }

  // ========================================== //
  //        2. CONEXIÓN CON BASE DE DATOS       //
  // ========================================== //
  async function fetchProducts() {
    try {
      const response = await axios.get("/api/product");
      COMPONENTS_DATA = response.data.map((product) => ({
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        image: product.image || "",
        description:
          product.description || "Sin descripción detallada disponible.",
      }));
      renderComponents();
    } catch (error) {
      console.error("Error cargando productos desde la DB:", error);
      COMPONENTS_DATA = [];
      renderComponents();
    }
  }

  // --- Funciones de Ayuda (Utilidades) ---
  function getProductImage(url) {
    if (url && url.trim() !== "") {
      return url;
    }
    return "https://via.placeholder.com/150?text=Sin+Imagen";
  }

  function getProductDetails(id) {
    const baseRating = 4.5;
    return { rating: baseRating };
  }

  function generarEstrellas(rating) {
    const maxEstrellas = 5;
    let htmlEstrellas = "";
    const estrellasLlenas = Math.round(rating);
    for (let i = 0; i < estrellasLlenas; i++) {
      htmlEstrellas += '<span class="text-yellow-500">★</span>';
    }
    for (let i = estrellasLlenas; i < maxEstrellas; i++) {
      htmlEstrellas += '<span class="text-gray-300">★</span>';
    }
    return htmlEstrellas;
  }

  // ========================================== //
  //           3. LÓGICA DEL CARRITO            //
  // ========================================== //
  let carrito = [];
  window.carrito = carrito;

  // Abrir/Cerrar el panel lateral
  //window.toggleSideCart permite acceder a la función desde el HTML
  //toggleSideCart es una función global para alternar el carrito lateral
  //if (sideCartPanel.classList.contains('open')) { renderCartItems(); } asegura que al abrir el carrito se muestren los items
  window.toggleSideCart = function () {
    sideCartPanel.classList.toggle("open");
    if (sideCartPanel.classList.contains("open")) {
      renderCartItems();
    }
  };

  // Actualizar contadores y totales
  function updateCartUI() {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const totalPrice = carrito.reduce(
      (sum, item) => sum + item.price * item.cantidad,
      0
    );
    cartCountElement.textContent = totalItems;
    cartTotalElement.textContent = `$${totalPrice.toFixed(2)}`;
    emptyCartMessage.classList.toggle("hidden", carrito.length > 0);
  }

  // Función principal para "pintar" los productos en el panel lateral del carrito
  function renderCartItems() {
    // 1. Limpiamos el HTML previo para evitar duplicados (borrón y cuenta nueva)
    cartItemsContainer.innerHTML = "";

    // 2. Verificamos si el carrito está vacío
    if (carrito.length === 0) {
      // Si está vacío, mostramos el mensaje de "Tu carrito está vacío" y terminamos aquí
      emptyCartMessage.classList.remove("hidden");
      return;
    }

    // 3. Si hay productos, recorremos el array 'carrito' uno por uno
    carrito.forEach((item) => {
      // A. Creamos un contenedor 'div' para este producto específico
      const itemElement = document.createElement("div");
      // Le asignamos estilos de Tailwind (flexbox, bordes, fondo)
      itemElement.className =
        "flex items-center justify-between p-2 border rounded-lg card-bg";

      // B. Obtenemos la URL válida de la imagen (o la de defecto si falla)
      const imageUrl = getProductImage(item.image);

      // C. Inyectamos el HTML interno usando las variables del producto (${item.name}, etc.)
      // Nota: Aquí usamos las clases 'min-w-0' y 'truncate' para arreglar el texto largo
      itemElement.innerHTML = `
<div class="flex items-center space-x-3 w-3/4 min-w-0">
<img src="${imageUrl}" alt="${
        item.name
      }" class="w-12 h-8 object-cover rounded flex-shrink-0" />

<div class="flex flex-col min-w-0">
<span class="text-sm font-medium text-gray-800 truncate block" title="${
        item.name
      }">
${item.name}
</span>
<span class="text-xs text-gray-600">
$${item.price.toFixed(2)} x ${item.cantidad}
</span>
</div>
</div>

<div class="w-1/4 flex justify-end">
<button 
class="text-red-500 hover:text-red-700 text-lg font-bold"
onclick="removeFromCart('${item.id}')" 
>
&times; </button>
</div>
`;

      // D. Agregamos esta nueva tarjeta al contenedor principal del carrito
      cartItemsContainer.appendChild(itemElement);
    });

    // 4. Al terminar de dibujar todos, actualizamos el precio total y el contador rojo
    updateCartUI();
  }

  // Eliminar producto del carrito
  window.removeFromCart = function (productId) {
    carrito = carrito.filter((item) => item.id !== productId);
    renderCartItems();
    updateCartUI();
  };

  // Añadir producto al carrito
  window.addToCart = function (productId) {
    const product = COMPONENTS_DATA.find((p) => p.id === productId);
    if (!product) return;
    const existingItem = carrito.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.cantidad += 1;
    } else {
      carrito.push({ ...product, cantidad: 1, image: product.image });
    }
    console.log(`[CARRITO] Añadido: ${product.name}`);
    updateCartUI();
    renderCartItems();
  };

  // Finalizar Compra (Ir al recibo)
  window.handleCheckout = function () {
    if (carrito.length === 0) {
      alert("El carrito está vacío. ¡Añade algunos productos primero!");
      return;
    }
    try {
      localStorage.setItem("checkoutCart", JSON.stringify(carrito));
      window.location.href = "/v_res/index.html";
    } catch (e) {
      console.error("Error al guardar el carrito en localStorage:", e);
      alert("No se pudo iniciar el proceso de compra. Inténtalo de nuevo.");
    }
  };

  // ========================================== //
  //      4. RENDERIZADO PRINCIPAL (HOME)       //
  // ========================================== //
  function renderComponents() {
    contenedor.innerHTML = "";
    if (COMPONENTS_DATA.length === 0) {
      contenedor.innerHTML =
        '<p class="col-span-4 text-center text-gray-500 py-10">No hay productos disponibles o cargando...</p>';
      return;
    }
    COMPONENTS_DATA.forEach((component) => {
      const productCard = document.createElement("div");
      // overflow-hidden en la tarjeta para evitar desbordes
      productCard.className =
        "card-bg rounded-xl shadow-lg p-4 flex flex-col justify-between transform transition duration-500 hover:scale-[1.02] overflow-hidden";
      const details = getProductDetails(component.id);
      const imageUrl = getProductImage(component.image);

      productCard.innerHTML = `
            <div class="flex flex-col items-center w-full overflow-hidden">
                <img src="${imageUrl}" alt="${
        component.name
      }" class="w-full h-32 object-cover rounded-lg mb-3" />
                
                <h3 class="text-lg font-bold text-gray-800 text-center w-full truncate px-4" title="${
                  component.name
                }">
                    ${component.name}
                </h3>

                <p class="text-2xl font-extrabold text-green-700 mt-1 mb-3">$${component.price.toFixed(
                  2
                )}</p>
                <div class="text-sm">
                    ${generarEstrellas(details.rating)}
                </div>
            </div>
            <div class="w-full mt-auto pt-2">
                <button 
                    class="w-full text-center bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium py-2 rounded-full transition duration-150 ver-caracteristicas mb-2"
                    data-id="${component.id}"
                    data-nombre="${component.name}"
                    data-descripcion="${component.description}" 
                    data-calificacion="${details.rating}"
                    data-image="${component.image}" 
                >
                    Ver Características
                </button>
                <button
                    class="w-full text-center bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2 rounded-full transition duration-150 add-to-cart-btn"
                    data-product-id="${component.id}"
                    onclick="addToCart('${component.id}')"
                >
                    Añadir al Carrito
                </button>
            </div>
            `;
      contenedor.appendChild(productCard);
    });
    asignarEventosModal();
  }

  // ========================================== //
  //           1. FUNCIÓN CERRAR MODAL          //
  // ========================================== //
  // Simplemente oculta la ventana agregando la clase 'hidden' de Tailwind
  function cerrarModal() {
    modalOverlay.classList.add("hidden");
    modalContainer.classList.add("hidden");
  }

  // ========================================== //
  //            5. FUNCIÓN ABRIR MODAL          //
  // ========================================== //
  // Esta es la parte compleja: Recibe el clic, busca los datos y rellena la "pizarra"
  function abrirModal(evento) {
    // A. Identificamos qué botón fue presionado
    const boton = evento.currentTarget;

    // B. "Robamos" la información guardada dentro del botón (los data-attributes)
    const productId = boton.dataset.id;
    const nombre = boton.dataset.nombre;
    const descripcion = boton.dataset.descripcion;
    const calificacion = parseFloat(boton.dataset.calificacion) || 0;
    const imagenUrl = boton.dataset.image;
    
    // C. Conseguimos la imagen correcta (o la de error si falla)
    const imagenSrc = getProductImage(imagenUrl);

    // D. Inyectamos esa información en el HTML del Modal (La pizarra)
    document.getElementById("modal-nombre").textContent = nombre;
    document.getElementById("modal-imagen").src = imagenSrc;
    document.getElementById("modal-descripcion").textContent = descripcion;
    document.getElementById("modal-calificacion").innerHTML = generarEstrellas(calificacion);

    // E. IMPORTANTE: Configuramos el botón "Añadir al Carrito" DENTRO del modal
    // Le decimos: "Cuando te cliquen, añade ESTE producto específico (productId)"
    modalCartButton.onclick = () => {
      addToCart(productId);
      cerrarModal(); // Y luego ciérrate
    };

    // F. Finalmente, mostramos la ventana quitando la clase 'hidden'
    modalOverlay.classList.remove("hidden");
    modalContainer.classList.remove("hidden");
  }

  // ========================================== //
  //        3. ASIGNAR LOS ESCUCHADORES         //
  // ========================================== //
  // Esta función busca todos los botones y les pega la función de abrir
  function asignarEventosModal() {
    // Buscamos todos los botones que digan "Ver Características"
    const botonesVer = document.querySelectorAll(".ver-caracteristicas");
    
    botonesVer.forEach((boton) => {
      // Truco de seguridad: Quitamos el evento anterior para no tener duplicados
      boton.removeEventListener("click", abrirModal);
      // Agregamos el evento de clic nuevo
      boton.addEventListener("click", abrirModal);
    });

    // Configuramos la X y el fondo oscuro para cerrar
    modalCloseBtn.addEventListener("click", cerrarModal);
    modalOverlay.addEventListener("click", cerrarModal);
  }
  // --- INICIALIZACIÓN ---
  await fetchProducts();
  updateCartUI();
});
