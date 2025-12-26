const searchInput = document.getElementById('weather-search-input');
const searchBtn = document.getElementById('weather-search-btn');
const errorDiv = document.getElementById('weather-error');
const loadingDiv = document.getElementById('weather-loading');
const resultsDiv = document.getElementById('weather-results');

//  dito yung function pg fetch ng data or weather sa openweather na api
async function fetchWeatherData(cityName) {
    try {
        const url = API_BASE_URL + '/weather?q=' + encodeURIComponent(cityName) + '&appid=' + API_KEY + '&units=metric';
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the city name.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your configuration.');
            } else {
                throw new Error('Failed to fetch weather data. Please try again.');
            }
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// dito yung function para ididisplay ung weather na data galingg sa api sa website
function displayWeatherData(data) {
    const cityName = data.name;
    const country = data.sys.country;
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const pressure = data.main.pressure;
    const visibility = (data.visibility / 1000).toFixed(1);
    const iconCode = data.weather[0].icon;
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    
    document.getElementById('weather-city-name').textContent = cityName + ', ' + country;
    document.getElementById('weather-date').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('weather-temp').textContent = temp + '°C';
    document.getElementById('weather-description').textContent = description;
    document.getElementById('weather-feels-like').textContent = feelsLike + '°C';
    document.getElementById('weather-humidity').textContent = humidity + '%';
    document.getElementById('weather-wind').textContent = windSpeed + ' m/s';
    document.getElementById('weather-pressure').textContent = pressure + ' hPa';
    document.getElementById('weather-visibility').textContent = visibility + ' km';
    document.getElementById('weather-sunrise').textContent = sunrise.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const iconElement = document.getElementById('weather-icon');
    iconElement.className = 'bi';
    if (iconCode.includes('01')) {
        iconElement.classList.add('bi-sun');
    } else if (iconCode.includes('02')) {
        iconElement.classList.add('bi-cloud-sun');
    } else if (iconCode.includes('03') || iconCode.includes('04')) {
        iconElement.classList.add('bi-cloud');
    } else if (iconCode.includes('09') || iconCode.includes('10')) {
        iconElement.classList.add('bi-cloud-rain');
    } else if (iconCode.includes('11')) {
        iconElement.classList.add('bi-cloud-lightning');
    } else if (iconCode.includes('13')) {
        iconElement.classList.add('bi-snow');
    } else if (iconCode.includes('50')) {
        iconElement.classList.add('bi-cloud-fog');
    } else {
        iconElement.classList.add('bi-cloud');
    }
    
    resultsDiv.style.display = 'block';
}


function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    resultsDiv.style.display = 'none';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function hideLoading() {
    loadingDiv.style.display = 'none';
    searchBtn.disabled = false;
    searchBtn.querySelector('.weather-btn-text').style.display = 'inline';
    searchBtn.querySelector('.weather-btn-loader').style.display = 'none';
}

function showLoading() {
    loadingDiv.style.display = 'block';
    resultsDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    searchBtn.disabled = true;
    searchBtn.querySelector('.weather-btn-text').style.display = 'none';
    searchBtn.querySelector('.weather-btn-loader').style.display = 'inline';
}

// dito yung pag vavalidate ng input ni user
function validateInput(cityName) {
    const trimmed = cityName.trim();
    
    if (!trimmed) {
        showError('Please enter a city name.');
        return false;
    }
    
    if (trimmed.length < 2) {
        showError('City name must be at least 2 characters long.');
        return false;
    }
    
    const invalidChars = /[<>{}[\]\\]/;
    if (invalidChars.test(trimmed)) {
        showError('City name contains invalid characters.');
        return false;
    }
    
    return true;
}


async function handleSearch() {
    const cityName = searchInput.value;
    
    if (!validateInput(cityName)) {
        return;
    }
    
    showLoading();
    
    try {
        const weatherData = await fetchWeatherData(cityName.trim());
        hideLoading();
        displayWeatherData(weatherData);
    } catch (error) {
        hideLoading();
        showError(error.message || 'Something went wrong. Please try again.');
    }
}

searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

searchInput.addEventListener('input', () => {
    if (errorDiv.style.display === 'block') {
        errorDiv.style.display = 'none';
    }
});

