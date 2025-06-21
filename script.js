let cityInput = document.getElementById("city_input");
searchButton = document.getElementById("search_button");
apiKey = "06a6cd36ec4a6b9f3526562f190d9393";
currentWeatherCard = document.querySelectorAll(".weather-left .card")[0];
fiveDaysForecastCard = document.querySelector(".day-forecast");

function getWeatherDetails(name, lat, lon, country, state) {
  let forecast_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    weather_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

  fetch(weather_API_URL).then((res) => res.json()).then((data) => {
        let date = new Date();
        currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                </div>
            </div>
            <hr>
             <div class="card-footer">
                <p><i class="fa-light fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</p>
                <p><i class="fa-light fa-location-dot"></i> ${name}, ${country}</p>
            </div>
        `;
    }).catch(() => {
      alert(`failed to fetch weather details`);
    });

    fetch(forecast_API_URL).then((res) => res.json()).then((data) => {
        let uniqueForecastDays = [];
        let fiveDaysForecast = data.list.filter( forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);  
            }
        });
        fiveDaysForecastCard.innerHTML = '';
        for(i = 1; i < fiveDaysForecast.length; i++) {
            let date = new Date(fiveDaysForecast[i].dt_txt);
            fiveDaysForecastCard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
                            <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                    </div>
                        <p> ${date.getDate()} ${months[date.getMonth()]}</p>
                        <p> ${days[date.getDay()]}</p>
                </div>
            `;
        }
    }).catch(() => {
      alert(`failed to fetch weather forecast details`);
    });
}

function getCityCoordinates() {
  let cityName = cityInput.value.trim();
  cityInput.value = "";
  if (!cityName) return;
  let geoCoding_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}
    &limit=1&appid=${apiKey}`;
  fetch(geoCoding_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let { name, lat, lon, country, state } = data[0];
      getWeatherDetails(name, lat, lon, country, state);
    })
    .catch(() => {
      alert(`Error fetching data for ${cityName}. Please try again.`);
    });
}

searchButton.addEventListener("click", getCityCoordinates);
