const API_URL = 'https://picsum.photos/v2/list?limit=8';

async function obtenerImagenDeApi() {
  const galeriaContenedor = document.getElementById('galeria-contenedor');
  if (!galeriaContenedor) return;
  try {
    const respuesta = await fetch(API_URL);
    const datos = await respuesta.json();
    datos.forEach(imagen => {
      const imagenUrl = `https://picsum.photos/id/${imagen.id}/300/300`;
      const descripcion = `Autor: ${imagen.author}`;
      const cuadro = document.createElement('div');
      cuadro.className = 'p-2';
      const imgElement = document.createElement('img');
      imgElement.src = imagenUrl;
      imgElement.alt = descripcion;
      imgElement.className = 'rounded shadow-md w-full';
      const pElement = document.createElement('p');
      pElement.textContent = descripcion;
      pElement.className = 'text-sm text-gray-600 mt-2';
      cuadro.appendChild(imgElement);
      cuadro.appendChild(pElement);
      galeriaContenedor.appendChild(cuadro);
    });
  } catch (error) {
    console.error('Error al obtener las imagenes de la API:', error);
  }
}

document.addEventListener('DOMContentLoaded', obtenerImagenDeApi);