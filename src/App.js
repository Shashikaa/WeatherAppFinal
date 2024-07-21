import React, { useState, useEffect } from 'react';
import './App.css';
import RegisterForm from './components/RegisterForm';
import WeatherCard from './components/WeatherCard';
import BackgroundLayout from './BackgroundLayout';

function App() {
  const [weather, setWeather] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=London&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeather({
        temperature: data.main.temp,
        windspeed: data.wind.speed,
        humidity: data.main.humidity,
        place: data.name,
        heatIndex: data.main.feels_like,
        iconString: data.weather[0].main,
        conditions: data.weather[0].description,
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <div className='app-container'>
      <BackgroundLayout weather={weather} />
      <div className='content-container'>
        <nav className='nav-container'>
          <h1 className='app-title'>Weather App</h1>
        </nav>
        <main className='main-container'>
          <div className='overlay-content'>
        
            <div className='weather-card-container'>
              {weather && <WeatherCard apiEndpoint="http://api.openweathermap.org/data/2.5/weather" />}
            </div>
            <div className='register-form-container'>
              <RegisterForm />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
