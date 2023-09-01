var searchBar = document.querySelector("#searchBar");
var searchButton = document.querySelector("#searchButton");
var fiveDayForecast = document.querySelector("#fiveDayForecast");
var currentWeather = document.querySelector("#currentWeather");
var historyList = document.querySelector("#historyList");
var historyBtn = document.querySelector(".history");

// this function records searched cities into local storage
// it allows searches using city and country code ex. Paris, Fr
function saveHistory(place) {
    var storageList = JSON.parse(localStorage.getItem("search history"));

    if (place.includes(", ")) {
        place = place.replace(", ", "-");
        place = place.slice(0,-1) + place.slice(-1).toUpperCase();
    }

    if (place.includes(",")) {
        place = place.replace(",", "-");
        place = place.slice(0,-1) + place.slice(-1).toUpperCase();
    }

    if (storageList === null) {
        localStorage.setItem("search history", JSON.stringify(place));
    }
    else {
        storageList = storageList.split(",");
        if (storageList.length > 5){
            storageList.shift();
            localStorage.setItem("search history", JSON.stringify(storageList + ", " + place));
        }
        else {
            localStorage.setItem("search history", JSON.stringify(storageList + ", " + place));
        }
    }
}

// this function displays the names of the cities in the local storage as buttons and re-formats the name of the city and country code
function showHistory() {
    if (localStorage.getItem("search history") !== null) {
        var storageString = JSON.parse(localStorage.getItem("search history"));
        var storageList = storageString.split(",");
           
        for (var i=0; i<storageList.length; i++) {
            var history = document.createElement("button");
            var place = storageList[i];
            if (place.includes("-")) {
                place = place.replace("-", ", ");
            }
            history.classList.add("history");
            history.textContent = place;
            historyList.appendChild(history);
            history.addEventListener("click", function(event){
                searchBar.value = event.target.textContent;
                citySearch();
            });
        }   
    }
    
}

// this function returns the url for open weather's geo api that will return the latitude and longitude of the searched city
function getGeoUrl(place) {
    var city = place.toLowerCase();
    var geoUrlPrefix = "https://api.openweathermap.org/geo/1.0/direct?q=";
    var geoUrlSuffix = "&limit=1&appid=3e1d2d78e1cc6cb9267d3e61fa4244d6";

    for (var i=0; i<city.length; i++){
        if (city[i] === " "){
            city = city.replace(city[i], "+");
        }
    }
    return geoUrlPrefix + city + geoUrlSuffix;
}

// this function uses the latitude and longitude of the searched city that was returned from the geo api
// it generates the url used to fetch the 5-day forecast from openweather api
function getFiveDayUrl(data) {
    var weatherUrlPrefix = "https://api.openweathermap.org/data/2.5/forecast?";
    var weatherUrlSuffix = "&appid=3e1d2d78e1cc6cb9267d3e61fa4244d6&units=imperial";
    var lat = data[0].lat;
    var lon = data[0].lon;
    return weatherUrlPrefix + "lat=" + lat + "&lon=" + lon + weatherUrlSuffix;
}

// this function also uses the lat and lon of the searched city provided by the geo api
// it generates the url used to fetch the current weather data from the open weather api
function getCurrentWeatherUrl(data) {
    var currentWeatherPrefix = "https://api.openweathermap.org/data/2.5/weather?";
    var currentWeatherSuffix = "&appid=3e1d2d78e1cc6cb9267d3e61fa4244d6&units=imperial";
    var lat = data[0].lat;
    var lon = data[0].lon;
    return currentWeatherPrefix + "lat=" + lat + "&lon=" + lon + currentWeatherSuffix;
}

// this function takes the data provided by the current weather api call and displays today's weather for the searched city on the page
function currentDayBuild(data) {
    if (currentWeather.children.length !== 0){
        currentWeather.removeChild(currentWeather.lastChild);
    }
        
        var div = document.createElement("div");
        var currentWeatherTitle = document.createElement("h2");
        var ul = document.createElement("ul");
        var liTemp = document.createElement("li");
        var liWind = document.createElement("li");
        var liHumid = document.createElement("li");
        var weatherIcon = document.createElement("li");

        currentWeatherTitle.textContent = data.name + dayjs().format(" (M/D/YYYY)");

        if (data.weather[0].main === "Clouds") {
            weatherIcon.textContent = "\u2601";
        }
        else if (data.weather[0].main === "Rain") {
            weatherIcon.textContent = "\uD83C\uDF27";
        }
        else if (data.weather[0].main === "Snow") {
            weatherIcon.textContent = "\u2603";
        }
        else {
            weatherIcon.textContent = "\uD83C\uDF1E";
        }

        liTemp.textContent = "Temp: " + data.main.temp + "\u2109";
        liWind.textContent = "Wind: " + data.wind.speed + "mph";
        liHumid.textContent = "Humidity: " +data.main.humidity + "%";

        div.appendChild(currentWeatherTitle);
        ul.appendChild(weatherIcon);
        ul.appendChild(liTemp);
        ul.appendChild(liWind);
        ul.appendChild(liHumid);
        div.appendChild(ul);
        currentWeather.appendChild(div);
        currentWeather.style.border = "2px solid maroon";

        return currentWeather
    
}

// this function uses the information provided by the 5-day forecast api call to display the forecast for the next five days for the searched city
function fiveDayBuild(data) {
    var day = {temp: 0, wind: 0, humid: 0};
    var date = " ";
    var count = 0;
    
    document.querySelector("#fiveDayTitle").textContent = "Five-Day Forecast:";

    for (var i=0; i<data.list.length; i++) { 
        if (date !== data.list[i].dt_txt.slice(0,10)){
                    
            var dateTitle = document.createElement("h4");
            var weatherBox = document.createElement("div");
            var weatherUl = document.createElement("ul");
            var temperature = document.createElement("li");
            var wind = document.createElement("li");
            var humid = document.createElement("li");
            var dayNumber = data.list[i].dt_txt.slice(8,10);
            var month = data.list[i].dt_txt.slice(5,7);
            var year = data.list[i].dt_txt.slice(0,4);
            var weatherIcon = document.createElement("li");

            dateTitle.textContent = month + "/" + dayNumber + "/" + year;
            weatherBox.appendChild(dateTitle);

            if (data.list[i].weather[0].main === "Clouds") {
                weatherIcon.textContent = "\u2601";
            }
            else if (data.list[i].weather[0].main === "Rain") {
                weatherIcon.textContent = "\uD83C\uDF27";
            }
            else if (data.list[i].weather[0].main === "Snow") {
                weatherIcon.textContent = "\u2603";
            }
            else {
                weatherIcon.textContent = "\uD83C\uDF1E";
            }
                    
            // formats each 5-day weather box
            weatherUl.appendChild(weatherIcon);
            temperature.textContent = "Temp: " + (day.temp/count).toFixed(2) + "\u2109";
            weatherUl.appendChild(temperature);
            wind.textContent = "Wind: " + (day.wind/count).toFixed(2) + "mph";
            weatherUl.appendChild(wind);
            humid.textContent = "Humidity: " + (day.humid/count).toFixed(2) + "%";
            weatherUl.appendChild(humid);
            weatherBox.appendChild(weatherUl);

            // attaches the above elements to the actual document
            fiveDayForecast.appendChild(weatherBox);


            // keeps track of hourly weather to get daily averages
            day.temp = data.list[i].main.temp;
            day.wind = data.list[i].wind.speed;
            day.humid = data.list[i].main.humidity;            
            // this sets the date that is being compared
            date = data.list[i].dt_txt.slice(0,10);
            // this keeps track of the amount of timestamps per day provided by the api
            // using count as denominator for temp, wind, and humid averages using info above
            count = 1;
            console.log(date);
        }
        else {
            // this adds to the daily weather totals
            day.temp += data.list[i].main.temp;
            day.wind += data.list[i].wind.speed;
            day.humid += data.list[i].main.humidity;
            // this adds an index everytime an hour in the same day is recorded
            count++;
                    
        }                
    }
    // this keeps the current day off the five day forecast
    if (fiveDayForecast.children.length > 6){
        fiveDayForecast.children[1].remove();
    }
    return fiveDayForecast;
}

// this function uses all of the above functions to fetch info from the three different api urls and use them as needed
// it also includes some error handling
function citySearch () {
    saveHistory(searchBar.value);
    while (fiveDayForecast.children[1]) {
        fiveDayForecast.removeChild(fiveDayForecast.lastChild);
    }
    fetch(getGeoUrl(searchBar.value))
    .then(function(response){
        if (response.status !== 200) {
            location.reload();
          }
            return response.json();
    })
    .then(function(data){
        if (data.length === 0) {
            var errorText = document.createElement("p");
            currentWeather.removeChild(currentWeather.lastChild);
            errorText.textContent = "Please enter a valid city";
            currentWeather.appendChild(errorText);
            return
        }

        fetch(getCurrentWeatherUrl(data))
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            currentDayBuild(data);
        })
        
        fetch(getFiveDayUrl(data))
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            fiveDayBuild(data);
        })
    })
}

// this function calls when the page is loaded
// it displays the last seven items in the search history
showHistory();

// this is the event listener for clicks on the search button
searchButton.addEventListener("click", citySearch); 

// this makes it so the enter key can be used to trigger the citySearch() function call
document.addEventListener("keypress", function(event){
    if (event.key === "Enter"){
        citySearch();
    }
});







