// variables iniciales y seleccion del DOM

const API_KEY = "6a51fc0e1b404bfaa32235140251911";

const form = document.getElementById("searchForm");
const input = document.getElementById("cityInput");
const errorBox = document.getElementById("error");
const currentWeather = document.getElementById("currentWeather");
const forecastBox = document.getElementById("forecast");
// Cargar ultima ciudad guardada
// Busco en localstorage la ultima ciudad buscada y si existe, hago la consulta automaticamente al cargar la pagina
window.onload = () => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) fetchWeather(lastCity);
};
// evento de submit en el formulario
// evito que el formulario recargue la pagina con preventdefault y despues se toma lo ingresado en el input para hacer la consulta
// por ultimo llama a funcion de consulta del clima fetchWeather
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = input.value.trim();
    fetchWeather(city);
});

// funcion para consultar el clima
// primero limpia mensajes de error y muestra un mensaje de carga
// despues construye la url de la api con la ciudad ingresada y hace la consulta con fetch
// si la respuesta no es ok, lanza un error
// si la ciudad existe entonces guarda la ciudad en localstorage y llama a las funciones que dibujan la informacion en pantalla 
// en caso de error muestra el mensaje correspondiente
async function fetchWeather(city) {
    try {
        errorBox.classList.add("hidden");
        currentWeather.innerHTML = "Cargando...";
        forecastBox.innerHTML = "";

        const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&lang=es`;

        const res = await fetch(url);

        if (!res.ok) throw new Error("No se encontró la ciudad. Intenta otra vez.");

        const data = await res.json();

        localStorage.setItem("lastCity", city);

        renderCurrentWeather(data);
        renderForecast(data.forecast.forecastday);

    } catch (err) {
        currentWeather.innerHTML = "";
        forecastBox.innerHTML = "";
        errorBox.textContent = err.message;
        errorBox.classList.remove("hidden");
    }
}

// mostrar el clima actual
//incerta en el html el nombre de la ciudad, temperatura, texto de la condicion y el icono correspondiente
// y actualiza el personaje segun la condicion climatica
function renderCurrentWeather(data) {
    currentWeather.innerHTML = `
        <h3>${data.location.name}, ${data.location.country}</h3>
        <p>${data.current.temp_c}°C — ${data.current.condition.text}</p>
        <img src="https:${data.current.condition.icon}">
    `;

    actualizarPersonaje(data.current.condition.text);
}

// mostrar el pronostico futuro
// recorre los tres dias del pronostico con .map()
// por cada dia muestra la fecha, el icono del clima, la temperatura maxima y minima
// .join("") une todo en un solo string para insertarlo en el html
function renderForecast(days) {
    forecastBox.innerHTML = days
        .map(day => `
            <div class="forecast-item">
                <h4>${day.date}</h4>
                <img src="https:${day.day.condition.icon}">
                <p>Máx: ${day.day.maxtemp_c}°C</p>
                <p>Mín: ${day.day.mintemp_c}°C</p>
            </div>
        `)
        .join("");
}


// esta funcion se la pedi a chatgpt porque es mucho texto repetitivo y no queria escribirla yo, ademas que no tiene que ver con el proyecto, solo queria poner a un personaje por capricho XD
function actualizarPersonaje(condicion) {
    const personajeImg = document.getElementById("personajeImg");
    const texto = condicion.toLowerCase();

    // --- LLUVIA ---
    if (
        texto.includes("lluv") ||        // lluvia ligera, lluvia moderada, lluvia fuerte
        texto.includes("chubasco") ||    // chubascos dispersos
        texto.includes("rain")           // por si llega en inglés
    ) {
        personajeImg.src = "img/character/lluvia.png";
        return;
    }

    // --- TORMENTAS ---
    if (
        texto.includes("torment") ||     // tormenta, tormenta eléctrica
        texto.includes("thunder")        // thunderstorm
    ) {
        personajeImg.src = "img/character/tormenta.png";
        return;
    }

    // --- NIEVE ---
    if (
        texto.includes("nieve") ||       // nieve ligera, fuerte, moderada
        texto.includes("snow") ||        // snow showers
        texto.includes("granizo")        // nieve granulada
    ) {
        personajeImg.src = "img/character/nieve.png";
        return;
    }

    // --- SOLEADO / DESPEJADO ---
    if (
        texto.includes("soleado") ||
        texto.includes("despejado") ||
        texto.includes("clear") ||
        texto.includes("sunny")
    ) {
        personajeImg.src = "img/character/sol.png";
        return;
    }

    // --- NUBES / NUBLADO ---
    if (
        texto.includes("nublado") ||     // nublado, muy nublado
        texto.includes("nuboso") ||
        texto.includes("cloud")          // cloudy, partly cloudy
    ) {
        personajeImg.src = "img/character/lluvia.png";
        return;
    }

    // --- NIEBLA / NEBLINA ---
    if (
        texto.includes("niebla") ||
        texto.includes("neblina") ||
        texto.includes("fog")
    ) {
        personajeImg.src = "img/character/lluvia.png";
        return;
    }

    // Si no coincide con nada, usa la imagen del sol por defecto
    personajeImg.src = "img/character/sol.png";
}
