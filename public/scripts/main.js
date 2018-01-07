'use strict';

var weatherApp = {};

weatherApp.darkAPIUrl = 'https://api.darksky.net/forecast/fbec69199541239bcdb9cecacee65858';

// on click of button, start loading screen, begin getWeather
weatherApp.buttonStart = function () {
    $('.weather-start--button').on('click', function (event) {
        $('loader').slideDown('slow');
        weatherApp.getWeather();
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
            console.log(weatherInfo);

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
    var a = new Date(unixTimestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    weatherApp.formattedTime = month + ' ' + date + ', ' + year + ' at ' + hour + ':' + min;

    $('.date-time--results').text(weatherApp.formattedTime);
};

weatherApp.displayWeatherOnPage = function (current, alerts, daily) {
    console.log(current);
    console.log(alerts);

    $('.summary--results').text(current.summary);
    $('.temp-c-current--results').text(current.temperature);
    $('.temp-c-feels-like--results').text(current.apparentTemperature);
    $('.daily-week--results').text(daily.summary);

    // if/else for precip probability to show intensity or not
    if (current.precipProbability === 0) {
        $('.precip-prop--results').text(current.precipProbability);
        $('.precip-instens--results').hide();
    } else {
        $('.precip-prop--results').text(current.precipProbability);
        $('.precip-instens--results').text(current.precipIntensity);
    };

    weatherApp.changeBackgroundAndIcon(current.icon);
};

// change background and icon to match weather
weatherApp.changeBackgroundAndIcon = function (backgroundNew) {
    var icons = new Skycons({ "color": "rgb(24, 29, 37)" });

    icons.play();

    if (backgroundNew === "wind" || backgroundNew === "rain") {
        $('main').css('background', 'url("/public/styles/assets/wind--background.jpg")');
    } else if (backgroundNew === "fog" || backgroundNew === "clear-night") {
        $('main').css('background', 'url("/public/styles/assets/snow--background.jpg")');
        icons.set("icon1", Skycons.CLEAR_NIGHT);
    } else {
        $('main').css('background', 'url("/public/styles/assets/clear-day--background.jpg")');
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