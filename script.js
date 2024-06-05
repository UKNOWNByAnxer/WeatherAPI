const apiKey = 'eadbfdb38fa148678c615752231211';
let globalTempCelsius;
let globalTempCelsius2;

// Función para obtener el clima actual de una ubicación específica
async function getCurrentWeather(location) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no&lang=es`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error obteniendo el clima:', error);
    }
}

// Función para actualizar la escala de temperatura
function changeTemperatureScale() {
    const display = document.querySelector('#temperature');
    const scale = document.getElementById('scaleSelect').value;
    if (globalTempCelsius !== null) {
        let comparisonText = '';
        switch (scale) {
            case 'celsius':
                comparisonText = `${globalTempCelsius} °C`;
                break;
            case 'fahrenheit':
                comparisonText = `${((globalTempCelsius * 1.8) + 32).toFixed(2)} °F`;
                break;
            case 'kelvin':
                comparisonText = `${(globalTempCelsius + 273.15).toFixed(2)} K`;
                break;
            case 'rankine':
                comparisonText = `${((globalTempCelsius + 273.15) * 1.8).toFixed(2)} °R`;
                break;
            default:
                comparisonText = `${globalTempCelsius} °C`;
        }
        if(globalTempCelsius2){
            let TempC2
            switch (scale) {
                case 'celsius':
                    document.querySelector('.main').innerText = `${globalTempCelsius2.toFixed(2)} °C`;
                    break;
                case 'fahrenheit':
                    TempC2 = (globalTempCelsius2 * 1.8) + 32;
                    document.querySelector('.main').innerText = `${TempC2.toFixed(2)} °F`;
                    break;
                case 'kelvin':
                    TempC2 = globalTempCelsius2 + 273.15;
                    document.querySelector('.main').innerText = `${TempC2.toFixed(2)} K`;
                    break;
                case 'rankine':
                    TempC2 = (globalTempCelsius2 + 273.15) * 1.8;
                    document.querySelector('.main').innerText = `${TempC2.toFixed(2)} °R`;
                    break;
                default:
                    break;
            }
        }
        display.innerText = comparisonText;
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
    event.preventDefault();
    const scale = document.getElementById('scaleSelect').value;
    const comparisonLocation = document.getElementById('grade').value;

    getCurrentWeather(comparisonLocation).then(data => {
        if (data) {
            const comparisonTempC = parseFloat(data.current.temp_c.toFixed(2));
            globalTempCelsius2 = comparisonTempC;
            document.querySelector('.mainsub').innerHTML = `${data.location.name}, ${data.location.country}<br>${data.location.localtime}`;
            document.querySelector('.humiditytext').innerHTML = `Humidity <br>${data.current.humidity}%`;
            document.querySelector('.realfeeltext').innerHTML = `Real Feel <br>${data.current.feelslike_c}`;
            document.querySelector('.airtext').innerHTML = `Wind: <br>${data.current.wind_kph} km/h`;
            document.querySelector('.pressuretext').innerHTML = `Pressure <br>${data.current.pressure_mb} mb`;
            document.querySelector('.celsiusv1').innerText = globalTempCelsius;
            document.querySelector('.fahrenheitv1').innerText = (globalTempCelsius * 1.8 + 32).toFixed(2);
            document.querySelector('.kelvinv1').innerText = (globalTempCelsius + 273.15).toFixed(2);
            document.querySelector('.rankinev1').innerText = ((globalTempCelsius + 273.15) * 1.8).toFixed(2);
            document.querySelector('.lugar2').innerText = data.location.name;
            document.querySelector('.countryv2').innerText = data.location.country;
            document.querySelector('.celsiusv2').innerText = comparisonTempC;
            document.querySelector('.fahrenheitv2').innerText = (comparisonTempC * 1.8 + 32).toFixed(2);
            document.querySelector('.kelvinv2').innerText = (comparisonTempC + 273.15).toFixed(2);
            document.querySelector('.rankinev2').innerText = ((comparisonTempC + 273.15) * 1.8).toFixed(2);
            const diffCelsius = (globalTempCelsius - comparisonTempC).toFixed(2);
            document.getElementById('averageFinalGrade').innerText = `${diffCelsius} °C`;
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
                    break;
            }
        }
    });
});
