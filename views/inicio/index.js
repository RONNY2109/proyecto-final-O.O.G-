document.addEventListener('DOMContentLoaded',async()=>{
const contenedor=document.getElementById('componentes-contenedor');
const modalOverlay=document.getElementById('modal-overlay');
const modalContainer=document.getElementById('modal-container');
const modalCloseBtn=document.getElementById('modal-close');
const modalCartButton=document.getElementById('modal-add-to-cart-button');
const sideCartPanel=document.getElementById('side-cart-panel');
const cartItemsContainer=document.getElementById('cart-items-container');
const cartTotalElement=document.getElementById('cart-total');
const cartCountElement=document.getElementById('cart-count');
const emptyCartMessage=document.getElementById('empty-cart-message');
let COMPONENTS_DATA=[];

if(!contenedor){
console.error("Error: No se encontró el contenedor de productos.");
return;
}

// 1. CAMBIO: Capturamos también la 'description' de la base de datos
async function fetchProducts(){
try{
const response=await axios.get('/api/product');
COMPONENTS_DATA=response.data.map(product=>({
id:product.id||product._id,
name:product.name,
price:product.price,
image:product.image||'',
description: product.description || 'Sin descripción detallada disponible.' // <--- AQUI LA LEEMOS
}));
renderComponents();
}catch(error){
console.error("Error cargando productos desde la DB:",error);
COMPONENTS_DATA=[];
renderComponents();
}
}

function getProductImage(url){
if(url && url.trim() !== ''){
return url;
}
return 'https://via.placeholder.com/150?text=Sin+Imagen';
}

// Nota: Esta función ahora solo la usamos para el Rating simulado
function getProductDetails(id){
const baseRating=4.5;
return{
rating:baseRating
};
}

function generarEstrellas(rating){
const maxEstrellas=5;
let htmlEstrellas='';
const estrellasLlenas=Math.round(rating);
for(let i=0;i<estrellasLlenas;i++){
htmlEstrellas+='<span class="text-yellow-500">★</span>';
}
for(let i=estrellasLlenas;i<maxEstrellas;i++){
htmlEstrellas+='<span class="text-gray-300">★</span>';
}
return htmlEstrellas;
}

let carrito=[];
window.carrito=carrito;

window.toggleSideCart=function(){
sideCartPanel.classList.toggle('open');
if(sideCartPanel.classList.contains('open')){
renderCartItems();
}
}

function updateCartUI(){
const totalItems=carrito.reduce((sum,item)=>sum+item.cantidad,0);
const totalPrice=carrito.reduce((sum,item)=>sum+(item.price*item.cantidad),0);
cartCountElement.textContent=totalItems;
cartTotalElement.textContent=`$${totalPrice.toFixed(2)}`;
emptyCartMessage.classList.toggle('hidden',carrito.length>0);
}

function renderCartItems(){
cartItemsContainer.innerHTML='';
if(carrito.length===0){
emptyCartMessage.classList.remove('hidden');
return;
}
carrito.forEach(item=>{
const itemElement=document.createElement('div');
itemElement.className='flex items-center justify-between p-2 border rounded-lg card-bg';
const imageUrl=getProductImage(item.image);
itemElement.innerHTML=`
<div class="flex items-center space-x-3 w-3/4">
<img src="${imageUrl}" alt="${item.name}" class="w-12 h-8 object-cover rounded" />
<div class="flex flex-col">
<span class="text-sm font-medium text-gray-800 truncate">${item.name}</span>
<span class="text-xs text-gray-600">$${item.price.toFixed(2)} x ${item.cantidad}</span>
</div>
</div>
<div class="w-1/4 flex justify-end">
<button 
class="text-red-500 hover:text-red-700 text-lg font-bold"
onclick="removeFromCart('${item.id}')"
>
&times;
</button>
</div>
`;
cartItemsContainer.appendChild(itemElement);
});
updateCartUI();
}

window.removeFromCart=function(productId){
carrito=carrito.filter(item=>item.id!==productId);
renderCartItems();
updateCartUI();
}

window.addToCart=function(productId){
const product=COMPONENTS_DATA.find(p=>p.id===productId);
if(!product)return;
const existingItem=carrito.find(item=>item.id===productId);
if(existingItem){
existingItem.cantidad+=1;
}else{
carrito.push({...product,cantidad:1,image:product.image});
}
console.log(`[CARRITO] Añadido: ${product.name}`);
updateCartUI();
renderCartItems();
}

window.handleCheckout=function(){
if(carrito.length===0){
alert("El carrito está vacío. ¡Añade algunos productos primero!");
return;
}
try{
localStorage.setItem('checkoutCart',JSON.stringify(carrito));
window.location.href='/v_res/index.html';
}catch(e){
console.error("Error al guardar el carrito en localStorage:",e);
alert("No se pudo iniciar el proceso de compra. Inténtalo de nuevo.");
}
};

// 2. CAMBIO: Usamos component.description en el botón
function renderComponents(){
contenedor.innerHTML='';
if(COMPONENTS_DATA.length===0){
contenedor.innerHTML='<p class="col-span-4 text-center text-gray-500 py-10">No hay productos disponibles o cargando...</p>';
return;
}
COMPONENTS_DATA.forEach(component=>{
const productCard=document.createElement('div');
productCard.className='card-bg rounded-xl shadow-lg p-4 flex flex-col justify-between transform transition duration-500 hover:scale-[1.02]';
const details=getProductDetails(component.id); // Solo para rating
const imageUrl=getProductImage(component.image);

productCard.innerHTML=`
<div class="flex flex-col items-center">
<img src="${imageUrl}" alt="${component.name}" class="w-full h-32 object-cover rounded-lg mb-3" />
<h3 class="text-lg font-bold text-gray-800 text-center">${component.name}</h3>
<p class="text-2xl font-extrabold text-green-700 mt-1 mb-3">$${component.price.toFixed(2)}</p>
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

function cerrarModal(){
modalOverlay.classList.add('hidden');
modalContainer.classList.add('hidden');
}

// 3. CAMBIO: El modal ahora recibe la descripción real
function abrirModal(evento){
const boton=evento.currentTarget;
const productId=boton.dataset.id;
const nombre=boton.dataset.nombre;
const descripcion=boton.dataset.descripcion; // Lee del atributo data-descripcion
const calificacion=parseFloat(boton.dataset.calificacion)||0;
const imagenUrl=boton.dataset.image;
const imagenSrc=getProductImage(imagenUrl);

document.getElementById('modal-nombre').textContent=nombre;
document.getElementById('modal-imagen').src=imagenSrc;
document.getElementById('modal-descripcion').textContent=descripcion; // Muestra el texto real
document.getElementById('modal-calificacion').innerHTML=generarEstrellas(calificacion);

modalCartButton.onclick=()=>{
addToCart(productId);
cerrarModal();
};
modalOverlay.classList.remove('hidden');
modalContainer.classList.remove('hidden');
}

function asignarEventosModal(){
const botonesVer=document.querySelectorAll('.ver-caracteristicas');
botonesVer.forEach(boton=>{
boton.removeEventListener('click',abrirModal);
boton.addEventListener('click',abrirModal);
});
modalCloseBtn.addEventListener('click',cerrarModal);
modalOverlay.addEventListener('click',cerrarModal);
}

await fetchProducts();
updateCartUI();
});