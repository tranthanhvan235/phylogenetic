import { useState } from "react";
import axios from "axios";
import searchImg from './assets/images/search_icon.png';
import "./assets/styles/app.css";
import "./assets/styles/app.scss";

const App: React.FC = () => {
  const [city, setCity] = useState(""); 
  const [weather, setWeather] = useState<any>(null); 

  const API_KEY = "847b3b48e6c9c235efdc12796d524766"; 
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";

  const fetchWeather = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      });
      setWeather(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thời tiết:", error);
      setWeather(null);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Weather App</h1>
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Nhập tên thành phố..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="search-button" onClick={fetchWeather}>
        <img src={searchImg} alt='React Logo' width={30} height={30} />
        </button>
      </div>

      {weather && (
        <div className="weather-card">
          <h2 className="city">
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="temperature">{weather.main.temp}°C</p>
          <p className="description">{weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default App;
