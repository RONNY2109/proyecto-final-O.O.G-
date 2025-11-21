// 1. Base de datos de puntajes de Hardware (Simulación de potencia)
// Los valores son arbitrarios para la simulación: 0-100 puntos
const hardwareScores = {
cpu: {
'ryzen_9_7950x': 95,
'i7_13700k': 90,
'ryzen_5_3600': 50
},
gpu: {
'rtx_4090': 100,
'rx_7900xtx': 90,
'rtx_3060': 60,
'pepito': 100
}
};

// 2. Base de datos de Juegos y sus requisitos
// 'minScore': puntaje combinado mínimo para correrlo
// 'recScore': puntaje combinado para correrlo en Alto
// 'ramMin': RAM mínima necesaria
const gamesDatabase = [
{
name: "Cyberpunk 2077",
minScore: 110, // CPU + GPU
recScore: 160,
ramMin: 16
},
{
name: "Cyberpunk 2077",
minScore: 110, // CPU + GPU
recScore: 160,
ramMin: 16
},
{
name: "Elden Ring",
minScore: 100,
recScore: 140,
ramMin: 12
},
{
name: "Starfield",
minScore: 120,
recScore: 170,
ramMin: 16
},
{
name: "Fortnite",
minScore: 60,
recScore: 100,
ramMin: 8
},
{
name: "Grand Theft Auto V",
minScore: 70,
recScore: 110,
ramMin: 8
}
];

// 3. Referencias al DOM
const form = document.querySelector('form');
const resultsContainer = document.getElementById('game-results');
const cpuSelect = document.getElementById('cpu');
const gpuSelect = document.getElementById('gpu');
const ramSelect = document.getElementById('ram');

// 4. Función principal para analizar compatibilidad
function analyzeCompatibility(e) {
e.preventDefault(); // Evita que la página se recargue

// Obtener valores seleccionados
const cpuVal = cpuSelect.value;
const gpuVal = gpuSelect.value;
const ramVal = parseInt(ramSelect.value);

// Validar que el usuario haya seleccionado todo
if (cpuVal === 'none' || gpuVal === 'none' || isNaN(ramVal)) {
alert("Por favor, selecciona todos los componentes para realizar el análisis.");
return;
}

// Calcular puntaje del sistema
const cpuScore = hardwareScores.cpu[cpuVal] || 0;
const gpuScore = hardwareScores.gpu[gpuVal] || 0;
const totalSystemScore = cpuScore + gpuScore;

// Limpiar resultados anteriores
resultsContainer.innerHTML = '';

// Generar lista de juegos analizada
gamesDatabase.forEach(game => {
const cardHTML = createGameCard(game, totalSystemScore, ramVal);
resultsContainer.innerHTML += cardHTML;
});
}

// 5. Función para crear el HTML de cada tarjeta de juego
function createGameCard(game, systemScore, systemRam) {
let status = "";
let statusClass = "";
let borderClass = "";
let bgClass = "";
let badgeClass = "";
let badgeText = "";

// Lógica de compatibilidad
const meetsRam = systemRam >= game.ramMin;
const meetsMin = systemScore >= game.minScore;
const meetsRec = systemScore >= game.recScore;

if (meetsRam && meetsRec) {
// Corre Excelente (Verde)
borderClass = "border-green-600 bg-green-50";
textClass = "text-green-800";
badgeClass = "text-green-600 bg-green-200";
badgeText = "Jugable (Ultra/Alto)";
} else if (meetsRam && meetsMin) {
// Corre Medio (Amarillo)
borderClass = "border-yellow-600 bg-yellow-50";
textClass = "text-yellow-800";
badgeClass = "text-yellow-600 bg-yellow-200";
badgeText = "Jugable (Medio/Bajo)";
} else {
// No corre bien (Rojo)
borderClass = "border-red-600 bg-red-50";
textClass = "text-red-800";
badgeClass = "text-red-600 bg-red-200";
badgeText = "No Recomendado / Lag";
}

// Retornar plantilla HTML idéntica a tu diseño original
return `
<div class="flex justify-between items-center p-3 rounded-lg border-l-4 ${borderClass} transition-all hover:shadow-md">
<span class="font-semibold ${textClass}">${game.name}</span>
<span class="text-xs font-bold px-3 py-1 rounded-full ${badgeClass}">
${badgeText}
</span>
</div>
`;
}

// 6. Event Listener
form.addEventListener('submit', analyzeCompatibility);