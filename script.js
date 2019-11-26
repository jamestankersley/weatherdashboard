const APIKey = "f31cfa5943316a310fa5d20c122d520d";
const lsKey = "weatherSearches"
const searchesDiv = $("#searches");
const searchInput = $("#searchInput");
const searchButton = $("#searchBtn");
const currentWeatherDiv = $("#currentWeather");
const forecastDiv = $("#forecast");
const clearBtn = $("#clear");
var storedSearches = getStoredSearches();
//variable used to store and determine if the city needs to be added to the search history
var addedCity = newCity();
//unit variables for future development of switching between unit systems.
const metricUnits = {deg:"C", speed:"KPH"};
const impUnits = {deg:"F",speed:"MPH"};
var units = metricUnits;

function init(){

    //enable tooltips
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
    

    buildSearchHistory();

    if(storedSearches != null){
        getWeather(storedSearches[0]);
    }

    searchInput.on("keyup", function (event){
         
        if (event.key === "Enter") {
            searchButtonClicked();
        }
    });

    searchButton.on("click", searchButtonClicked );
    clearBtn.on("click",clearSearches);    
}
function buildSearchHistory(){
    
    searchesDiv.empty();
    
    if(storedSearches != null){
        storedSearches.forEach(element => {
            searchesDiv.append(
                $("<button>")
                    .text(correctCase(element.city) +", "+element.country.toUpperCase())
                    .addClass("btn btnCitySearch")
                    .on("click", function (){                        
                        getWeather(element);
                    })
            );
        });
    }
}

function searchButtonClicked(){
    
    let cityVal = searchInput.val().trim();
    let city = newCity(cityVal, null);       
    getWeather(city);
    //clear the value once the search is activated
    searchInput.val("");        
}

function getWeather(city){
    addedCity = city; 
    let queryURLCurrent = "";
    let queryURLForecast = "";

    if(city.country == null){
        queryURLCurrent = "https://api.openweathermap.org/data/2.5/weather?q="+city.city+"&units=metric&appid="+APIKey;
        queryURLForecast = "https://api.openweathermap.org/data/2.5/forecast?q="+city.city+"&units=metric&appid="+APIKey;
    }else{        
        queryURLCurrent = "https://api.openweathermap.org/data/2.5/weather?q="+city.city+","+city.country+"&units=metric&appid="+APIKey;
        queryURLForecast = "https:////api.openweathermap.org/data/2.5/forecast?q="+city.city+","+city.country+"&units=metric&appid="+APIKey;
    }
    
    performAPIGETCall(queryURLCurrent, buildCurrentWeather);
    performAPIGETCall(queryURLForecast, buildForecastWeather);    
}

function buildCurrentWeather(data){
    //console.log(data);
    if(data != null){
        console.log(units,metricUnits,data.wind.speed);
        currentWeatherDiv.empty();
        currentWeatherDiv.append(
                            $("<h3>").text(correctCase(data.name)+", "
                                    +data.sys.country.toUpperCase())
                            ,$("<h4>").text(moment.unix(data.dt).format("dddd, MMM Do YYYY"))
                            .append($("<img>").attr("src", "https://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png")
                                                .addClass("currentWeatherImg")
                                                .attr("data-toggle","tooltip")
                                                .attr("data-placement","right")                                                      
                                                .attr("title",data.weather[0].description)
                                                .tooltip())
                            ,$("<p>").text("Temperature: " + Math.round(data.main.temp) + "°"+units.deg)
                            ,$("<p>").text("Humidity: "+ data.main.humidity+"%")
                            ,$("<p>").text("Wind Speed: "+(Math.round((units === metricUnits)?(data.wind.speed*3.6):data.wind.speed))+" "+units.speed)
                            ,$("<p>").text("UV Index: ").append($("<div>").attr("id", "UVIndex"))
        );

        let UVqueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat="+data.coord.lat+"&lon="+data.coord.lon;
        
        performAPIGETCall(UVqueryURL,buildUV);

        if(addedCity.country == null){
            addedCity.country = data.sys.country;
            addedCity.city = data.name;
            addNewSearch(addedCity);
            addedCity = null;
        }
        
    }else{
        alert("Something went wrong getting current weather data, please try again");
    }            
}