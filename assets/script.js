// Variables for setting departure and return date as current when starting user input
var field = document.querySelector('#departure');
var field2 = document.querySelector('#returning');
var date = new Date();

var countryName = ''
var twoLetterCountryCode = ''
var settings = ''

// Set the departure date
field.value = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + 
    '-' + date.getDate().toString().padStart(2, 0);

// Set the returning date
field2.value = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + 
    '-' + date.getDate().toString().padStart(2, 0);

//obtain current date
var currentDay = moment().format('YYYY-MM-DD');
console.log(currentDay);

//search buttons
$("#search-btn").on("click", function () {
    // var usersSearch = $("#users-search").val();
    var departureDate = $("#departure").val();
    var returningDate = $("#returning").val();
    var originLocation = $("#origin").val().trim();
console.log(originLocation);
    var destinationLocation = $("#dest-location").val().trim();
console.log(destinationLocation);

console.log(departureDate);
console.log(returningDate);

//skyscanner api call code
    settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + originLocation + "-sky/" + destinationLocation + "-sky/" + departureDate + "?inboundpartialdate=" + returningDate,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "x-rapidapi-key": "e97df671fdmsh9c1e5a2b946b77fp11434djsn5f17923a2baa"
        }
    }

    $.ajax(settings).done(function (response) {

console.log(response);

//if response contains no data, display "No flights between origin and destination"


        countryName = (response.Places[0].CountryName);

console.log(countryName);



    //retrieve the 2-letter country code from the list
console.log(isoCountries[countryName]);

        twoLetterCountryCode = isoCountries[countryName]

        var travelAdvisoryURL = "https://www.travel-advisory.info/api?countrycode=" + twoLetterCountryCode;

        $.ajax({
            url: travelAdvisoryURL,
            method: "GET"
        })

            .then(function (response) {

// Log the travelAdvisoryURL
console.log(travelAdvisoryURL);

// Log the resulting object
console.log(response);

var advisoryMessageDisplay = $("<h3>");
$("#travel-advisory").text(advisoryMessage)= response.data.twoLetterCountryCode.advisory.message;
var advisorySource = response.data.twoLetterCountryCode.advirosy.source;
console.log(advisoryMessage);
console.log(advisorySource);

            });

//Travel Advisory Levels
//  1 Exercise normal precautions (dark blue)
//  2 Exercise increased caution (yellow)
//  3 Reconsider travel (orange)
//  4 Do not travel (red)

    const newsApiKey = "2941a03c379bfc4593a62285a938be82"

    fetch("https://gnews.io/api/v4/search?q=" + countryName + "&lang=en&sortby=relevance&token=" + newsApiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
console.log(data);
        });
console.log(response);

console.log(Object.keys(originAiport)[0]);
console.log(Object.values(originAiport)[0]);

console.log(Object.keys(isoCountries)[0]);
console.log(Object.values(isoCountries)[0]);

console.log(Object.keys(destinationAirport)[0]);
console.log(Object.values(destinationAirport)[0]);

    });
});