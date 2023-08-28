// this is the 5-day forecast url
var weatherUrl = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";
// this is the api url that gets lat and long of specific places
var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}";
// this is my api key. it goes at the end of each url
var apiKey = "3e1d2d78e1cc6cb9267d3e61fa4244d6"

var searchBar = document.querySelector("#searchBar");
var searchButton = document.querySelector("#searchButton");
var fiveDayForecast = document.querySelector("#fiveDayForecast");


function citySearch () {
    // searchBar.preventDefault();
    var city = searchBar.value.toLowerCase();
    var geoUrlPrefix = "http://api.openweathermap.org/geo/1.0/direct?q=";
    var geoUrlSuffix = "&limit=1&appid=3e1d2d78e1cc6cb9267d3e61fa4244d6";

    for (var i=0; i<city.length; i++){
        if (city[i] === " "){
            city = city.replace(city[i], "+");
        }
    }
    console.log(geoUrlPrefix + city + geoUrlSuffix);
    fetch(geoUrlPrefix + city + geoUrlSuffix)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        var weatherUrlPrefix = "https://api.openweathermap.org/data/2.5/forecast?";
        var weatherUrlSuffix = "&appid=3e1d2d78e1cc6cb9267d3e61fa4244d6&units=imperial";
        var lat = data[0].lat;
        var lon = data[0].lon;

        fetch(weatherUrlPrefix + "lat=" + lat + "&lon=" + lon + weatherUrlSuffix)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            var day = {temp: 0, wind: 0, humid: 0}
            var temp = 0;
            var date = " ";
            var count = 0;
            for (var i=0; i<data.list.length; i++) {
                temp += data.list[i].main.temp;
                
                if (date !== data.list[i].dt_txt.slice(0,10)){
                    var weatherBox = document.createElement("div");
                    var dateTitle = document.createElement("h3");
                    var weatherUl = document.createElement("ul");
                    var temperature = document.createElement("li");
                    var wind = document.createElement("li");
                    var humid = document.createElement("li");
                    var monthDay = data.list[i].dt_txt.slice(5,10);
                    var year = data.list[i].dt_txt.slice(0,4);

                    // trying to add html element that holds the 5-day forecast
                    // need to have date, projected temp, windmph, and humitity% in element
                    dateTitle.textContent = monthDay + "/" + year;
                    weatherBox.appendChild(dateTitle);
                    
                    temperature.textContent = day.temp/count;
                    weatherUl.appendChild(temperature);
                    wind.textContent = day.wind/count;
                    weatherUl.appendChild(wind);
                    humid.textContent = day.humid/count;
                    weatherUl.appendChild(humid);

                    fiveDayForecast.appendChild(weatherBox);
                    fiveDayForecast.appendChild(weatherUl);

                    day.temp = data.list[i].main.temp;
                    day.wind = data.list[i].wind.speed;
                    day.humid = data.list[i].main.humidity;
                

                    console.log(weatherUl);
                    console.log(dateTitle);
                    // weatherInfo.textContent = data.list.temp;
                    // weatherBox.appendChild.dateTitle;
                    // weatherBox.appendChild.weatherInfo;
                    // fiveDayForecast.appendChild(weatherBox);
                    // console.log(weatherInfo.textContent);
                    // console.log(dateTitle.textContent);
                    date = data.list[i].dt_txt.slice(0,10);
                    count = 1;
                }
                else {
                    day.temp += data.list[i].main.temp;
                    day.wind += data.list[i].wind.speed;
                    day.humid += data.list[i].main.humidity;

                    count++;
                    
                }
                console.log(date);

            }
            console.log(temp/data.list.length);
            console.log(data.list);
        })

    })


}

searchButton.addEventListener("click", citySearch); 