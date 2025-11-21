
const emailInput = document.querySelector("#email-input")
const passwordInput = document.querySelector("#password-input")
const form = document.querySelector("#form")
const errorText = document.querySelector("#error-text")

//tiempo de ejecucion asincrono

form.addEventListener("submit", async e => {
    e.preventDefault();
    try {
        const user = { // Cambié el nombre a userCredentials para claridad
            email: emailInput.value,
            password: passwordInput.value
        };
        
        console.log("este es el user en el login", user);
        
        const respuesta = await axios.post("/api/login", user);
        console.log(respuesta);

        // **1. OBTENER EL ROL** (Asumiendo que el backend lo envía)
        const isAdmin = respuesta.data.IsAdmin; 
        
        // **2. REDIRECCIÓN CONDICIONAL ÚNICA**
        if (isAdmin === true) {
           // console.log('si soy admin');
            
            // Si es admin, va a la página de administrador
            window.location.pathname = `/v_administrador/`;
        } else {
            // Si no es admin, va a la página de inicio normal
            // (Esta línea reemplaza la innecesaria de la línea 14)
            window.location.pathname = `/inicio/`;
        }
        
    } catch (error) {
        console.log(error);
        // Lógica para mostrar el error en la interfaz
        const errorMessage = error.response?.data?.error || error.response?.data?.message || "Error desconocido.";
        errorText.innerHTML = errorMessage;
    }
});

// **EL CÓDIGO FUERA DEL EVENTO DEBE SER ELIMINADO.**
 //if else para ir directamente a la pagina de inicio del administrador 
