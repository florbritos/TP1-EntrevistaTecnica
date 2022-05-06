const API_KEY_WEATHER = "ee67d1c26549be7b76ad1d16d6bd52b3";
const API_KEY_MAP = "AIzaSyC_bGOWgI8oM-nNawOb4AP4MQu5oRHOZLk";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";


const button = document.getElementById('sendButton');
const inputLugar = document.getElementById('lugar');
const resultado = document.getElementById('resultado');
let mapaDiv = document.getElementById('mapa');

button.addEventListener("click", ()=>{
    const lugarValor = inputLugar.value;
    console.log('Lugar:', lugarValor);
    weatherSearch(lugarValor);
});

let lugar;
let weatherStorage;

if (localStorage.weatherStorage) {
    weatherStorage = JSON.parse(localStorage.weatherStorage);
    lugarValor=weatherStorage.name;
    weatherSearch(lugarValor);
} else {
    localStorage.weatherStorage = JSON.stringify(lugar);
}

function weatherSearch(lugarValor){
    fetch(`${WEATHER_URL}?q=${lugarValor}&APPID=${API_KEY_WEATHER}&units=metric&lang=es`)

    .then(function(response){
        
        return response.json(); // esto convierte la response cruda del fetch en json

    }).then(function(json){

        console.log('response json del weather', json); // veo el contenido del JSON en consola
        
        let urlicono = `https://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;

        localStorage.weatherStorage = JSON.stringify(json);

        generarMapa(json);
        armarHTML(json, urlicono);

    }).then(function(){
        console.log('termine, che');
    })
    .catch(function(err){
        console.log("Something went wrong", err);
    });

}



function generarMapa(parseResponse){

    let urlmapa=`https://www.google.com/maps/embed/v1/place?key=${API_KEY_MAP}&q=${parseResponse.name}+${parseResponse.sys.country}`;

    let iframe= document.getElementById('iframe1');

        if (iframe){
            iframe.remove();
        }

        var iDiv = document.createElement('iframe');
        iDiv.id = 'iframe1';
        iDiv.src = urlmapa;
        mapaDiv.append(iDiv);       

}



function armarHTML(parseResponse, icono){

    let html;

    html=`

        <h2 class="mt-2 col-12 text-center">${parseResponse.name}, ${parseResponse.sys.country}</h2>
        <img class="col-12" src="${icono}" alt=${parseResponse.weather[0].description}/>
        <ul class="text-center">
            <li>Temperatura máxima:<span> ${parseResponse.main.temp_max}</span> °C</li>
            <li>Temperatura mínima:<span> ${parseResponse.main.temp_min}</span> °C</li>
            <li>Humedad:<span> ${parseResponse.main.humidity}</span> %</li>
            <li>Sensación Térmica:<span> ${parseResponse.main.feels_like}</span> °C</li>
            <li>Presión atmosférica:<span> ${parseResponse.main.pressure}</span> hPa </li>
            <li>Velocidad del viento:<span> ${parseResponse.wind.speed}</span> m/s </li>
        </ul>
    `

    resultado.innerHTML=html;
}



