document.addEventListener('DOMContentLoaded', () => {
    // --- 1. REFERENCIAS AL DOM ---
    const addProductBtn = document.querySelector('header button'); // Botón "+ Agregar"
    const productFormContainer = document.getElementById('product-form');
    const productForm = productFormContainer.querySelector('form');
    
    // Inputs del formulario
    const nameInput = productForm.querySelector('input[placeholder="Nombre del Producto"]');
    const priceInput = productForm.querySelector('input[placeholder="Precio ($)"]');
    
    // Referencias para la Imagen
    const imgUrlInput = document.getElementById('product-img-url'); // El input de la URL
    const imgPreview = document.getElementById('preview-img');      // La etiqueta <img> de vista previa
    const defaultImg = "https://via.placeholder.com/150?text=IMG"; // Imagen por defecto
    
    // --- NUEVO: Referencia a la Descripción ---
    const descInput = document.getElementById('product-desc'); 
    // -----------------------------------------

    const cancelBtn = productForm.querySelector('button.bg-gray-500');
    const submitBtn = productForm.querySelector('button[type="submit"]');
    const formTitle = productFormContainer.querySelector('h2');
    const tableContainer = document.querySelector('.bg-white.rounded-lg.shadow-xl.overflow-hidden');

    // Estado
    let isEditing = false;
    let currentId = null;
    const API_URL = '/api/product'; 

    // --- 2. LÓGICA DE PREVISUALIZACIÓN DE IMAGEN ---
    // Cada vez que el usuario escriba o pegue un link, actualizamos la foto
    if(imgUrlInput && imgPreview) {
        imgUrlInput.addEventListener('input', (e) => {
            const url = e.target.value;
            if (url) {
                imgPreview.src = url;
            } else {
                imgPreview.src = defaultImg;
            }
        });

        // Si el link está roto, volver a la imagen por defecto
        imgPreview.addEventListener('error', () => {
            imgPreview.src = defaultImg;
        });
    }

    // --- 3. FUNCIONES DE UI ---

    function showForm(editMode = false, product = {}) {
        productFormContainer.classList.remove('hidden');
        isEditing = editMode;
        
        if (editMode) {
            // MODO EDITAR
            formTitle.textContent = 'Editar Producto';
            submitBtn.textContent = 'Actualizar Producto';
            
            // Rellenar datos básicos
            nameInput.value = product.name;
            priceInput.value = product.price;
            currentId = product.id || product._id;

            // Rellenar imagen
            imgUrlInput.value = product.image || ''; 
            imgPreview.src = product.image || defaultImg; 

            // --- NUEVO: Rellenar descripción ---
            descInput.value = product.description || ''; 
            // ----------------------------------
            
        } else {
            // MODO CREAR
            formTitle.textContent = 'Añadir Nuevo Producto';
            submitBtn.textContent = 'Guardar Producto';
            productForm.reset();
            
            // Resetear imagen
            imgPreview.src = defaultImg;
            
            // --- NUEVO: Limpiar descripción ---
            descInput.value = ''; 
            // ---------------------------------

            currentId = null;
        }
    }

    function hideForm() {
        productFormContainer.classList.add('hidden');
        productForm.reset();
        imgPreview.src = defaultImg; // Limpiar preview al cerrar
        isEditing = false;
        currentId = null;
    }

    // --- 4. FUNCIONES CRUD ---

    // READ (Cargar productos)
    async function loadProducts() {
        try {
            const response = await axios.get(API_URL);
            const products = response.data;
            renderTable(products);
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
    }

    // RENDER (Pintar tabla)
    function renderTable(products) {
        const headerHTML = `
            <div class="grid grid-cols-6 gap-4 p-4 font-bold text-sm text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <div class="col-span-1">Imagen</div>
                <div class="col-span-2">Nombre</div>
                <div class="col-span-1">Precio</div>
                <div class="col-span-2">Acciones</div>
            </div>
        `;

        tableContainer.innerHTML = headerHTML;

        if (!products || products.length === 0) {
            tableContainer.innerHTML += '<div class="p-4 text-center text-gray-500">No hay productos registrados.</div>';
            return;
        }

        products.forEach(product => {
            // Usamos la imagen del producto o una por defecto si no tiene
            const productImg = product.image || defaultImg;

            const rowHTML = `
            <div class="grid grid-cols-6 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 items-center transition duration-100">
                <div class="col-span-1">
                    <div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500 shadow-inner overflow-hidden">
                        <img src="${productImg}" alt="${product.name}" class="w-full h-full object-cover">
                    </div>
                </div>
                <div class="col-span-2 font-medium text-gray-900">${product.name}</div>
                <div class="col-span-1 text-gray-700 font-semibold">$${product.price}</div>
                <div class="col-span-2 flex space-x-2">
                    <button class="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 text-sm rounded transition shadow-sm btn-edit"
                        data-id="${product.id || product._id}" 
                        data-name="${product.name}" 
                        data-price="${product.price}"
                        data-image="${product.image || ''}"
                        data-description="${product.description || ''}"> Editar
                    </button>
                    <button class="bg-red-600 hover:bg-red-700 text-white py-1 px-3 text-sm rounded transition shadow-sm btn-delete"
                        data-id="${product.id || product._id}">
                        Eliminar
                    </button>
                </div>
            </div>
            `;
            tableContainer.insertAdjacentHTML('beforeend', rowHTML);
        });

        assignActionButtons();
    }

    function assignActionButtons() {
        // Editar
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const productData = {
                    id: btn.dataset.id,
                    name: btn.dataset.name,
                    price: btn.dataset.price,
                    image: btn.dataset.image,
                    // --- NUEVO: Leemos la descripción del botón ---
                    description: btn.dataset.description 
                    // ---------------------------------------------
                };
                showForm(true, productData);
                // Scroll arriba para ver el formulario
                document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Eliminar
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (confirm('¿Estás seguro de eliminar este producto?')) {
                    try {
                        await axios.delete(`${API_URL}/${btn.dataset.id}`);
                        loadProducts();
                    } catch (error) {
                        console.error('Error eliminando:', error);
                        alert('Error al eliminar (Revisa consola)');
                    }
                }
            });
        });
    }

    // --- 5. EVENT LISTENERS GLOBALES ---

    addProductBtn.addEventListener('click', () => {
        if (productFormContainer.classList.contains('hidden')) {
            showForm(false);
        } else {
            hideForm();
        }
    });

    cancelBtn.addEventListener('click', hideForm);

    // GUARDAR (Submit)
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productData = {
            name: nameInput.value,
            price: priceInput.value,
            image: imgUrlInput.value,
            // --- NUEVO: Enviamos la descripción al servidor ---
            description: descInput.value
            // --------------------------------------------------
        };

        try {
            if (isEditing) {
                await axios.put(`${API_URL}/${currentId}`, productData);
            } else {
                await axios.post(API_URL, productData);
            }
            hideForm();
            loadProducts();
        } catch (error) {
            console.error('Error guardando producto:', error);
            alert('Error al guardar producto. Asegurate de tener el backend corriendo.');
        }
    });

    // INICIAR
    loadProducts();
});