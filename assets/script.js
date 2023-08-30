// this is the 5-day forecast url
var weatherUrl = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";
// this is the api url that gets lat and long of specific places
var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}";
// this is my api key. it goes at the end of each url
var apiKey = "3e1d2d78e1cc6cb9267d3e61fa4244d6"

var searchBar = document.querySelector("#searchBar");
var searchButton = document.querySelector("#searchButton");
var fiveDayForecast = document.querySelector("#fiveDayForecast");
var currentWeather = document.querySelector("#currentWeather");
var historyList = document.querySelector("#historyList");

function saveHistory(place) {
    // currently saving new york as New york
    // make two worded city's second word capitalized
    place = place[0].toUpperCase() + place.slice(1);
    // placeList = [place];
    var storageList = JSON.parse(localStorage.getItem("search history"));
    if (storageList === null) {
        localStorage.setItem("search history", JSON.stringify(place));
    }
    else {
        console.log(storageList);
        var storage = storageList + ", " + place
        console.log(storage);
        localStorage.setItem("search history", JSON.stringify(storage));
    }
}

function showHistory() {
    console.log(localStorage.getItem("search history") !== null);
    if (localStorage.getItem("search history") !== null) {
        var storageString = JSON.parse(localStorage.getItem("search history"));
        var storageList = storageString.split(",");
        console.log(typeof(storageString));
        console.log(storageString);
        console.log(storageList);
        console.log(storageList.length);
    
        for (var i=0; i<storageList.length; i++) {
            var history = document.createElement("li")
            history.textContent = storageList[i];
            historyList.appendChild(history);
        }   
    }
}

function getGeoUrl(place) {
    var city = place.toLowerCase();
    var geoUrlPrefix = "http://api.openweathermap.org/geo/1.0/direct?q=";
    var geoUrlSuffix = "&limit=1&appid=3e1d2d78e1cc6cb9267d3e61fa4244d6";

    for (var i=0; i<city.length; i++){
        if (city[i] === " "){
            city = city.replace(city[i], "+");
        }
    }
    return geoUrlPrefix + city + geoUrlSuffix;
}

function getFiveDayUrl(data) {
    var weatherUrlPrefix = "https://api.openweathermap.org/data/2.5/forecast?";
    var weatherUrlSuffix = "&appid=3e1d2d78e1cc6cb9267d3e61fa4244d6&units=imperial";
    var lat = data[0].lat;
    var lon = data[0].lon;
    return weatherUrlPrefix + "lat=" + lat + "&lon=" + lon + weatherUrlSuffix;
}

function getCurrentWeatherUrl(data) {
    var currentWeatherPrefix = "https://api.openweathermap.org/data/2.5/weather?";
    var currentWeatherSuffix = "&appid=3e1d2d78e1cc6cb9267d3e61fa4244d6&units=imperial";
    var lat = data[0].lat;
    var lon = data[0].lon;
    return currentWeatherPrefix + "lat=" + lat + "&lon=" + lon + currentWeatherSuffix;
}


function citySearch () {

    saveHistory(searchBar.value);
    while (fiveDayForecast.children[1]) {
        fiveDayForecast.removeChild(fiveDayForecast.lastChild);
    }
    fetch(getGeoUrl(searchBar.value))
    .then(function(response){
        return response.json();
    })
    .then(function(data){

        fetch(getCurrentWeatherUrl(data))
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            console.log(currentWeather.children);
            if (currentWeather.children.length !== 0){
                currentWeather.removeChild(currentWeather.lastChild);
            }
            
                var div = document.createElement("div");
                var currentWeatherTitle = document.createElement("h2");
                var ul = document.createElement("ul");
                var liTemp = document.createElement("li");
                var liWind = document.createElement("li");
                var liHumid = document.createElement("li");
                console.log(data);
                console.log(Date.UTC(data.dt));

                currentWeatherTitle.textContent = data.name;
                liTemp.textContent = data.main.temp;
                liWind.textContent = data.wind.speed + "mph";
                liHumid.textContent = data.main.humidity + "%";

                div.appendChild(currentWeatherTitle);
                ul.appendChild(liTemp);
                ul.appendChild(liWind);
                ul.appendChild(liHumid);
                div.appendChild(ul);
                currentWeather.appendChild(div);
            
            
        })








        fetch(getFiveDayUrl(data))
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            var day = {temp: 0, wind: 0, humid: 0};
            var date = " ";
            var count = 0;
            console.log(data);
            document.querySelector("#fiveDayTitle").textContent = "Five-Day Forecast:";

            for (var i=0; i<data.list.length; i++) { 
                if (date !== data.list[i].dt_txt.slice(0,10)){
                    
                    var dateTitle = document.createElement("h4");
                    var weatherBox = document.createElement("div");
                    var weatherUl = document.createElement("ul");
                    var temperature = document.createElement("li");
                    var wind = document.createElement("li");
                    var humid = document.createElement("li");
                    var monthDay = data.list[i].dt_txt.slice(5,10);
                    var year = data.list[i].dt_txt.slice(0,4);


                    dateTitle.textContent = monthDay + "/" + year;
                    weatherBox.appendChild(dateTitle);
                    
                    // formats each 5-day weather box
                    temperature.textContent = (day.temp/count).toFixed(2);
                    weatherUl.appendChild(temperature);
                    wind.textContent = (day.wind/count).toFixed(2) + "mph";
                    weatherUl.appendChild(wind);
                    humid.textContent = (day.humid/count).toFixed(2) + "%";
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
                    // this keeps track of the amount of hours provided by the api
                    // using count as denominator for temp averages using info above
                    count = 1;
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
        })

    })

}

showHistory();

searchButton.addEventListener("click", citySearch); 
document.addEventListener("keypress", function(event){
    if (event.key === "Enter"){
        citySearch();
    }
});


// put weather icons using data.weather.main

// if there is time, make a new html to handle 404 errors (when the user p uts in an invalid input into search)