const searchButton = document.querySelector(".search-btn");
const  cityInput = document.querySelector(".city-input");
const currentWeatherCard = document.querySelector(".current-weather");
const weatherCards = document.querySelector(".weather-cards");

const API_KEY = "ec64e1b553976fd4810b2ba7a8e8b0c8";


const createWeatherCard = (cityName, weatherItem, index) => {
    if (index == 0) 
    {
        return `
        <div class="details">
            <div class="details">
                <h2> ${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Wind: ${weatherItem.wind.speed}M/s</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </div>
            <div class="icon">
                <img src=" https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather icon">
                <h4>${weatherItem.weather[0].description}</h4>
            </div>
        </div>
    `;
    }
    else
    {
        return `
        <li class="card">
            <h2>${weatherItem.dt_txt.split(" ")[0]}</h2>
            <img src=" https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather icon">
            <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
            <h4>Wind:  ${weatherItem.wind.speed}M/s</h4>
            <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        </li>`;
    }   
    
}

const getWeatherData = (name, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            //  Filter the forecast to get only one forecast per day
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => 
                {
                    const foreCastDate = new Date(forecast.dt_txt).getDate();
                    if (!uniqueForecastDays.includes(foreCastDate)) {
                        return uniqueForecastDays.push(foreCastDate);
                    }
                });
            
            cityInput.value = "";
            currentWeatherCard.innerHTML = "";
            weatherCards.innerHTML = "";
            fiveDaysForecast.forEach((weatherItem, index) => {
                if (index === 0)
                {
                    currentWeatherCard.insertAdjacentHTML("beforeend", createWeatherCard(name, weatherItem, index));
                }
                else
                {
                    weatherCards.insertAdjacentHTML("beforeend", createWeatherCard(name, weatherItem, index));
                }
            })
        })
        .catch(err => {
            console.log(`An error occured while fetching the data: ${err}`);
        });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();    //  Get user entered city name and remove extra spaces

    if (!cityName) return alert("Please enter a city name.");

    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
    
    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (data.length == 0) return alert("City not found");
            const { name, lat, lon } = data[0]; //  Get city name, latitude and longitude
            getWeatherData(name, lat, lon);
        })
        .catch(err => {
            console.log(`An error occured while fetching the data: ${err}`);
        });
}

searchButton.addEventListener("click", getCityCoordinates);