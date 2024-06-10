const apiKey = 'eadbfdb38fa148678c615752231211';
let globalTempCelsius, globalTempCelsius2, comparisonHistory = [];
const fetchWeather = async location => {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no&lang=es`);
        if (!response.ok) throw new Error(`Algo salio mal papu: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Algo salio mal papu:', error);
    }
};
const displayTemperature = (temp, element) => {
    const scale = document.getElementById('scaleSelect').value;
    const scales = {
        'celsius': `${temp} °C`,
        'fahrenheit': `${((temp * 1.8) + 32).toFixed(2)} °F`,
        'kelvin': `${(temp + 273.15).toFixed(2)} K`,
        'rankine': `${((temp + 273.15) * 1.8).toFixed(2)} °R`
    };
    element.innerText = scales[scale] || scales['celsius'];
};
const updateWeatherInfo = data => {
    const { name, region, country, localtime } = data.location;
    globalTempCelsius = parseFloat(data.current.temp_c.toFixed(2));
    document.getElementById('location').innerText = `${name}, ${region}`;
    document.getElementById('city').innerText = country;
    document.getElementById('temperature').innerText = `${globalTempCelsius} °C`;
    document.getElementById('localTime').innerText = localtime;
};
const updateComparisonInfo = data => {
    const comparisonTempC = parseFloat(data.current.temp_c.toFixed(2));
    globalTempCelsius2 = comparisonTempC;
    document.querySelector('.mainsub').innerHTML = `${data.location.name},<br> ${data.location.country}<br>${data.location.localtime}`;
    document.querySelector('.humiditytext').innerHTML = `Humidity <br>${data.current.humidity}%`;
    document.querySelector('.realfeeltext').innerHTML = `Real Feel <br>${data.current.feelslike_c}`;
    document.querySelector('.airtext').innerHTML = `Wind: <br>${data.current.wind_kph} km/h`;
    document.querySelector('.pressuretext').innerHTML = `Pressure <br>${data.current.pressure_mb} mb`;
    // Muestra la información de la segunda ubicación
    document.querySelector('.lugar2').innerText = data.location.name;
    document.querySelector('.countryv2').innerText = data.location.country;
    ['celsiusv1', 'fahrenheitv1', 'kelvinv1', 'rankinev1'].forEach(scale => document.querySelector(`.${scale}`).innerText = globalTempCelsius);
    ['celsiusv2', 'fahrenheitv2', 'kelvinv2', 'rankinev2'].forEach(scale => document.querySelector(`.${scale}`).innerText = comparisonTempC);
    document.getElementById('averageFinalGrade').innerText = `${(globalTempCelsius - comparisonTempC).toFixed(2)} °C`;
    displayTemperature(globalTempCelsius2, document.querySelector('.main'));
};
const updateHistoryDOM = () => {
    const historyContainer = document.getElementById("history");
    historyContainer.innerHTML = "";
    comparisonHistory.forEach(name => {
        const entryElement = document.createElement("div");
        entryElement.className = "history-entry";
        entryElement.innerText = name;
        entryElement.addEventListener('click', () => {
            fetchWeather(name).then(data => {
                if (data) updateComparisonInfo(data);
            });
        });
        historyContainer.appendChild(entryElement);
    });
};
document.getElementById('gradeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const comparisonLocation = document.getElementById('grade').value;
    fetchWeather(comparisonLocation).then(data => {
        if (data) {
            comparisonHistory.push(`${data.location.name} - ${data.location.country} | ${data.location.localtime}`);
            updateComparisonInfo(data);
            updateHistoryDOM();
        }
    });
});
fetchWeather('20.387,-99.995').then(data => {
    if (data) updateWeatherInfo(data);
});
document.getElementById('scaleSelect').addEventListener('change', () => {
    displayTemperature(globalTempCelsius, document.querySelector('#temperature'));
    if (globalTempCelsius2 !== undefined) displayTemperature(globalTempCelsius2, document.querySelector('.main'));
});
