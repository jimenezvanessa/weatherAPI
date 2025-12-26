# Weather App

A simple and functional weather application that displays current weather information for any city using the OpenWeather API.

## Features

- Search weather by city name
- Display current temperature, humidity, wind speed, and more
- Responsive design for all screen sizes
- Loading states and error handling
- Clean and simple UI

## Files Structure

```
openweather/
├── index.html      # Main HTML file
├── style.css       # Stylesheet
├── script.js       # JavaScript functions
└── config.js       # API key configuration
```

## Setup Instructions

1. **Get API Key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Get your API key from the dashboard

2. **Configure API Key**
   - Open `config.js`
   - Replace `YOUR_API_KEY_HERE` with your actual API key

3. **Run the Project**
   - Open `index.html` in a web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     ```
   - Navigate to `http://localhost:8000/openweather/`

## API Documentation

### 1. Base URL
```
https://api.openweathermap.org/data/2.5
```

### 2. Endpoints

#### Current Weather Data
```
GET /weather
```
Returns current weather data for a specific city.

#### Weather Icons
```
GET https://openweathermap.org/img/wn/{icon}@2x.png
```
Returns weather icon images (Note: This project uses Bootstrap icons instead).

#### Forecast Data (Available but not used in this project)
```
GET /forecast
```
Returns 5-day weather forecast (not implemented in this project).

### 3. Required Parameters

#### Query Parameters for `/weather` endpoint:
- `q` (required): City name (e.g., "Manila", "New York")
- `appid` (required): Your API key
- `units` (optional): Temperature unit - `metric` (Celsius), `imperial` (Fahrenheit), or `kelvin` (default)

**Example Request:**
```
https://api.openweathermap.org/data/2.5/weather?q=Manila&appid=YOUR_API_KEY&units=metric
```

### 4. Authentication

✔ **API Key** - Required for all requests

- Authentication method: API Key
- Location: Query parameter `appid`
- How to get: Sign up at [OpenWeatherMap](https://openweathermap.org/api)
- Free tier: 60 calls/minute, 1,000,000 calls/month

### 5. Sample JSON Response

```json
{
  "coord": {
    "lon": 120.9822,
    "lat": 14.6042
  },
  "weather": [
    {
      "id": 801,
      "main": "Clouds",
      "description": "few clouds",
      "icon": "02d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 28.5,
    "feels_like": 32.1,
    "temp_min": 27.8,
    "temp_max": 29.2,
    "pressure": 1013,
    "humidity": 75
  },
  "visibility": 10000,
  "wind": {
    "speed": 3.5,
    "deg": 180
  },
  "clouds": {
    "all": 20
  },
  "dt": 1699123456,
  "sys": {
    "type": 1,
    "id": 8164,
    "country": "PH",
    "sunrise": 1699082345,
    "sunset": 1699124567
  },
  "timezone": 28800,
  "id": 1701668,
  "name": "Manila",
  "cod": 200
}
```

**Fields Used in This Project:**
- `name` - City name
- `sys.country` - Country code
- `main.temp` - Current temperature
- `main.feels_like` - Feels like temperature
- `main.humidity` - Humidity percentage
- `main.pressure` - Atmospheric pressure
- `wind.speed` - Wind speed
- `visibility` - Visibility distance
- `weather[0].description` - Weather condition description
- `weather[0].icon` - Weather icon code
- `sys.sunrise` - Sunrise time (Unix timestamp)
- `sys.sunset` - Sunset time (Unix timestamp)

### 6. Fetch the Data (JavaScript)

This project uses `fetch()` with `async/await`:

```javascript
async function fetchWeatherData(cityName) {
    try {
        const url = `${API_BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}
```

### 7. Display in HTML (DOM)

The weather data is displayed using:
- **Card Layout** - Main weather information card
- **Icons** - Bootstrap icons for visual representation
- **Grid Layout** - Weather details in a responsive grid
- **Text Elements** - Temperature, description, and other details

**Example DOM Structure:**
```html
<div class="weather-card">
    <div class="weather-card-header">
        <h2 id="weather-city-name"></h2>
        <p id="weather-date"></p>
    </div>
    <div class="weather-card-body">
        <div class="weather-temp-section">
            <i id="weather-icon"></i>
            <span id="weather-temp"></span>
            <span id="weather-description"></span>
        </div>
        <div class="weather-details-grid">
            <!-- Weather details items -->
        </div>
    </div>
</div>
```

### 8. Error Handling

The application handles the following error scenarios:

✔ **No results found** - City not found (404 error)
```javascript
if (response.status === 404) {
    throw new Error('City not found. Please check the city name.');
}
```

✔ **Invalid input** - Empty or invalid city name
```javascript
if (!trimmed) {
    showError('Please enter a city name.');
    return false;
}
```

✔ **Failed API call** - Network errors or API failures
```javascript
catch (error) {
    hideLoading();
    showError(error.message || 'Something went wrong. Please try again.');
}
```

✔ **Loading message** - Displayed during API requests
```html
<div id="weather-loading" class="weather-loading">
    <i class="bi bi-arrow-repeat weather-spinner"></i>
    <p>Loading...</p>
</div>
```

### 9. Input Validation

The application includes comprehensive input validation:

✔ **Check empty fields**
```javascript
if (!trimmed) {
    showError('Please enter a city name.');
    return false;
}
```

✔ **Check invalid characters**
```javascript
const invalidChars = /[<>{}[\]\\]/;
if (invalidChars.test(trimmed)) {
    showError('City name contains invalid characters.');
    return false;
}
```

✔ **Disable button while loading**
```javascript
searchBtn.disabled = true;
```

✔ **Auto-trim whitespace**
```javascript
const trimmed = cityName.trim();
```

### 10. Loading State

The application displays loading indicators:

✔ **Loading spinner** - Animated icon during API requests
```html
<i class="bi bi-arrow-repeat weather-spinner"></i>
```

✔ **Loading text** - "Loading..." message
```html
<p>Loading...</p>
```

The loading state is shown when:
- User clicks search button
- API request is in progress
- Button is disabled to prevent double-clicks

### 11. Responsive Design

The website is fully responsive and works on:

✔ **Website** - Desktop and laptop screens
✔ **Tablet** - Medium-sized screens (max-width: 768px)
✔ **Mobile** - Small screens (max-width: 480px)

**Responsive Features:**
- Flexible grid layout
- Stacked elements on mobile
- Adjusted font sizes
- Touch-friendly buttons
- Optimized spacing

### 12. Comments in Code

The JavaScript file includes comments explaining:

- **Function explanations** - Tagalog comments for important functions
- **API call explanations** - How data is fetched
- **DOM manipulation comments** - How data is displayed

**Example Comments:**
```javascript
// Ito ang function para kumuha ng weather data mula sa OpenWeather API
async function fetchWeatherData(cityName) { ... }

// Ito ang function para i-display ang weather data sa HTML
function displayWeatherData(data) { ... }
```

### 13. File Requirements

The project includes exactly 4 files:

1. **index.html** - Main HTML structure
2. **style.css** - All styling (no inline CSS)
3. **script.js** - All JavaScript (no inline JS)
4. **config.js** - API key configuration

No inline CSS or JavaScript is used.

### 14. Code Organization

The code is organized using functions:

- **API Functions** - `fetchWeatherData()` - Handles API calls
- **DOM Functions** - `displayWeatherData()`, `showError()`, `showLoading()`, `hideLoading()` - Handle UI updates
- **Utility Functions** - `validateInput()` - Input validation
- **Event Handlers** - `handleSearch()` - Main search functionality

No duplicated code, all functions are reusable.

### 15. UI Requirements

The interface includes:

✔ **Search bar** - Input field for city name
```html
<input type="text" id="weather-search-input" class="weather-search-input" placeholder="Enter city name...">
```

✔ **Buttons** - Search button with loading state
```html
<button id="weather-search-btn" class="weather-search-btn">
    <i class="bi bi-search"></i>
    <span class="weather-btn-text">Search</span>
</button>
```

✔ **Results container** - Displays weather information
```html
<div id="weather-results" class="weather-results">
    <div class="weather-card">...</div>
</div>
```

✔ **Error container** - Shows error messages
```html
<div id="weather-error" class="weather-error"></div>
```

✔ **Footer with credits** - API source attribution
```html
<footer class="weather-footer">
    <p>Powered by <a href="https://openweathermap.org/" target="_blank">OpenWeather API</a></p>
</footer>
```

### 16. API Key Security

The API key is stored securely:

✔ **Stored in config.js** - Separate configuration file
```javascript
const API_KEY = "YOUR_API_KEY_HERE";
```

✔ **File is imported** - Loaded in HTML
```html
<script src="config.js"></script>
```

✔ **Key NOT committed** - Sample key in repository
- The `config.js` file contains `YOUR_API_KEY_HERE` as placeholder
- Users must replace it with their own API key
- Add `config.js` to `.gitignore` if using version control

### 17. GitHub Requirements

To use with GitHub:

1. Create a GitHub repository
2. Push all code files (except `config.js` with real key)
3. Include this README.md
4. Add setup instructions
5. Make commits with descriptive messages

**Example .gitignore:**
```
config.js
```

### 18. Demo Video Requirements

If creating a demo video, show:

✔ Website UI
✔ API request working
✔ Input/Output (searching for a city)
✔ Error handling (invalid city, empty input)
✔ GitHub repo
✔ Explanation of code structure

### 19. CSS Requirements

The project includes:

✔ **Card layout** - Weather information displayed in cards
✔ **Grid gallery** - Weather details in responsive grid
✔ **Responsive image** - Icons scale properly
✔ **Hover effect** - Button hover states
✔ **Custom color theme** - Blue (#4a90e2) primary color

### 20. Bonus Requirements (Optional)

Future enhancements could include:

- Saving favorites using localStorage
- Pagination or "Load more" button
- Animations using CSS transitions
- Theme changer (light/dark/color)
- Sorting or filtering
- Multiple API calls combined

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- OpenWeather API
- Bootstrap Icons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational purposes only.

## Credits

- Weather data provided by [OpenWeather](https://openweathermap.org/)
- Icons by [Bootstrap Icons](https://icons.getbootstrap.com/)

