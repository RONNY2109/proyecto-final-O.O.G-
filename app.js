const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const usersRouter = require("./controller/users");
const loginRouter = require("./controller/login");
const productRouter = require("./controller/product");
//const logoutRouter = require("./controller/logout");
//const todosRouter = require("./controller/todos");

// 1. IMPORTAR MIDDLEWARES DE SEGURIDAD Y DE ROL
const { userExtractor } = require("./middleware/auth"); // Asumo que es auth.js
const { isAdmin } = require("./middleware/IsAdmin"); // Asumo que es isAdmin.js

const { MONGO_URI } = require("./config");
const productsRouter = require("./controller/product");
const app = express();

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a Mongo DB");
  } catch (error) {
    console.log(error);
  }
})();

// Middleware para parsear JSON y datos de formulario
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//RUTAS FRONTEND NO PROTEGIDAS
// Estas rutas estáticas no necesitan autenticación
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/components', express.static(path.resolve('views','components')));
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/signup', express.static(path.resolve('views', 'singup')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/inicio', express.static(path.resolve('views', 'inicio')));
app.use('/v_administrador', express.static(path.resolve('views', 'v_administrador')));
app.use('/game_labs', express.static(path.resolve('views', 'game_labs')));
app.use('/v_res', express.static(path.resolve('views', 'v_res')));
app.use('/img', express.static(path.resolve('img')));
app.use("/verify/:id/:token",express.static(path.resolve("views", "verify")))

// --------------------------------------------------------------------------------------
// 🛑 LÍNEA ELIMINADA: app.use('/v_administrador', express.static(path.resolve('views', 'v_administrador')));
// --------------------------------------------------------------------------------------

app.use(morgan("tiny"));

// --------------------------------------------------------------------------------------
// 🛡️ RUTA PROTEGIDA DEL ADMINISTRADOR
// Esta ruta reemplaza a express.static y aplica la seguridad
// --------------------------------------------------------------------------------------
app.get(
  "/v_administrador",
  userExtractor, // 1. Verifica token y adjunta req.user
  isAdmin, // 2. Verifica que req.user.IsAdmin sea true
  (req, res) => {
    // 3. Envía el archivo HTML solo si la verificación es exitosa
    res.sendFile(path.resolve("views", "v_administrador", "index.html"));
  }
);
// --------------------------------------------------------------------------------------

//RUTAS BACKEND (APIs)
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/product", productRouter);
//app.use("/api/logout", logoutRouter);
//app.use("/api/todos", userExtractor, todosRouter);

module.exports = app;


// ------------------ Código original eliminado ------------------

// require('dotenv').config();
// const path = require('path'); // <-- añadido
// const express = require('express');
// const app = express();
// const usersRouter = require("./controller/users");
// const loginRouter = require("./controller/login");
// const { MONGO_URI } = require("./config");
// const mongoose = require('mongoose');
// app.use(express.json());

// // simple logger para depuración

// (async () => {
//   try {
//     // usar la variable correcta; fallback a MONGO_URI desde config
//     await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URU_TEST || MONGO_URI);
//     console.log('Conectado a la base de datos');
//   } catch (error) {
//     console.log(error);
//   }
// })();


// app.use('/', express.static(path.resolve('views', 'home')));
// app.use('/components', express.static(path.resolve('views','components')));
// app.use('/styles', express.static(path.resolve('views', 'styles')));
// app.use('/signup', express.static(path.resolve('views', 'singup')));
// app.use('/login', express.static(path.resolve('views', 'login')));
// app.use('/inicio', express.static(path.resolve('views', 'inicio')));
// app.use('/v_administrador', express.static(path.resolve('views', 'v_administrador')));
// app.use('/game_labs', express.static(path.resolve('views', 'game_labs')));
// app.use('/img', express.static(path.resolve('img')));
// app.use("/verify/:id/:token",express.static(path.resolve("views", "verify")))

// // para verify con params, usar una ruta GET y enviar el archivo
// // app.get('/verify/:id/:token', (req, res) => {
// //   res.sendFile(path.resolve(__dirname, 'views', 'verify', 'index.html'));
// // });

// // rutas backend
// app.use('/api/users', usersRouter);
// app.use('/api/login', loginRouter)

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Servidor escuchando en el puerto ${PORT}`);
// });

// module.exports = app;