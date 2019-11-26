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