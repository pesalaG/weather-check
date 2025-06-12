import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('Colombo');
  const [searchInput, setSearchInput] = useState('');
  const [mapCenter, setMapCenter] = useState([6.9319, 79.8478]); // Default to Colombo
  const [zoomLevel, setZoomLevel] = useState(5);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${location}`
        );
        const data = response.data;
        
        setWeather({
          temperature: data.current.temp_c,
          humidity: data.current.humidity,
          wind_speed: data.current.wind_kph,
          uv_index: data.current.uv,
          pressure: data.current.pressure_mb,
          feelslike: data.current.feelslike_c,
          condition: data.current.condition.text,
          icon: data.current.condition.icon,
          location: data.location.name,
          country: data.location.country,
          lat: data.location.lat,
          lon: data.location.lon
        });

        // Update map center and zoom to the new location
        setMapCenter([data.location.lat, data.location.lon]);
        setZoomLevel(12); // Zoom in closer when a city is selected
      } catch (error) {
        console.error("Error fetching weather:", error);
        alert("Failed to fetch weather data. Please try another location.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(searchInput);
    }
  };

  if (loading) return <p>Loading weather data...</p>;

  return (
    <div className="App">
      <h1>Weather App</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Search</button>
      </form>
      
      <div className="map-container">
        <MapContainer 
          center={mapCenter} 
          zoom={zoomLevel} 
          scrollWheelZoom={true}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {weather && (
            <Marker position={[weather.lat, weather.lon]}>
              <Popup>
                <div>
                  <h3>{weather.location}, {weather.country}</h3>
                  <img src={`https:${weather.icon}`} alt="weather icon" />
                  <p><strong>Temperature:</strong> {weather.temperature} °C</p>
                  <p><strong>Condition:</strong> {weather.condition}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {weather && (
        <div className="weather-details">
          <h2>{weather.location}, {weather.country}</h2>
          <div className="weather-info">
            <div>
              <img src={`https:${weather.icon}`} alt="weather icon" />
              <p><strong>Condition:</strong> {weather.condition}</p>
            </div>
            <div className="info-column">
              <p><img src="/icons/temperature.png" alt="" /> <strong>Temperature:</strong> {weather.temperature} °C</p>
              <p><img src="/icons/humidity.png" alt="" /> <strong>Humidity:</strong> {weather.humidity} %</p>
              <p><img src="/icons/wind.png" alt="" /> <strong>Wind Speed:</strong> {weather.wind_speed} km/h</p>
              <p><img src="/icons/uv-index.png" alt="" /> <strong>UV Index:</strong> {weather.uv_index}</p>
              <p><img src="/icons/thermometer.png" alt="" /> <strong>Feels Like:</strong> {weather.feelslike} °C</p>
              <p><img src="/icons/pressure.png" alt="" /> <strong>Pressure:</strong> {weather.pressure} mb</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;