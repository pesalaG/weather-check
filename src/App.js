import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=Colombo`
        );
        const data = response.data;
        
        setWeather({
          temperature: data.current.temp_c,
          humidity: data.current.humidity,
          wind_speed: data.current.wind_kph,
          uv_index: data.current.uv,
          condition: data.current.condition.text,
          icon: data.current.condition.icon
        });
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <p>Loading weather data...</p>;

  return (
    <div className="App">
      <h1>Colombo Weather</h1>
      <img src={`https:${weather.icon}`} alt="weather icon" />
      <p><strong>Condition:</strong> {weather.condition}</p>
      <p><strong>Temperature:</strong> {weather.temperature} °C</p>
      <p><strong>Humidity:</strong> {weather.humidity} %</p>
      <p><strong>Wind Speed:</strong> {weather.wind_speed} km/h</p>
      <p><strong>UV Index:</strong> {weather.uv_index}</p>
    </div>
  );
}

export default App;