/*
1. Portada
2. Indice
3. Introducción
4. Marco Teórico
5. Diseño
6. Bibliografía
7. Conclusiones
*/
const apiKey = 'eadbfdb38fa148678c615752231211'; // Clave de API para el servicio de WeatherAPI
let globalTempCelsius; // Variable para almacenar la temperatura global en Celsius
let globalTempCelsius2; // Variable para almacenar la temperatura comparativa en Celsius

// Función para obtener el clima actual de una ubicación específica
async function getCurrentWeather(location) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no&lang=es`; // Construcción de la URL para la solicitud de la API
    try {
        const response = await fetch(url); // Realiza la solicitud a la API
        if (!response.ok) { // Verifica si la respuesta es correcta
            throw new Error(`Error en la solicitud: ${response.status}`); // Lanza un error si la respuesta no es correcta
        }
        const data = await response.json(); // Convierte la respuesta en un objeto JSON
        return data; // Retorna los datos obtenidos
    } catch (error) {
        console.error('Error obteniendo el clima:', error); // Muestra el error en la consola
    }
}
// Función para actualizar la escala de temperatura
function changeTemperatureScale() {
    const display = document.querySelector('#temperature'); // Selecciona el elemento de visualización de temperatura
    const scale = document.getElementById('scaleSelect').value; // Obtiene el valor de la escala seleccionada del elemento de selección
    // Verifica si globalTempCelsius no es null
    if (globalTempCelsius !== null) {
        let comparisonText = ''; // Variable para almacenar el texto de la temperatura convertida
        // Determina la escala de temperatura seleccionada y convierte la temperatura global en consecuencia
        switch (scale) {
            case 'celsius':
                comparisonText = `${globalTempCelsius} °C`; // Mantiene la temperatura en Celsius
                break;
            case 'fahrenheit':
                comparisonText = `${((globalTempCelsius * 1.8) + 32).toFixed(2)} °F`; // Convierte a Fahrenheit
                break;
            case 'kelvin':
                comparisonText = `${(globalTempCelsius + 273.15).toFixed(2)} K`; // Convierte a Kelvin
                break;
            case 'rankine':
                comparisonText = `${((globalTempCelsius + 273.15) * 1.8).toFixed(2)} °R`; // Convierte a Rankine
                break;
            default:
                comparisonText = `${globalTempCelsius} °C`;
        }
        if(globalTempCelsius2){
            let TempC2
            switch (scale) {
                case 'celsius':
                    document.querySelector('.main').innerText = `${globalTempCelsius2.toFixed(2)} °C`; // Mantiene la temperatura en Celsius
                    break;
                case 'fahrenheit':
                    TempC2 = (globalTempCelsius2 * 1.8) + 32;
                    document.querySelector('.main').innerText = `${TempC2.toFixed(2)} °F`; // Convierte a Fahrenheit
                    break;
                case 'kelvin':
                    TempC2 = globalTempCelsius2 + 273.15;
                    document.querySelector('.main').innerText = `${TempC2.toFixed(2)} K`; // Convierte a Kelvin
                    break;
                case 'rankine':
                    TempC2 = (globalTempCelsius2 + 273.15) * 1.8;
                    document.querySelector('.main').innerText = `${TempC2.toFixed(2)} °R`; // Convierte a Rankine
                    break;
                default:
                    break;
            }
        }
        display.innerText = comparisonText; // Muestra la temperatura global en la escala seleccionada
    }
}
// Llamada inicial para obtener y mostrar el clima
getCurrentWeather('20.387,-99.995').then(data => {
    if (data) {
        const name = data.location.name;
        const region = data.location.region;
        const country = data.location.country;
        const localtime = data.location.localtime;
        globalTempCelsius = parseFloat(data.current.temp_c.toFixed(2));
        document.getElementById('location').innerText = `${name}, ${region}`;
        document.getElementById('city').innerText = country;
        document.getElementById('temperature').innerText = `${globalTempCelsius} °C`;
        document.getElementById('localTime').innerText = localtime;
    }
});
// Event listener para la comparación de temperaturas
document.getElementById('gradeForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
    const scale = document.getElementById('scaleSelect').value; // Obtiene la escala seleccionada
    const comparisonLocation = document.getElementById('grade').value; // Obtiene la ubicación para comparar
    // Llama a la función para obtener el clima de la ubicación de comparación
    getCurrentWeather(comparisonLocation).then(data => {
        if (data) {
            const comparisonTempC = parseFloat(data.current.temp_c.toFixed(2)); // Obtiene y formatea la temperatura en Celsius
            globalTempCelsius2 = comparisonTempC; // Actualiza la variable global para la segunda temperatura
            // Actualiza los elementos del DOM con la información obtenida
            document.querySelector('.mainsub').innerHTML = `${data.location.name},<br> ${data.location.country}<br>${data.location.localtime}`;
            document.querySelector('.humiditytext').innerHTML = `Humidity <br>${data.current.humidity}%`;
            document.querySelector('.realfeeltext').innerHTML = `Real Feel <br>${data.current.feelslike_c}`;
            document.querySelector('.airtext').innerHTML = `Wind: <br>${data.current.wind_kph} km/h`;
            document.querySelector('.pressuretext').innerHTML = `Pressure <br>${data.current.pressure_mb} mb`;
            // Muestra las temperaturas en diferentes escalas para la primera ubicación
            document.querySelector('.celsiusv1').innerText = globalTempCelsius;
            document.querySelector('.fahrenheitv1').innerText = (globalTempCelsius * 1.8 + 32).toFixed(2);
            document.querySelector('.kelvinv1').innerText = (globalTempCelsius + 273.15).toFixed(2);
            document.querySelector('.rankinev1').innerText = ((globalTempCelsius + 273.15) * 1.8).toFixed(2);
            // Muestra la información de la segunda ubicación
            document.querySelector('.lugar2').innerText = data.location.name;
            document.querySelector('.countryv2').innerText = data.location.country;
            // Muestra las temperaturas en diferentes escalas para la segunda ubicación
            document.querySelector('.celsiusv2').innerText = comparisonTempC;
            document.querySelector('.fahrenheitv2').innerText = (comparisonTempC * 1.8 + 32).toFixed(2);
            document.querySelector('.kelvinv2').innerText = (comparisonTempC + 273.15).toFixed(2);
            document.querySelector('.rankinev2').innerText = ((comparisonTempC + 273.15) * 1.8).toFixed(2);
            // Calcula y muestra la diferencia de temperatura en Celsius
            const diffCelsius = (globalTempCelsius - comparisonTempC).toFixed(2);
            document.getElementById('averageFinalGrade').innerText = `${diffCelsius} °C`;
            // Muestra la segunda temperatura global en la escala seleccionada
            switch (scale) {
                case 'celsius':
                    document.querySelector('.main').innerText = `${globalTempCelsius2.toFixed(2)} °C`;
                    break;
                case 'fahrenheit':
                    globalTempCelsius2 = (globalTempCelsius2 * 1.8) + 32;
                    document.querySelector('.main').innerText = `${globalTempCelsius2.toFixed(2)} °F`;
                    break;
                case 'kelvin':
                    globalTempCelsius2 = globalTempCelsius2 + 273.15;
                    document.querySelector('.main').innerText = `${globalTempCelsius2.toFixed(2)} K`;
                    break;
                case 'rankine':
                    globalTempCelsius2 = (globalTempCelsius2 + 273.15) * 1.8;
                    document.querySelector('.main').innerText = `${globalTempCelsius2.toFixed(2)} °R`;
                    break;
                default:
                    break; // Caso por defecto, no hace nada
            }
        }
    });
});
