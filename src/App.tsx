import { useState, useEffect } from "react";
import axios from "axios";
import "./assets/styles/app.css";
import "./assets/styles/app.scss";
import searchImg from './assets/images/search_icon.png';

const API_KEY = "847b3b48e6c9c235efdc12796d524766"; // Thay bằng API Key của bạn
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const App: React.FC = () => {
  const [city, setCity] = useState(""); // State lưu tên thành phố
  const [weather, setWeather] = useState<any>(null); // State lưu dữ liệu thời tiết
  const [loading, setLoading] = useState(false); // State loading khi gọi API

  // 🛰️ Lấy vị trí tự động khi load trang
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      }, (error) => {
        console.error("Lỗi khi lấy vị trí:", error);
      });
    }
  }, []);

  // 📍 Hàm lấy thời tiết theo tọa độ
  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: "metric",
        },
      });
      setWeather(response.data);
      setCity(response.data.name); // Hiển thị tên thành phố
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thời tiết:", error);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Hàm tìm kiếm thời tiết theo tên thành phố
  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Nhập tên thành phố..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather} disabled={loading}>
        {loading ? "Đang tải..." : "Tìm kiếm"}
      </button>

      {weather && (
        <div className="weather-info">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p>Nhiệt độ: {weather.main.temp}°C</p>
          <p>Trạng thái: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default App;
