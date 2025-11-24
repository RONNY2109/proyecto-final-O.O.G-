document.addEventListener('DOMContentLoaded', () => {
    
    // ========================================== //
    //        1. REFERENCIAS DOM & ESTADO         //
    // ========================================== //
    const addProductBtn = document.querySelector('header button'); 
    const productFormContainer = document.getElementById('product-form');
    const productForm = productFormContainer.querySelector('form');
    
    const nameInput = productForm.querySelector('input[placeholder="Nombre del Producto"]');
    const priceInput = productForm.querySelector('input[placeholder="Precio ($)"]');
    
    const imgUrlInput = document.getElementById('product-img-url');
    const imgPreview = document.getElementById('preview-img');
    const defaultImg = "https://via.placeholder.com/150?text=IMG";
    
    const descInput = document.getElementById('product-desc'); 

    const cancelBtn = productForm.querySelector('button.bg-gray-500');
    const submitBtn = productForm.querySelector('button[type="submit"]');
    const formTitle = productFormContainer.querySelector('h2');
    
    // Nota: Buscamos el contenedor de la tabla. 
    // Si usaste el HTML responsive que te di antes, la tabla está dentro de un div con scroll.
    // Si usas el viejo, esto sigue funcionando.
    const tableContainer = document.querySelector('.bg-white.rounded-lg.shadow-xl.overflow-hidden');

    let isEditing = false;
    let currentId = null;
    const API_URL = '/api/product'; 

    // ========================================== //
    //       2. PREVISUALIZACIÓN DE IMAGEN        //
    // ========================================== //
    if(imgUrlInput && imgPreview) {
        imgUrlInput.addEventListener('input', (e) => {
            const url = e.target.value;
            if (url) {
                imgPreview.src = url;
            } else {
                imgPreview.src = defaultImg;
            }
        });

        imgPreview.addEventListener('error', () => {
            imgPreview.src = defaultImg;
        });
    }

    // ========================================== //
    //           3. GESTIÓN DE LA UI              //
    // ========================================== //
    
    function showForm(editMode = false, product = {}) {
        productFormContainer.classList.remove('hidden');
        isEditing = editMode;
        
        if (editMode) {
            formTitle.textContent = 'Editar Producto';
            submitBtn.textContent = 'Actualizar Producto';
            
            nameInput.value = product.name;
            priceInput.value = product.price;
            currentId = product.id || product._id;

            imgUrlInput.value = product.image || ''; 
            imgPreview.src = product.image || defaultImg; 

            descInput.value = product.description || ''; 
            
        } else {
            formTitle.textContent = 'Añadir Nuevo Producto';
            submitBtn.textContent = 'Guardar Producto';
            productForm.reset();
            
            imgPreview.src = defaultImg;
            descInput.value = ''; 
            currentId = null;
        }
    }

    function hideForm() {
        productFormContainer.classList.add('hidden');
        productForm.reset();
        imgPreview.src = defaultImg;
        isEditing = false;
        currentId = null;
    }

    // ========================================== //
    //          4. FUNCIONES CRUD (LEER)          //
    // ========================================== //
    
    async function loadProducts() {
        try {
            const response = await axios.get(API_URL);
            const products = response.data;
            renderTable(products);
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
    }

    function renderTable(products) {
        // Ajustamos el header para asegurar el ancho mínimo (para responsive)
        const headerHTML = `
            <div class="grid grid-cols-6 gap-4 p-4 font-bold text-sm text-gray-700 uppercase bg-gray-50 border-b border-gray-200 min-w-[600px]">
                <div class="col-span-1">Imagen</div>
                <div class="col-span-2">Nombre</div>
                <div class="col-span-1">Precio</div>
                <div class="col-span-2">Acciones</div>
            </div>
        `;

        // Truco: Si cambiamos el HTML para ser responsive, el contenedor directo de la tabla
        // puede ser un hijo del tableContainer original. Buscamos dónde inyectar.
        // Si no encuentra el hijo, usa el contenedor principal.
        const targetDiv = tableContainer.querySelector('div') || tableContainer;
        
        targetDiv.innerHTML = headerHTML;

        if (!products || products.length === 0) {
            targetDiv.innerHTML += '<div class="p-4 text-center text-gray-500">No hay productos registrados.</div>';
            return;
        }

        products.forEach(product => {
            const productImg = product.image || defaultImg;

            const rowHTML = `
            <div class="grid grid-cols-6 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 items-center transition duration-100 min-w-[600px]">
                <div class="col-span-1">
                    <div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500 shadow-inner overflow-hidden">
                        <img src="${productImg}" alt="${product.name}" class="w-full h-full object-cover">
                    </div>
                </div>
                
                <div class="col-span-2 font-medium text-gray-900 truncate block" title="${product.name}">
                    ${product.name}
                </div>

                <div class="col-span-1 text-gray-700 font-semibold">$${product.price}</div>
                <div class="col-span-2 flex space-x-2">
                    <button class="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 text-sm rounded transition shadow-sm btn-edit"
                        data-id="${product.id || product._id}" 
                        data-name="${product.name}" 
                        data-price="${product.price}"
                        data-image="${product.image || ''}"
                        data-description="${product.description || ''}"> 
                        Editar
                    </button>
                    <button class="bg-red-600 hover:bg-red-700 text-white py-1 px-3 text-sm rounded transition shadow-sm btn-delete"
                        data-id="${product.id || product._id}">
                        Eliminar
                    </button>
                </div>
            </div>
            `;
            targetDiv.insertAdjacentHTML('beforeend', rowHTML);
        });

        assignActionButtons();
    }

    // ========================================== //
    //      5. ACCIONES (EDITAR / ELIMINAR)       //
    // ========================================== //
    function assignActionButtons() {
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const productData = {
                    id: btn.dataset.id,
                    name: btn.dataset.name,
                    price: btn.dataset.price,
                    image: btn.dataset.image,
                    description: btn.dataset.description 
                };
                showForm(true, productData);
                document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
            });
        });

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

    // ========================================== //
    //       6. LISTENERS Y SUBMIT (GUARDAR)      //
    // ========================================== //

    addProductBtn.addEventListener('click', () => {
        if (productFormContainer.classList.contains('hidden')) {
            showForm(false);
        } else {
            hideForm();
        }
    });

    cancelBtn.addEventListener('click', hideForm);

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productData = {
            name: nameInput.value,
            price: priceInput.value,
            image: imgUrlInput.value,
            description: descInput.value
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

    // --- INICIALIZAR AL CARGAR ---
    loadProducts();
});