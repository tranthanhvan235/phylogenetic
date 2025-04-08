import { useState, useEffect } from 'react'
import axios from 'axios'
import './styles/app.css'
import './styles/app.scss'
import searchImg from './assets/images/search_icon.png'
import WeatherCard from './components/WeatherCard/WeatherCard'
import LoadingSpinner from './components/LoadingSpinner'
import Button from './components/Button/Button'
import InputField from './components/InputField/InputField'
import History from './components/History/History'
import NotFoundMessage from './components/NotFoundMessage/NotFoundMessage'
import { quotes } from './constant'

const API_URL = 'http://localhost:5000/weather' // Địa chỉ backend

const getBackgroundColor = (tempC: number) => {
  if (tempC <= 0) return '#D6E6F2' // Lạnh đóng băng - Xanh nhạt
  if (tempC > 0 && tempC <= 15) return '#4A90E2' // Lạnh - Xanh nước biển
  if (tempC > 15 && tempC <= 25) return '#87CEEB' // Dễ chịu - Xanh da trời
  if (tempC > 25 && tempC <= 32) return '#FFD700' // Ấm - Vàng
  if (tempC > 32) return '#FF5733' // Nóng - Đỏ cam
  return '#FFFFFF' // Mặc định - Trắng
}

const App: React.FC = () => {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [notFound, setNotFound] = useState(false)
  
  // 🛰️ Lấy vị trí tự động khi load trang
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          await fetchWeatherByCoords(latitude, longitude)
        },
        (error) => console.error('Lỗi khi lấy vị trí:', error)
      )
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/history')
      const historyData = res.data.map((item) => item.city_name)
      setHistory(historyData)
    } catch (error) {
      console.error('Lỗi lấy history:', error)
    }
  }

  // 📍 Hàm lấy thời tiết theo tọa độ
  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true)
    try {
      const response = await axios.get(API_URL, { params: { lat, lon } })
      setWeather(response.data)
      setCity(response.data.location.name)
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu thời tiết:', error)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  // 🔍 Hàm tìm kiếm thời tiết theo tên thành phố
  const fetchWeather = async () => {
    if (!city.trim()) return
    setLoading(true)
    try {
      const response = await axios.get(API_URL, { params: { city } })

      if (!response.data) {
        setNotFound(true)
        setWeather(null)
        return
      }

      setWeather(response.data)
      setHistory((prevHistory) => [...new Set([city, ...prevHistory])])
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu thời tiết:', error)
      setNotFound(true)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleHistoryClick = async (city: string) => {
    setCity(city)
    setLoading(true)
    try {
      const response = await axios.get('https://api.weatherapi.com/v1/search.json', {
        params: {
          key: process.env.WEATHER_API_KEY,
          q: city
        }
      })

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0]
        await fetchWeatherByCoords(lat, lon)
      } else {
        console.error('Không tìm thấy thông tin thành phố')
      }
    } catch (error) {
      console.error('Lỗi khi lấy tọa độ thành phố:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className='container'
      style={{ backgroundColor: weather ? getBackgroundColor(weather?.current?.temp_c) : '#FFF' }}
    >
      <h1>Weather App</h1>
      <InputField
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder='Nhập tên thành phố...'
      ></InputField>

      <Button label={loading ? 'Đang tải...' : 'Tìm kiếm'} onClick={fetchWeather} />
      {loading && <LoadingSpinner />}
      {notFound && (
        <NotFoundMessage
          message='Không tìm thấy thành phố này!'
          quote={quotes[Math.floor(Math.random() * quotes.length)]}
          onClose={() => setNotFound(false)}
        />
      )}

      {weather && <WeatherCard weather={weather} />}
      <History historyList={history.slice(0, 3)} onHistoryClick={handleHistoryClick} />
    </div>
  )
}

export default App
