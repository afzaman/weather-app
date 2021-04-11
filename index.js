const weatherContainer = document.querySelector('[weather-container]')
const locationContainer = document.querySelector('[data-location-container]')
const tempContainer = document.querySelector('[data-temp-container]')
const weatherDescContainer = document.querySelector('[data-weather-container]')
const windContainer = document.querySelector('[data-wind-container]')
const precipContainer = document.querySelector('[data-precip-container]')
const changeUnitButton = document.querySelector('[data-units-button]')
const locationSearch = document.querySelector('[data-location-search]')
const header = document.querySelector('[data-header]')

const WEATHERAPIKEY = "e72fd8eb32ba2933f5f9e889d825e806"
const GIPHYAPIKEY = 'LJH7wx4YTmVJWc0bpxKpa6CeqPEtkx7k'
const defaultLocation = "New York"
let currentWeather = {}
let units = "imperial"
let unitStrings = {
    temp: " \xB0F",
    wind: " knots",
    precip: " in/hr"
}

function render(currentWeather) {
    locationContainer.innerHTML = currentWeather.name
    tempContainer.innerHTML = Math.floor(currentWeather.temp).toString() + unitStrings.temp
    windContainer.innerHTML = Math.floor(currentWeather.wind).toString() + unitStrings.wind
    precipContainer.innerHTML = Math.floor(currentWeather.precip.toString()) + unitStrings.precip
    weatherDescContainer.innerHTML = currentWeather.weather
    renderBackground(currentWeather.time)
    renderHeader(currentWeather.searchTerm)
}

async function getWeather(location) {
    try {
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=' + location + '&units=' + units + '&APPID=' + WEATHERAPIKEY, {mode: 'cors'})
        const weatherData = await response.json()
        currentWeather = {
            name: weatherData.name,
            wind: weatherData.wind.speed,
            temp: weatherData.main.temp,
            precip: (typeof weatherData.rain === 'undefined') ? 0 : weatherData.rain['1h'],
            time: {
                dt: weatherData.dt,
                sunrise: weatherData.sys.sunrise,
                sunset: weatherData.sys.sunset

            },
            weather: weatherData.weather[0].description,
            searchTerm: weatherData.weather[0].main
        }
    } catch (err) {
        locationSearch.value = ""
        locationSearch.placeholder = "City not found, try again"
        console.log(err)
    }
    render(currentWeather)
}

locationSearch.addEventListener('change', e => {
    getWeather(locationSearch.value)
})

changeUnitButton.addEventListener('click', e => {
    if (units === "imperial") {
        units = "metric"
        unitStrings = {
            temp: " \xB0C",
            wind: " km/hr",
            precip: " mm/hr"
        }
        currentWeather.temp = (currentWeather.temp - 32) * 5 / 9
        currentWeather.wind = currentWeather.wind * 1.852
        currentWeather.precip = currentWeather.precip * 25.4
    }
    else {
        units = "imperial"
        unitStrings = {
            temp: " \xB0F",
            wind: " knots",
            precip: " in/hr"
        }
        currentWeather.temp = (currentWeather.temp * 9 / 5) + 32
        currentWeather.wind = currentWeather.wind / 1.852
        currentWeather.precip = currentWeather.precip / 25.4
    }
    render(currentWeather)
})

function renderBackground(time) {
    let currentTime = time.dt
    let sunrise = time.sunrise
    let sunset = time.sunset
    
    if (currentTime > sunrise && currentTime < sunset){
        document.body.style.backgroundColor = "#EF810E"
    } else {
        document.body.style.backgroundColor =  "#001A26"
    }        
}

async function renderHeader(searchTerm) {
    try {
        const response  = await fetch('https://api.giphy.com/v1/gifs/translate?api_key=' + GIPHYAPIKEY + '&s=' + searchTerm, {mode: 'cors'})
        const img = await response.json()
        console.log(img.data.images.original.url)
        header.style.backgroundImage = "url('" + img.data.images.original.url + "')"
    } catch (err) {
        console.log(err)
    }
}

getWeather(defaultLocation)