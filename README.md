# Documentación

## 1. Weather API
![Weather API](WeatherAPI.png)

## 2. Índice
- [Introducción](#3-introducción)
- [Marco Teórico](#4-marco-teórico)
- [Diseño](#5-diseño)
    - [Función getCurrentWeather](#a-función-getcurrentweather)
    - [Función changeTemperatureScale](#b-función-changetemperaturescale)
    - [Llamada inicial getCurrentWeather](#c-llamada-inicial-getcurrentweather)
    - [Event listener para el formulario de comparación de temperaturas](#d-event-listener-para-el-formulario-de-comparación-de-temperaturas)
- [Bibliografía](#6-bibliografía)
- [Conclusiones](#7-conclusiones)

## 3. Introducción

Este documento proporciona una descripción detallada del código JavaScript proporcionado. El código está diseñado para obtener datos de clima de una ubicación específica utilizando la API de WeatherAPI y mostrar los datos en una página web.

## 4. Marco Teórico

El código hace uso de las siguientes tecnologías y conceptos:

- **JavaScript**: Se utiliza para la lógica de la aplicación y la manipulación del DOM.
- **API de WeatherAPI**: Se utiliza para obtener datos de clima actualizados.
- **HTML y CSS**: Se utilizan para estructurar y diseñar la página web respectivamente.

## 5. Diseño

El código se divide en varias partes:

### a. Función getCurrentWeather

Esta función se encarga de hacer una solicitud a la API de WeatherAPI para obtener los datos de clima de una ubicación específica.
```js
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
```


### b. Función changeTemperatureScale

Esta función actualiza la escala de temperatura mostrada en la página web según la selección del usuario. También convierte la temperatura global y la temperatura comparativa a la escala seleccionada.
```js
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
```

### c. Llamada inicial getCurrentWeather

Al cargar la página, se hace una llamada inicial a la función getCurrentWeather para obtener y mostrar los datos de clima de una ubicación predeterminada.
```js
getCurrentWeather('San Juan Del Rio, Querétaro').then(data => {
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
```


### d. Event listener para el formulario de comparación de temperaturas

Este evento se activa cuando el usuario envía el formulario para comparar temperaturas entre dos ubicaciones. Hace una solicitud a la API para obtener los datos de la segunda ubicación y muestra la comparación de temperaturas en la página.

```js
document.getElementById('gradeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const scale = document.getElementById('scaleSelect').value;
    const comparisonLocation = document.getElementById('grade').value; // Obtiene la ubicación para comparar

    getCurrentWeather(comparisonLocation).then(data => {
        if (data) {
            const comparisonTempC = parseFloat(data.current.temp_c.toFixed(2)); // Obtiene y formatea la temperatura en Celsius
            globalTempCelsius2 = comparisonTempC; // Actualiza la variable global para la segunda temperatura
            document.querySelector('.mainsub').innerHTML = `${data.location.name},<br> ${data.location.country}<br>${data.location.localtime}`;
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
                    break; // Caso por defecto, no hace nada
            }
        }
    });
});
```

## 6. Bibliografía

- Documentación de WeatherAPI: [Enlace](https://www.weatherapi.com/docs/)
- MDN Web Docs: [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- UI Verse: [1. Weather Card](https://uiverse.io/zanina-yassine/neat-starfish-50)
- UI Verse: [2. Weather Card](https://uiverse.io/Praashoo7/old-dingo-81)

## 7. Conclusiones

El código proporciona una forma eficaz de obtener y mostrar datos de clima en una página web, permitiendo al usuario comparar temperaturas entre diferentes ubicaciones y escalas de temperatura.
