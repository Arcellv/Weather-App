let cityInput = document.getElementById("city_input");
searchButton = document.getElementById("search_button");
locationButton = document.getElementById("location_button");
apiKey = "06a6cd36ec4a6b9f3526562f190d9393";
currentWeatherCard = document.querySelectorAll(".weather-left .card")[0];
fiveDaysForecastCard = document.querySelector(".day-forecast");
apiCard = document.querySelectorAll(".highlights .card")[0];
humidityValue = document.getElementById("humidityVal");
pressureValue = document.getElementById("pressureVal");
visibilityValue = document.getElementById("visibilityVal");
windSpeedValue = document.getElementById("windSpeedVal");
feelsValue = document.getElementById("feelsVal");
hourlyForecastCard = document.querySelector(".hourly-forecast");
sunriseCard = document.querySelectorAll(".highlights .card")[1];

apiList = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

function getWeatherDetails(name, lat, lon, country, state) {
  let forecast_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    weather_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    air_pollution_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  (days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]),
    (months = [
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
    ]);

  fetch(air_pollution_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
      apiCard.innerHTML = `
        <div class="card-head">
            <p>Air Quality Index</p>
            <p class="air-index aqi-${data.list[0].main.aqi}">${
        apiList[data.list[0].main.aqi - 1]
      }</p>
                    </div>
                    <div class="air-indices">
                        <i class="fa-regular fa-wind fa-3x"></i>
                        <div class="item">
                            <p>PM2.5</p>
                            <h2>${pm2_5}</h2>
                        </div>
                        <div class="item">
                            <p>PM10</p>
                            <h2>${pm10}</h2>
                        </div>
                        <div class="item">
                            <p>SO2</p>
                            <h2>>${so2}</h2>
                        </div>
                        <div class="item">
                            <p>CO</p>
                            <h2>>${co}</h2>
                        </div>
                        <div class="item">
                            <p>NO</p>
                            <h2>>${no}</h2>
                        </div>
                        <div class="item">
                            <p>NH3</p>
                            <h2>>${nh3}</h2>
                        </div>
                        <div class="item">
                            <p>O3</p>
                            <h2>>${o3}</h2>
                        </div>
                    </div>
      `;
    })
    .catch(() => {
      alert(`failed to fetch air pollution details`);
    });

  fetch(weather_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let date = new Date();
      currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${
                      data.weather[0].icon
                    }@2x.png" alt="">
                </div>
            </div>
            <hr>
             <div class="card-footer">
                <p><i class="fa-light fa-calendar"></i> ${
                  days[date.getDay()]
                }, ${date.getDate()}, ${
        months[date.getMonth()]
      } ${date.getFullYear()}</p>
                <p><i class="fa-light fa-location-dot"></i> ${name}, ${country}</p>
            </div>
        `;
      let { sunrise, sunset } = data.sys;
      let { timezone, visibility } = data,
      {humidity, pressure, feels_like} = data.main,
      {speed} = data.wind,
      sunriseTime = moment
        .utc(sunrise, "x")
        .add(timezone, "seconds")
        .format("hh:mm A");
      sunsetTime = moment
        .utc(sunset, "x")
        .add(timezone, "seconds")
        .format("hh:mm A");
      sunriseCard.innerHTML = `
        <div class="card-head">
                        <p>Sunrise & Sunset</p>
                    </div>
                    <div class="sunrise-sunset">
                        <div class="item">
                            <div class="icon">
                                <i class="fa-light fa-sunrise fa-4x"></i>
                            </div>
                            <div>
                                <p>Sunrise</p>
                                <h2>${sunriseTime}</h2>
                            </div>
                        </div>
                        <div class="item">
                            <div class="icon">
                                <i class="fa-light fa-sunset fa-4x"></i>
                            </div>
                            <div>
                                <p>Sunset</p>
                                <h2>${sunsetTime}</h2>
                            </div>
                        </div>
                    </div>
      `;
      humidityValue.innerHTML = `${humidity}%`;
      pressureValue.innerHTML = `${pressure} hPa`;
      visibilityValue.innerHTML = `${(visibility / 1000).toFixed(1)} km`;
      windSpeedValue.innerHTML = `${speed} m/s`;
      feelsValue.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
    })
    .catch(() => {
      alert(`failed to fetch weather details`);
    });

  fetch(forecast_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let hourlyForcast = data.list;
      hourlyForecastCard.innerHTML = '';
      for(i = 0; i <= 7; i++) {
        let hourForecastDate = new Date(hourlyForcast[i].dt_txt);
        let hour = hourForecastDate.getHours();
        let a = 'PM';
        if(hour < 12) a = 'AM';
        if(hour == 0) hour = 12;
        if(hour > 12) hour = hour - 12;
        hourlyForecastCard.innerHTML += `
          <div class="card">
                    <p> ${hour} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyForcast[i].weather[0].icon}.png" alt="">
                    <p>${(hourlyForcast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                </div>
        `;
      }
      let uniqueForecastDays = [];
      let fiveDaysForecast = data.list.filter((forecast) => {
        let forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });
      fiveDaysForecastCard.innerHTML = '';
      for (i = 1; i < fiveDaysForecast.length; i++) {
        let date = new Date(fiveDaysForecast[i].dt_txt);
        fiveDaysForecastCard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/${
                          fiveDaysForecast[i].weather[0].icon
                        }.png" alt="">
                            <span>${(
                              fiveDaysForecast[i].main.temp - 273.15
                            ).toFixed(2)}&deg;C</span>
                    </div>
                        <p> ${date.getDate()} ${months[date.getMonth()]}</p>
                        <p> ${days[date.getDay()]}</p>
                </div>
            `;
      }
    })
    .catch(() => {
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
      alert(`Error fetching coordinates of ${cityName}`);
    });
}

function getUserCoordinates(){
  navigator.geolocation.getCurrentPosition(position =>{
    let{latitude, longitude} = position.coords;
    let reverseGeoCoding_API_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

    fetch(reverseGeoCoding_API_URL).then(res => res.json()).then(data => {
      let { name, country, state } = data[0];
      getWeatherDetails(name, latitude, longitude, country, state);
    }).catch(() => {
      alert(`Error fetching user coordinates`);
    });
  }, error =>{
    if(error.code === error.PERMISSION_DENIED) {
      alert("Geolocation permission denied. Please reset location permission to grant access again.");
    }
  });
  
}


searchButton.addEventListener("click", getCityCoordinates);
locationButton.addEventListener("click", getUserCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
window.addEventListener("load", getUserCoordinates);