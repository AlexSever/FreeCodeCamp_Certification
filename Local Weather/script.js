$(document).ready(function() {

    // var iconUrl = "http://openweathermap.org/img/w/"
    var iconUrl = "img/"
    var minutes = "";

    // ==================================
    // -    Autocomplete City Search    -
    // ==================================

    // ---- Option 1: JQuery Geocomplete ----
    /*
    $("#city_search_name").geocomplete()
        .bind("geocode:result", function(event, result) {
            console.log(result);
        });
    */
    // ---- Option 2: ----   
    google.maps.event.addDomListener(window, 'load', initialize);

    function initialize() {

        var options = {
            types: ['(cities)'],
            // componentRestrictions: {country: "us"}
        };

        var input = document.getElementById('city_search_name');
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        };
    /* ---- Option 3: ----
    google.maps.event.addDomListener(window, 'load', function () {
        var places = new google.maps.places.Autocomplete(   
        (document.getElementById('city_search_name')), {
            types: ['(cities)']
        });

        google.maps.event.addListener(places, 'place_changed', function () {
            var place = places.getPlace();
            console.log(place);
            var address = place.formatted_address;
            var latitude = place.geometry.location.lat();
            var longitude = place.geometry.location.lng();
            var mesg = "Address: " + address;
            mesg += "\nLatitude: " + latitude;
            mesg += "\nLongitude: " + longitude;
            console.log(mesg);
        });
    });
    */

    // ==== Callback Function for ip-location ====
    function ipLocation(callback) {
        $.getJSON("http://ip-api.com/json", function(response) {
            callback(response);
        });
    };

    // ================================
    // -    API URL's FOR REQUESTS    -
    // ================================

    // ==== API for Geolocation ====
    function currentGeoApi(lat, lon) {

        var apiUrlCurrentGeo = "http://api.openweathermap.org/data/2.5/weather";

        apiUrlCurrentGeo += '?' + $.param({
            // 'units': metric, //For temperature in Celsius
            // 'units': imperial, //For temperature in Fahrenheit
            'lat': lat,
            'lon': lon,
            'appid': "117c340fc4778022500051af8b65c7d4"
        });
        return apiUrlCurrentGeo;
    };

    function forecastGeoApi(lat, lon) {

        var apiUrlForecastGeo = "http://api.openweathermap.org/data/2.5/forecast/daily";

        apiUrlForecastGeo += '?' + $.param({
            'lat': lat,
            'lon': lon,
            'cnt': 10,
            'mode': "json",
            'appid': "117c340fc4778022500051af8b65c7d4"
        });
        return apiUrlForecastGeo
    };    
    
    // ==== API for City Name ====
    function currentCityApi(cityForSearch) {

        var apiUrlCurrentCity = "http://api.openweathermap.org/data/2.5/weather";

        apiUrlCurrentCity += '?' + $.param({
            'q': cityForSearch,
            'appid': "117c340fc4778022500051af8b65c7d4"
        });
        return apiUrlCurrentCity;
    };

    function forecastCityApi(cityForSearch) {

        var apiUrlForecastCity = "http://api.openweathermap.org/data/2.5/forecast/daily";

        apiUrlForecastCity += '?' + $.param({
            'q': cityForSearch,
            'mode': "json",
            'cnt': 10,
            'appid': "117c340fc4778022500051af8b65c7d4"
        });
        return apiUrlForecastCity;
    };

    // ==== Checking for Errors ====
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
    } else {
        //fall back to IP location if geolocation is unavailable
        ipLocation(function(response) {
            lat = response.lat;
            lon = response.lon;
            console.log("Geolocation is not supported by this browser or disallowed. Location set by IP lookup.");
            
            displayCurrentWeather(currentGeoApi(lat, lon));

            displayDailyForecast(forecastGeoApi(lat, lon));
        });
    };

    // ==== If Geolocation Enabled ====
    function positionSuccess(position) {   
        
        var lat = position.coords.latitude,
            lon = position.coords.longitude;
        
        console.log("Location set by geolocation")
        console.log(lat, lon);
        
        // ==== API for Geographic Coordinates ====

        displayCurrentWeather(currentGeoApi(lat, lon));

        displayDailyForecast(forecastGeoApi(lat, lon));
    };

    // ==== If Geolocation Disabled ====
    function positionError(error) {
        /*
        if ($(".temperature .temp-num").length <= 1) { 
             $(".deg-sign, .btn-temp").css('display', 'none');
        }
        console.log($(".temperature .temp-num").length);
        */
        console.log("ERROR: " + error.message);

        ipLocation(function(response) {
            lat = response.lat;
            lon = response.lon;
            console.log("Geolocation is not supported by this browser or disallowed. Location set by IP lookup.");

            displayCurrentWeather(currentGeoApi(lat, lon));

            displayDailyForecast(forecastGeoApi(lat, lon));
        });
    };

    // ===========================
    // -    HELPING FUNCTIONS    -
    // ===========================

    // ==== Make String TitleCase ====    
    function titleCase(str) {
        var arr = str.toLowerCase().split(" ");
        var newArr = [];
      
        for (var i in arr) {
            newArr[i] = arr[i].replace(arr[i][0], arr[i][0].toUpperCase()); 
        };
      
        str = newArr.join(" ");
        return str;
    };

    // ==== Convert Temperature to Fahrenheit ====
    function toFahrenheit(temp) {
        return (temp * 9/5 - 459.67).toFixed(1);
    };

    // ==== Convert Temperature to Celsius ====
    function toCelsius(temp) {
        return (temp - 273).toFixed(1);
    };

    // ==== Convert mph to kph ====
    function toKPH (speed) {
        return (speed * 1.60934).toFixed(1);
    };

    // ==== Display Current Weather Function ====
    function displayCurrentWeather(apiUrl) {
        /*
        $.ajax({
            url: apiUrl,
            dataType: "jsonp",
            method: 'GET',
        }).done(function(data) {
            console.log(data);
        }).fail(function(err) {
            throw err;
            console.log("Current Weather cannot be loaded");
        });    
        */
        $.getJSON(apiUrl, function(data) {

            var longitude = data.coord.lon,
                latitude = data.coord.lat;

            var city = data.name,
                country = data.sys.country;

            var dayAndTime = data.dt;

            var weatherType = data.weather[0].main,
                weatherDescription = titleCase(data.weather[0].description),
                weatherIconId = data.weather[0].icon; 

            var clouds = data.clouds.all,
                humidity = data.main.humidity,
                windSpeed = (2.237 * (data.wind.speed)).toFixed(1),
                sunrise = new Date(data.sys.sunrise * 1000),
                sunset = new Date(data.sys.sunset * 1000);

            var tempKelvin = data.main.temp,
                tempKelvin_min = data.main.temp_min,
                tempKelvin_max = data.main.temp_max;

            // Experiment with changing sunset and sunrize data
            /*
            var apiUrl3 = "https://maps.googleapis.com/maps/api/timezone/json";

            apiUrl3 += '?' + $.param({
              'location': latitude + "," + longitude,
              'timestamp': dayAndTime,
              'appid': "AIzaSyCD_L9ZrEXNoOsr8eaSQQai_aQCp_UxrPA"
            });
            console.log(apiUrl3);

            $.getJSON(apiUrl3, function(data) {
                var exp1 = data.dstOffset;
                var exp2 = data.rawOffset;

                console.log("exp1 = " + exp1);
                console.log("exp2 = " + exp2);
            });
            */

            // ==== Display Weather Data ====
            function displayData() {
                $(".deg-sign, .btn-temp").css('display', 'inline-block');
                $(".marque #city-name").text(city + ",");
                $(".marque #country-name").text(country);
                $(".temperature .temp-num").html(toFahrenheit(tempKelvin));
                $(".weather-description .info").text(weatherDescription);
                
                if ($('.weather-icon .icon').val() === undefined) {
                    $(".weather-icon").append('<img class="icon" src="' + iconUrl + weatherIconId + ".jpg" + '">');
                } else {
                    $(".weather-icon .icon").replaceWith('<img class="icon" src="' + iconUrl + weatherIconId + ".jpg" + '">');
                };
                // $(".more-stats .real-feel .info").text(toFahrenheit(tempKelvin));
                $(".more-stats .high .info").text(toFahrenheit(tempKelvin_max));
                $(".more-stats .low .info").text(toFahrenheit(tempKelvin_min));
                $(".clouds .info").text(clouds + "%");
                $(".humidity .info").text(humidity + "%");
                $(".wind .info").text(windSpeed + " mph");
                minutes = ("0" + sunrise.getMinutes()).slice(-2);
                $(".sunrise .info").text(sunrise.getHours() + ":" + minutes);
                minutes = ("0" + sunset.getMinutes()).slice(-2);
                $(".sunset .info").text(sunset.getHours() + ":" + minutes);
            };

            displayData();

            // ==== Choose Celsius or Fahrenheit ====
            $(".btn-temp").click(function() {
                console.log(this);

                $(".btn-temp").removeAttr("clicked");
                $(this).attr("clicked", "true");

                if ($(this).prop("value") == "f") {
                    $(".temperature .temp-num").html(toFahrenheit(tempKelvin));
                    // $(".more-stats .real-feel .info").text(toFahrenheit(tempKelvin));
                    $(".more-stats .high .info").text(toFahrenheit(tempKelvin_max));
                    $(".more-stats .low .info").text(toFahrenheit(tempKelvin_min));
                    $(".wind .info").text(windSpeed + " mph");

                } else {
                    $(".temperature .temp-num").html(toCelsius(tempKelvin));
                    // $(".more-stats .real-feel .info").text(toCelsius(tempKelvin));
                    $(".more-stats .high .info").text(toCelsius(tempKelvin_max));
                    $(".more-stats .low .info").text(toCelsius(tempKelvin_min));
                    $(".wind .info").text(toKPH(windSpeed) + " kph");
                };
            });
            
        }).fail(function(err) {
            console.log("Current Weather cannot be loaded");
        }); 
    };

    // ==== Display Daily Forecast Function ====
    function displayDailyForecast(apiUrl) {

        $.getJSON(apiUrl, function(data) {

            console.log(JSON.stringify(apiUrl));

            function dayOfWeek(forecastNum) {
                var date = new Date(data.list[forecastNum].dt * 1000);
                var arr = (date.toString()).split(" ");
                return arr[0];
            };

            $.each($('.forecast .days'), function (index) { 
                var dayNum = index + 1;
                var dayClass = ".day" + dayNum.toString();
            
                $(".bottom-container .forecast " + dayClass + " .dayName").text(dayOfWeek(dayNum));

                $(".bottom-container .forecast " + dayClass + " .desc").text(titleCase(data.list[dayNum].weather[0].description));

                if ($(".bottom-container .forecast " + dayClass + " .forecast-icon .icon").val() === undefined) {
                        $(".bottom-container .forecast " + dayClass + " .forecast-icon").append('<img class="icon" src="' + iconUrl + data.list[dayNum].weather[0].icon + ".jpg" + '">');
                    } else {
                        $(".bottom-container .forecast " + dayClass + " .forecast-icon .icon").replaceWith('<img class="icon" src="' + iconUrl + data.list[dayNum].weather[0].icon + ".jpg" + '">');
                    };

                $(".bottom-container .forecast " + dayClass + " .temps .info").html("D " + toFahrenheit(data.list[dayNum].temp.day) + "&deg;" + " / " + "N " + toFahrenheit(data.list[dayNum].temp.night) + "&deg;");
            });

            $(".btn-temp").click(function() {
                
                if ($(this).prop("value") == "f") {
                // if ($('button[name=toggle]:focus').val() == "f") {
                    $.each($('.forecast .days'), function (index) { 
                        var dayNum = index + 1;
                        var dayClass = ".day" + dayNum.toString();
                    $(".bottom-container .forecast " + dayClass + " .temps .info").html("D " + toFahrenheit(data.list[dayNum].temp.day) + "&deg;" + " / " + "N " + toFahrenheit(data.list[dayNum].temp.night) + "&deg;");
                    });
                } else {
                    $.each($('.forecast .days'), function (index) { 
                        var dayNum = index + 1;
                        var dayClass = ".day" + dayNum.toString();
                    $(".bottom-container .forecast " + dayClass + " .temps .info").html("D " + toCelsius(data.list[dayNum].temp.day) + "&deg;" + " / " + "N " + toCelsius(data.list[dayNum].temp.night) + "&deg;");
                    });
                };    
            });
        });
    };

    // ==== Allow 'Enter' to click submit ====
    $("#city_search_name").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#new-city-search-btn").click();
        }
    });

    // ==== Display Weather for Selected City ====
    $("#new-city-search-btn").click(function() {
        $(".deg-sign, .btn-temp").css('display', 'inline-block');
        $(".btn-temp").removeAttr("clicked");
        $(".btnF").attr("clicked", "true");

        var keyword = $("#city_search_name").val();
        var arrKeyword = keyword.split(", ");
        var cityForSearch = arrKeyword[0];

        displayCurrentWeather(currentCityApi(cityForSearch));

        displayDailyForecast(forecastCityApi(cityForSearch));
    });

});

/*
key = AIzaSyCD_L9ZrEXNoOsr8eaSQQai_aQCp_UxrPA

*localhost:12080/*
*weather-watch.appspot.com/*
*/