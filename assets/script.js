$(document).ready(function () {
    $("#departure").datepicker({
        dateFormat: 'yy-mm-dd',
        minDate: 0
    });
});

$(document).ready(function () {
    $("#returning").datepicker({
        dateFormat: 'yy-mm-dd',
        minDate: 0
    });
});

// Variables for setting departure and return date as current when starting user input
var field = document.querySelector('#departure');
var field2 = document.querySelector('#returning');
var date = new Date();

var countryName = ''
var twoLetterCountryCode = ''
var settings = ''
var flightQuote1 = ''
var flightQuote2 = ''
var newsURL = ''
var newsArticle = ''
const newsApiKey = "2941a03c379bfc4593a62285a938be82"

// Set the departure date
// field.value = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
//     '-' + date.getDate().toString().padStart(2, 0);

// Set the returning date
// field2.value = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
//     '-' + date.getDate().toString().padStart(2, 0);

//obtain current date
    var currentDay = moment().format('YYYY-MM-DD');
console.log(currentDay);

function buildNewsURL() {
    newsURL = "https://gnews.io/api/v4/search?q=" + countryName + "&lang=en&sortby=relevance&token=" + newsApiKey;
console.log(newsURL);
    return newsURL;
};

//search buttons
$("#search-btn").on("click", function () {
    // var usersSearch = $("#users-search").val();
    var departureDate = $("#departure").val();
    var returningDate = $("#returning").val();
    var originLocation = $("#origin").val().trim();

    originLocation = window.airports[originLocation]
console.log("ORIGIN IS ", originLocation);

console.log(originLocation);
    var destinationLocation = $("#dest-location").val().trim();
    destinationLocation = window.dairports[destinationLocation]
console.log("DESTINATION IS ", destinationLocation)
console.log(destinationLocation);

console.log(departureDate);
console.log(returningDate);

    //Code for originAirport drop-down
    let dropdown = $('#origin');

    dropdown.empty();

    dropdown.append('<option selected="true" disabled>Choose Country</option>');
    dropdown.prop('selectedIndex', 0);

    // Populate dropdown with originAirport list
    // notes: getJSON not connecting with JQuery script
    // notes: url needs to be connected to JSON file
    // notes: entry needs to be corrected to pull from originAirports list also
    /* 
    $.getJSON(url, function (data) {
        $.each(data, function (key, entry) {
            dropdown.append($('<option></option>').attr('value', entry.airport).text(entry.name));
        })
    });*/

    //skyscanner api call code
    settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + originLocation + "-sky/" + destinationLocation + "-sky/" + departureDate + "?inboundpartialdate=" + returningDate,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "x-rapidapi-key": "e97df671fdmsh9c1e5a2b946b77fp11434djsn5f17923a2baa"
        },
    };

    $.ajax(settings).done(function (response) {
console.log(response);

//if response contains no data, display "No flights between origin and destination"
        if (response.Places.length === 0 || response.Quotes.length === 0) {
            return $("#travel-advisory").text("No flights between origin and destination at this time.")
        }
console.log(response.Places[0].CountryName);

        countryName = (response.Places[0].CountryName);

//Country name from destination
        if (countryName == "United States") {
            countryName = response.Places[1].CountryName;
            } else {
            countryName = response.Places[0].CountryName;
        };
console.log(countryName);

        for (i = 0; i < response.Quotes.length; i++) {
            var usCurrency = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(response.Quotes[i].MinPrice);

            $("#flight-quote" + (i + 1)).append("Option " + (i+1) + ": " + usCurrency)
        }

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
                // var advisoryMessageDisplay 
                var advisoryMessage = response.data[twoLetterCountryCode].advisory.message
                var advisoryScore = response.data[twoLetterCountryCode].advisory.score

                // Travel Advisory Levels
                //  1 Exercise normal precautions (dark blue)
                //  2 Exercise increased caution (yellow)
                //  3 Reconsider travel (orange)
                //  4 Do not travel (red)

                if (advisoryScore >= 4.5 && advisoryScore <= 5) {
                    $("#travel-advisory").css({ backgroundColor: "red", color: "white" })
                }
                if (advisoryScore >= 3.5 && advisoryScore <= 4.4) {
                    $("#travel-advisory").css({ backgroundColor: "orange", color: "black" })
                }
                if (advisoryScore >= 2.5 && advisoryScore <= 3.4) {
                    $("#travel-advisory").css({ backgroundColor: "yellow", color: "black" })
                }
                if (advisoryScore >= 0 && advisoryScore <= 2.4) {
                    $("#travel-advisory").css({ backgroundColor: "darkblue", color: "white" })
                }

                $("#travel-advisory").append(advisoryMessage)
console.log(advisoryMessage);
                var advisorySource = response.data[twoLetterCountryCode].advisory.source
                var advisorySourceLink = $("<a>").attr("href", advisorySource).text(advisorySource).attr("target", "_blank")
                $("#advisory-url").append(advisorySourceLink)
console.log(advisorySource);
            });

        var     
        newsURL = buildNewsURL();
        $.ajax({
            url: newsURL,
            method: "GET"
        }).then(function (response) {

            console.log(response);
            console.log(response.articles);

            for (var i = 0; i < 5; i++) {
                headline = (response.articles[i].title);
                story = (response.articles[i].content);
                picture = (response.articles[i].image);
                caption = (response.articles[i].description);
                storyDate = (response.articles[i].publishedAt);
                articleURL = (response.articles[i].url);
                storySource = (response.articles[i].source.name);
                console.log(headline);
                console.log(story);
                console.log(picture);
                console.log(caption);
                console.log(storyDate);
                console.log(storySource);
                
                if (i==0){
                    headline.innerHTML = headline;
                    story.innerHTML = picture;
                    storyDate1.innerHTML = storyDate;
                    if (i == 0) {
                        headline1.innerHTML = headline;
                        //picture1.innerHTML = "<img src=" + picture + ">";
                        story1.innerHTML = story;
                        caption1.innerHTML = caption;
                        storyDate1.innerHTML = storyDate;
                        articleURL1.innerHTML = articleURL;
                    }   
                };
                storySource = (response.articles[i].source.name)
console.log(headline);
console.log(story);
console.log(picture);
console.log(caption);
console.log(storyDate);
console.log(storySource);
                    if (i == 0) {
                        headline1.innerHTML = headline;
                        picture1.innerHTML = "<img src=" + picture + ">";
                        story1.innerHTML = story;
                        caption1.innerHTML = caption;
                        storyDate1.innerHTML = storyDate;
                        storySource1.innerHTML = storySource;
                    } else if (i == 1) {
                        headline2.innerHTML = headline;
                        picture2.innerHTML = "<img src=" + picture + ">";
                        story2.innerHTML = story;
                        caption2.innerHTML = caption;
                        storyDate2.innerHTML = storyDate;
                        storySource2.innerHTML = storySource;
                    } else if (i == 2) {
                        headline3.innerHTML = headline;
                        picture3.innerHTML = "<img src=" + picture + ">";
                        story3.innerHTML = story;
                        caption3.innerHTML = caption;
                        storyDate3.innerHTML = storyDate;
                        storySource3.innerHTML = storySource;
                    } else if (i == 3) {
                        headline4.innerHTML = headline;
                        picture4.innerHTML = "<img src=" + picture + ">";
                        story4.innerHTML = story;
                        caption4.innerHTML = caption;
                        storyDate4.innerHTML = storyDate;
                        storySource4.innerHTML = storySource;
                    } else if (i == 4) {
                        headline5.innerHTML = headline;
                        picture5.innerHTML = "<img src=" + picture + ">";
                        story5.innerHTML = story;
                        caption5.innerHTML = caption;
                        storyDate5.innerHTML = storyDate;
                        storySource5.innerHTML = storySource;
                    } 
                };
            });
        });
    });

window.onload = function () {
    console.log("list of objects is", window.airports)
    for (let airport in window.airports) {
        console.log(` ${airport} ==> ${airports[airport]}`)
        $('#origins').append(`<option value="${airport}">`)

    };

    for (let dairport in window.dairports) {
        $('#destinations').append(`<option value="${dairport}">`)
    };
    //$('#origins')
};