import React, { useEffect, useState, useCallback } from 'react';
import { useDate } from '../Utils/useDate';
import sun from '../assets/icons/sun.png';
import cloud from '../assets/icons/cloud.png';
import fog from '../assets/icons/fog.png';
import rain from '../assets/icons/rain.png';
import snow from '../assets/icons/snow.png';
import storm from '../assets/icons/storm.png';
import wind from '../assets/icons/windy.png';
import BackgroundLayout from '../BackgroundLayout'; // Import the BackgroundLayout component
import '../WeatherCard.css';

const WeatherCard = ({ apiEndpoint, onSearch }) => {
  const [weatherData, setWeatherData] = useState({
    temperature: null,
    windspeed: null,
    humidity: null,
    place: '',
    heatIndex: null,
    iconString: '',
    conditions: '',
  });
  const [icon, setIcon] = useState(sun);
  const [city, setCity] = useState('');
  const { time } = useDate(); // Assuming this hook is correctly implemented

  // Fetch weather data based on location
  const fetchWeatherData = useCallback(async (location) => {
    try {
      const response = await fetch(`${apiEndpoint}?lat=${location.lat}&lon=${location.lon}&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}&units=metric`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched weather data (location):', data);
      setWeatherData({
        temperature: data.main.temp,
        windspeed: data.wind.speed,
        humidity: data.main.humidity,
        place: data.name,
        heatIndex: data.main.feels_like,
        iconString: data.weather[0].main,
        conditions: data.weather[0].description,
      });
    } catch (error) {
      console.error('Error fetching weather data (location):', error);
    }
  }, [apiEndpoint]);

  // Fetch weather data based on city
  const fetchWeatherDataByCity = useCallback(async (city) => {
    try {
      const response = await fetch(`${apiEndpoint}?q=${city}&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}&units=metric`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched weather data (city):', data);
      if (data.cod === '404') {
        console.error('City not found:', city);
        setWeatherData({
          temperature: null,
          windspeed: null,
          humidity: null,
          place: '',
          heatIndex: null,
          iconString: '',
          conditions: 'City not found',
        });
        return;
      }
      setWeatherData({
        temperature: data.main.temp,
        windspeed: data.wind.speed,
        humidity: data.main.humidity,
        place: data.name,
        heatIndex: data.main.feels_like,
        iconString: data.weather[0].main,
        conditions: data.weather[0].description,
      });
    } catch (error) {
      console.error('Error fetching weather data (city):', error);
    }
  }, [apiEndpoint]);

  useEffect(() => {
    // Get user location and fetch weather data
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            };
            fetchWeatherData(location);
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };
    getUserLocation();
  }, [fetchWeatherData]); // Include fetchWeatherData in dependency array

  useEffect(() => {
    // Fetch weather data by city if city is provided
    if (city) {
      fetchWeatherDataByCity(city);
    }
  }, [city, fetchWeatherDataByCity]); // Include fetchWeatherDataByCity in dependency array

  useEffect(() => {
    // Update icon based on weather conditions
    const { iconString } = weatherData;

    if (iconString) {
      if (iconString.toLowerCase().includes('cloud')) {
        setIcon(cloud);
      } else if (iconString.toLowerCase().includes('rain')) {
        setIcon(rain);
      } else if (iconString.toLowerCase().includes('clear')) {
        setIcon(sun);
      } else if (iconString.toLowerCase().includes('thunder')) {
        setIcon(storm);
      } else if (iconString.toLowerCase().includes('fog')) {
        setIcon(fog);
      } else if (iconString.toLowerCase().includes('snow')) {
        setIcon(snow);
      } else if (iconString.toLowerCase().includes('wind')) {
        setIcon(wind);
      }
    }
  }, [weatherData]); // Include weatherData in dependency array

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeatherDataByCity(city.trim());
      if (onSearch) {
        onSearch(city.trim());
      }
    }
  };

  return (
    <div>
      <BackgroundLayout weather={weatherData} /> {/* Pass weatherData to BackgroundLayout */}
      <div className='weather-card'>
        <input
          type='text'
          placeholder='Enter location'
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className='search-box'
        />
        <button onClick={handleSearch} className='search-button'>Get Weather</button>
        <div className='weather-icon'>
          <img src={icon} alt='weather_icon' />
        </div>
        {weatherData.temperature !== null ? (
          <>
            <div className='temperature'>{weatherData.temperature} &deg;C</div>
            <div className='location'>{weatherData.place}</div>
            <div className='date-time'>
              <p>{new Date().toDateString()}</p>
              <p>{time}</p>
            </div>
            <div className='details'>
              <div className='detail'>
                <p className='detail-title'>Wind Speed</p>
                <p className='detail-value'>{weatherData.windspeed} km/h</p>
              </div>
              <div className='detail'>
                <p className='detail-title'>Humidity</p>
                <p className='detail-value'>{weatherData.humidity} gm/m&#179;</p>
              </div>
              <div className='detail'>
                <p className='detail-title'>Heat Index</p>
                <p className='detail-value'>{weatherData.heatIndex ? weatherData.heatIndex : 'N/A'}</p>
              </div>
            </div>
            <div className='conditions'>{weatherData.conditions}</div>
          </>
        ) : (
          <div className='error-message'>{weatherData.conditions}</div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
