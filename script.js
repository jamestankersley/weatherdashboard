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
