const weatherApp = {};

weatherApp.darkAPIUrl = `https://api.darksky.net/forecast/fbec69199541239bcdb9cecacee65858`;


// on click of button, start loading screen, begin getWeather
weatherApp.buttonStart = function() {
    $('.weather-start--button').on('click', function(event){
        $('loader').slideDown('slow');
        weatherApp.getWeather();
        $('.pre-text--pre-results').hide();
        $('button').removeClass("button-intro--styles");
        })
};

weatherApp.getWeather = function() {
//Check support for geolocation API
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successGeo, errorGeo, { enableHighAccuracy: true });
};

//Get latitude and longitude, get request to API;
function successGeo(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    $.ajax({
        url: `${weatherApp.darkAPIUrl}/${lat},${long}?units=si`,
        method: 'GET',
        dataType: 'jsonp'
        
    })
        .then(function (weatherInfo) {

            weatherApp.displayWeatherOnPage(weatherInfo.currently, weatherInfo.daily);

            weatherApp.convertTime(weatherInfo.currently.time);
        });
};
    function errorGeo(sad) {
        alert("Please allow the browser to share your location by refreshing this page and clicking 'allow'!")
    };
};

// converting UNIX to readable time and date
weatherApp.convertTime = function(unixTimestamp) {

    const timeHold = new Date(unixTimestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = timeHold.getFullYear();
    const month = months[timeHold.getMonth()];
    const date = timeHold.getDate();
    const hour = timeHold.getHours();
    const min = timeHold.getMinutes() < 10 ? '0' + timeHold.getMinutes() : timeHold.getMinutes(); 
    
    const formattedTime = month + ' ' + date + ', ' + year + ' at ' + hour + ':' + min;

    $('.date-time--results').text(formattedTime);
};

// display weather on page
weatherApp.displayWeatherOnPage = function(current, daily) {

    // round with no dec point for temperatures
    const numberCurrent = current.temperature;
    const numberApparent = current.apparentTemperature;

    const roundedCurrent = Math.round(numberCurrent);
    const roundedApparent = Math.round(numberApparent);

    // make percentage out of chance of precip
    const percipProb = current.precipProbability;

    const percentagePercipProb = Math.round(percipProb * 100);

    // rounding out amount of precip
    const amountOfPrecipRounded = Math.ceil(current.precipIntensity).toFixed(1);

    // convert m/s to km/hr 
    const windSpeedCurrent = current.windSpeed;

    const roundedWindSpeed = Math.round(windSpeedCurrent * 3.6);

    // push info to DOM
    $('.summary--results').text(current.summary);
    $('.temp-c-current--results').text(`${roundedCurrent}\xB0C`);
    $('.temp-c-feels-like--results').text(`${roundedApparent}\xB0C`);
    $('.daily-week--results').text(`${daily.summary}`);
    $('.wind-speed--results').text(`${roundedWindSpeed} km/hr`);
    $('.uv-index--results').text(current.uvIndex);

    // if/else for precip probability to show intensity or not
    if (percentagePercipProb === 0) {
        $('.precip-prop--results').text(`${percentagePercipProb}%`);
        $('.precip-details--results-p').hide();
    } else {
        $('.precip-prop--results').text(`${percentagePercipProb}%`);
        $('.precip-instens--results').text(`${amountOfPrecipRounded} mm/hr`);
        $('.precip-type--results').text(current.precipType);
    };

    weatherApp.changeBackgroundAndIcon(current.icon);
};

// change background and icon to match weather
weatherApp.changeBackgroundAndIcon = function(backgroundNew) {
    const icons = new Skycons({ "color": "rgb(24, 29, 37)" });

    // play icons
    icons.play();

    if (backgroundNew === "clear-day") {
        $('main').css('background', 'url("https://kaydeedee.github.io/speak-feel/public/styles/assets/clear-day--background.jpg")');
        icons.set("icon1", Skycons.CLEAR_DAY);
    } else if (backgroundNew === "clear-night") {
        $('main').css('background', 'url("https://kaydeedee.github.io/speak-feel/public/styles/assets/clear-night--background.jpg")');
        icons.set("icon1", Skycons.CLEAR_NIGHT);
        $('header, footer a').css({
            'color': 'rgb(254, 255, 253)'
        })
    } else if (backgroundNew === "fog") {
        $('main').css('background', 'url("https://kaydeedee.github.io/speak-feel/public/styles/assets/fog--background.jpg")');
        icons.set("icon1", Skycons.FOG);
        $('footer a').css({
            'color': 'rgb(254, 255, 253)'
        })
    } else if (backgroundNew === "rain" || backgroundNew === "thunderstorm") {
        $('main').css('background', 'url("https://kaydeedee.github.io/speak-feel/public/styles/assets/rain--background.jpg")');
        icons.set("icon1", Skycons.RAIN); 
        $('header, footer a').css({
            'color': 'rgb(254, 255, 253)'
        })
    } else if (backgroundNew === "snow" || backgroundNew === "hail") {
        $('main').css('background', 'url("https://kaydeedee.github.io/speak-feel/public/styles/assets/snow--background.jpg")');
        icons.set("icon1", Skycons.SNOW);
    } else if (backgroundNew === "wind" || backgroundNew === "tornado") {
        $('main').css('background', 'url("https://kaydeedee.github.io/speak-feel/public/styles/assets/wind--background.jpg")');
        icons.set("icon1", Skycons.WIND);
        $('header, footer a').css({
            'color': 'rgb(254, 255, 253)'
        })
    } else if (backgroundNew === "sleet") {
        $('main').css('background', 'url("https://kaydeedee.github.io/speak-feel/public/styles/assets/wind--background.jpg")');
        icons.set("icon1", Skycons.SLEET);
    } else if (backgroundNew === "partly-cloudly-day") {
        icons.set("icon1", Skycons.PARTLY_CLOUDY_DAY);
    } else if (backgroundNew === "cloudy") {
        icons.set("icon1", Skycons.CLOUDY);
        $('main').css({
            'background': 'url("https://kaydeedee.github.io/speak-feel/public/styles/assets/overcast--background.jpg")'})
        $('header').css({
            'color': 'rgb(254, 255, 253)'
        })
    } else if (backgroundNew === "partly-cloudy-night") {
        $('main').css({
            'background': 'url("https://kaydeedee.github.io/speak-feel/public/styles/assets/clear-night--background.jpg")',
        });
        $('footer a, header').css({'color': 'rgb(254, 255, 253)'})
        icons.set("icon1", Skycons.PARTLY_CLOUDY_NIGHT);
    } else {
        $('main').css('background', 'url("https://kaydeedee.github.io/speak-feel/public/styles/assets/clear-day--background.jpg")');
        icons.set("icon1",Skycons.PARTLY_CLOUDY_DAY);
    };

    // default properties for background in main
    $('main').css({'background-size': 'cover',
                    'background-position': 'center',
                    'background-repeat': 'no-repeat'
    });

    weatherApp.pageLoaded();
};

// once page is loaded what appears on page + loading page done
weatherApp.pageLoaded = function(){
    $('.weather-start--button').html('Update Weather');
    $('.weather-results').show();
    setTimeout(function(){
        $('loader').slideUp('slow');
    }, 900);
};

// holding click event for info icon
weatherApp.events = function(){
    $('.fa-info-circle').click(function(){
        $('.info-circle--text-show').toggleClass('info-circle-hover--text');
    })
};


// init 
weatherApp.init = function(){
    this.buttonStart();
    this.events();
};


// doc ready
$(document).ready(function(){
    weatherApp.init();
});