const navbar = document.querySelector("#navbar");

const createNavHome = () => {
    // CAMBIO: bg-indigo-700 -> bg-gray-800 | TodoApp -> Game Labs | Botones verdes/grises
    navbar.innerHTML = `<div class="max-width-7xl h-16 mx-auto flex items-center px-4 justify-between bg-gray-800">
                            <a href="/" class="font-bold text-xl text-white tracking-wider">Game Labs</a>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 md:hidden text-white cursor-pointer p-2 rounded-lg hover:bg-gray-700">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            <div class="bg-gray-900/95 fixed top-16 right-0 left-0 bottom-0 flex justify-center items-center flex-col gap-4 hidden backdrop-blur-sm z-50">
                                <a href="/login" class="transition ease-in-out text-white font-bold hover:bg-gray-700 py-2 px-4 rounded-lg">Login</a>
                                <a href="/signup" class="transition ease-in-out text-white font-bold bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg">Registro</a>
                            </div>
                                
                            <div class="hidden md:flex flex-row gap-4">
                                <a href="/login/" class="transition ease-in-out text-white font-bold hover:bg-gray-700 py-2 px-4 rounded-lg">Login</a>
                                <a href="/signup/" class="transition ease-in-out text-white font-bold bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg shadow-md">Registro</a>
                            </div>
                        </div>`;
};

const createNavSignunp = () => {
    navbar.innerHTML = `<div class="max-width-7xl h-16 mx-auto flex items-center px-4 justify-between bg-gray-800">
                            <a href="/" class="font-bold text-xl text-white tracking-wider">Game Labs</a>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 md:hidden text-white cursor-pointer p-2 rounded-lg hover:bg-gray-700">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            <div class="bg-gray-900/95 fixed top-16 right-0 left-0 bottom-0 flex justify-center items-center flex-col gap-4 hidden backdrop-blur-sm z-50">
                                <a href="/login" class="transition ease-in-out text-white font-bold hover:bg-gray-700 py-2 px-4 rounded-lg">Login</a>
                            </div>
                                
                            <div class="hidden md:flex flex-row gap-4">
                                <a href="/login/" class="transition ease-in-out text-white font-bold hover:bg-gray-700 py-2 px-4 rounded-lg">Login</a>
                            </div>
                        </div>`;
};

const createNavLogin = () => {
    navbar.innerHTML = `<div class="max-width-7xl h-16 mx-auto flex items-center px-4 justify-between bg-gray-800">
                            <a href="/" class="font-bold text-xl text-white tracking-wider">Game Labs</a>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 md:hidden text-white cursor-pointer p-2 rounded-lg hover:bg-gray-700">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            <div class="bg-gray-900/95 fixed top-16 right-0 left-0 bottom-0 flex justify-center items-center flex-col gap-4 hidden backdrop-blur-sm z-50">
                                <a href="/signup" class="transition ease-in-out text-white font-bold bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg">Registro</a>
                            </div>
                                
                            <div class="hidden md:flex flex-row gap-4">
                                <a href="/signup/" class="transition ease-in-out text-white font-bold bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg shadow-md">Registro</a>
                            </div>
                        </div>`;
};

const createNavTodos = () => {
    navbar.innerHTML = `<div class="max-width-7xl h-16 mx-auto flex items-center px-4 justify-between bg-gray-800">
                            <a href="/" class="font-bold text-xl text-white tracking-wider">Game Labs</a>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 md:hidden text-white cursor-pointer p-2 rounded-lg hover:bg-gray-700">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            <div class="bg-gray-900/95 fixed top-16 right-0 left-0 bottom-0 flex justify-center items-center flex-col gap-4 hidden backdrop-blur-sm z-50">
                                <button id="close-btn" class="transition ease-in-out text-white font-bold bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg">Cerrar Sesion</button>
                            </div>
                                
                            <div class="hidden md:flex flex-row gap-4">
                                <button id="close-btn" class="transition ease-in-out text-white font-bold bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg shadow-md">Cerrar Sesion</button>
                            </div>
                        </div>`;
};

// Lógica de rutas
if(window.location.pathname === '/') {
    createNavHome();
} else if (window.location.pathname === '/signup/') {
    createNavSignunp()
} else if (window.location.pathname === '/login/') {
    createNavLogin();
} 

// Lógica del menú hamburguesa
// Nota: Asegúrate de que estas referencias existan en el DOM generado
const navBtn = navbar.children[0].children[1]

navBtn.addEventListener( "click", e =>{
    const menuMobile = navbar.children[0].children[2] // Ajusté el índice porque quité un div extra
    
    if (!navBtn.classList.contains("active")) {
        navBtn.classList.add("active")
        navBtn.innerHTML= "<path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />"
        menuMobile.classList.remove("hidden")
        menuMobile.classList.add("flex")
    }else{
        navBtn.classList.remove("active")
        navBtn.innerHTML=  "<path stroke-linecap='round' stroke-linejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />"
        menuMobile.classList.add("hidden")
        menuMobile.classList.remove("flex")
    }
})

// Lógica de Cerrar Sesión (Logout)
// Necesitamos verificar si existen los botones antes de agregarles eventos
const closeBtnDesktop = document.querySelector('.hidden.md\\:flex #close-btn');
const closeBtnMobile = document.querySelector('.bg-gray-900\\/95 #close-btn');

if(closeBtnDesktop) {
    closeBtnDesktop.addEventListener('click', async e => {
        try {
            await axios.get('/api/logout');
            window.location.pathname = '/login';
        } catch (error) {
            console.log(error);
        }
    })
}

if(closeBtnMobile) {
    closeBtnMobile.addEventListener('click', async e => {
        try {
            await axios.get('/api/logout');
            window.location.pathname = '/login';
        } catch (error) {
            console.log(error);
        }
    })
}