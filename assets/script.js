var searchBar = document.querySelector("#searchBar");
var searchButton = document.querySelector("#searchButton");
var fiveDayForecast = document.querySelector("#fiveDayForecast");
var currentWeather = document.querySelector("#currentWeather");
var historyList = document.querySelector("#historyList");

function saveHistory(place) {
    var storageList = JSON.parse(localStorage.getItem("search history"));
    console.log(storageList);

    if (place.includes(",")) {
        place = place.replace(", ", "-");
        place = place.slice(0,-1) + place.slice(-1).toUpperCase();
        console.log(place);
    }

    if (storageList === null) {
        localStorage.setItem("search history", JSON.stringify(place));
    }
    else {
        storageList = storageList.split(",");
        console.log(storageList.length);
        if (storageList.length > 5){
            storageList.shift();
            console.log(storageList);
            localStorage.setItem("search history", JSON.stringify(storageList + ", " + place));
        }
        else {
            console.log(storageList);
            localStorage.setItem("search history", JSON.stringify(storageList + ", " + place));
        }
    }
}

function showHistory() {
    if (localStorage.getItem("search history") !== null) {
        var storageString = JSON.parse(localStorage.getItem("search history"));
        console.log(storageString);
        var storageList = storageString.split(",");
        // console.log(storageList);
           
        for (var i=0; i<storageList.length; i++) {
            var history = document.createElement("button");
            var place = storageList[i];
            if (place.includes("-")) {
                place = place.replace("-", ", ");
            }
            history.textContent = place;
            historyList.appendChild(history);
        }   
    }
}

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

        currentWeatherTitle.textContent = data.name + " (today)";

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


function fiveDayBuild(data) {
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
    return fiveDayForecast;
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
        console.log(data);
        if (data.length === 0) {
            var errorText = document.createElement("p");
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

showHistory();

searchButton.addEventListener("click", citySearch); 
document.addEventListener("keypress", function(event){
    if (event.key === "Enter"){
        citySearch();
    }
});

historyList.addEventListener("click", function(event){
    searchBar.value = event.target.textContent;
    citySearch();

});





// style the whole page better and add media queries
