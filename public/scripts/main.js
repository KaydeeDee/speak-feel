'use strict';

var weatherApp = {};

weatherApp.darkAPIUrl = 'https://api.darksky.net/forecast/fbec69199541239bcdb9cecacee65858';

// on click of button, start loading screen, begin getWeather
weatherApp.buttonStart = function () {
    $('.weather-start--button').on('click', function (event) {
        $('loader').slideDown('slow');
        weatherApp.getWeather();
        $('.pre-text--pre-results').hide();
    });
};

weatherApp.getWeather = function () {
    //Check support for geolocation API
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successGeo, errorGeo, { enableHighAccuracy: true });
    };

    //Get latitude and longitude, get request to API;
    function successGeo(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        $.ajax({
            url: weatherApp.darkAPIUrl + '/' + lat + ',' + long + '?units=si',
            method: 'GET',
            dataType: 'jsonp'

        }).then(function (weatherInfo) {

            weatherApp.displayWeatherOnPage(weatherInfo.currently, weatherInfo.alerts, weatherInfo.daily);

            weatherApp.convertTime(weatherInfo.currently.time);
        });
    };

    function errorGeo(sad) {
        alert("Please allow the browser to share your location by refreshing this page and clicking 'allow'!");
    };
};

// converting UNIX to readable time and date
weatherApp.convertTime = function (unixTimestamp) {

    var timeHold = new Date(unixTimestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = timeHold.getFullYear();
    var month = months[timeHold.getMonth()];
    var date = timeHold.getDate();
    var hour = timeHold.getHours();
    var min = timeHold.getMinutes() < 10 ? '0' + timeHold.getMinutes() : timeHold.getMinutes();

    var formattedTime = month + ' ' + date + ', ' + year + ' at ' + hour + ':' + min;

    $('.date-time--results').text(formattedTime);
};

// display weather on page
weatherApp.displayWeatherOnPage = function (current, alerts, daily) {
    console.log(current);
    console.log(alerts);

    // round to 1 dec point for temperatures
    var numberCurrent = current.temperature;
    var numberApparent = current.apparentTemperature;

    var roundedCurrent = Math.round(numberCurrent).toFixed(0);
    var roundedApparent = Math.round(numberApparent).toFixed(0);

    // make percentage out of chance of precip
    var percipProb = current.precipProbability;

    var percentagePercipProb = Math.round(percipProb * 100);
    console.log(percentagePercipProb);

    // meter to km
    var windSpeedCurrent = current.windSpeed;
    // console.log(windSpeedCurrent);
    // const kmWindSpeedCurrent = Math.round(windSpeedCurrent/1000).toFixed(2);

    $('.wind-speed--results').text(current.windSpeed);

    $('.summary--results').text(current.summary);
    $('.temp-c-current--results').text(roundedCurrent);
    $('.temp-c-feels-like--results').text(roundedApparent);
    $('.daily-week--results').text(daily.summary);
    $('.wind-speed--results').text(windSpeedCurrent);

    // if/else for precip probability to show intensity or not
    if (percentagePercipProb === 0) {
        $('.precip-prop--results').text(percentagePercipProb);
        $('.precip-details--results-p').hide();
    } else {
        $('.precip-prop--results').text(percentagePercipProb);
        $('.precip-instens--results').text(current.precipIntensity);
        $('.precip-type--results').text(current.precipType);
    };

    weatherApp.changeBackgroundAndIcon(current.icon);
};

// change background and icon to match weather
weatherApp.changeBackgroundAndIcon = function (backgroundNew) {
    var icons = new Skycons({ "color": "rgb(24, 29, 37)" });

    icons.play();

    console.log(backgroundNew);

    if (backgroundNew === "clear-day") {
        $('main').css('background', 'url("/public/styles/assets/clear-day--background.jpg")');
        icons.set("icon1", Skycons.CLEAR_DAY);
    } else if (backgroundNew === "clear-night") {
        $('main').css('background', 'url("/public/styles/assets/clear-night--background.jpg")');
        icons.set("icon1", Skycons.CLEAR_NIGHT);
    } else if (backgroundNew === "fog") {
        $('main').css('background', 'url("/public/styles/assets/fog--background.jpg")');
        icons.set("icon1", Skycons.FOG);
    } else if (backgroundNew === "rain" || backgroundNew === "thunderstorm") {
        $('main').css('background', 'url("/public/styles/assets/rain--background.jpg")');
        icons.set("icon1", Skycons.RAIN);
    } else if (backgroundNew === "snow" || backgroundNew === "hail") {
        $('main').css('background', 'url("/public/styles/assets/snow--background.jpg")');
        icons.set("icon1", Skycons.SNOW);
    } else if (backgroundNew === "wind" || backgroundNew === "tornado") {
        $('main').css('background', 'url("/public/styles/assets/wind--background.jpg")');
        icons.set("icon1", Skycons.WIND);
    } else if (backgroundNew === "sleet") {
        $('main').css('background', 'url("/public/styles/assets/wind--background.jpg")');
        icons.set("icon1", Skycons.SLEET);
    } else if (backgroundNew === "sleet") {
        $('main').css('background', 'url("/public/styles/assets/wind--background.jpg")');
        icons.set("icon1", Skycons.SLEET);
    } else if (backgroundNew === "partly-cloudly-day") {
        icons.set("icon1", Skycons.PARTLY_CLOUDY_DAY);
    } else if (backgroundNew === "cloudy") {
        icons.set("icon1", Skycons.CLOUDY);
        $('main').css({
            'background': 'url("/public/styles/assets/overcast--background.jpg")' });
    } else if (backgroundNew === "partly-cloudy-night") {
        $('main').css({
            'background': 'url("/public/styles/assets/clear-night--background.jpg")'
        });
        $('footer a, h1, header .fa-umbrella').css({ 'color': 'rgb(254, 255, 253)' });
        icons.set("icon1", Skycons.PARTLY_CLOUDY_NIGHT);
    } else {
        $('main').css('background', 'url("/public/styles/assets/clear-day--background.jpg")');
        icons.set("icon1", Skycons.PARTLY_CLOUDY_DAY);
    };

    $('main').css({ 'background-size': 'cover',
        'background-position': 'center',
        'background-repeat': 'no-repeat'
    });

    weatherApp.pageLoaded();
};

weatherApp.pageLoaded = function () {
    $('.weather-start--button').html('Update Weather');
    $('.weather-results').show();
    $('section').addClass('weather-results--total');
    setTimeout(function () {
        $('loader').slideUp('slow');
    }, 500);
};

weatherApp.events = function () {

    $('.fa-info-circle').click(function () {
        $('.info-circle-hover--text').show();
        $('.precip-prop--results-p').on('mouseleave', function () {
            $('.info-circle-hover--text').hide();
        });
    });
};

weatherApp.init = function () {
    this.buttonStart();
    this.events();
};

$(document).ready(function () {
    weatherApp.init();
});