 const app = require('./app');

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     //console.log(PAGE_URL);
//     console.log(`Servidor escuchando en el puerto ${PORT}`);
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    //console.log(PAGE_URL);
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});