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

// Sử dụng nginx proxy
const API_URL = '/api/weather'
const HISTORY_URL = '/api/history'

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
          const cityName = await getCityFromCoords(latitude, longitude)
          if (cityName) {
            setCity(cityName)
            await fetchWeather(cityName)
          }
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
      const res = await axios.get(HISTORY_URL)
      const historyData = res.data.map((item: { city_name: string }) => item.city_name)
      setHistory(historyData)
    } catch (error) {
      console.error('Lỗi lấy history:', error)
    }
  }

  // 📍 Hàm lấy tên thành phố từ tọa độ
  const getCityFromCoords = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(API_URL, { 
        params: { 
          q: `${lat},${lon}`
        }
      })
      return response.data.location.name
    } catch (error) {
      console.error('Lỗi khi lấy tên thành phố:', error)
      return null
    }
  }

  // 🔍 Hàm tìm kiếm thời tiết theo tên thành phố
  const fetchWeather = async (searchCity?: string) => {
    const cityToSearch = searchCity || city
    if (!cityToSearch.trim()) return
    
    setLoading(true)
    try {
      const response = await axios.get(API_URL, { 
        params: { 
          city: cityToSearch
        }
      })

      if (!response.data) {
        setNotFound(true)
        setWeather(null)
        return
      }

      setWeather(response.data)
      await fetchHistory() // Refresh history after successful search
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu thời tiết:', error)
      setNotFound(true)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleHistoryClick = async (historyCity: string) => {
    setCity(historyCity)
    await fetchWeather(historyCity)
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

      <Button label={loading ? 'Đang tải...' : 'Tìm kiếm'} onClick={() => fetchWeather()} />
      {loading && <LoadingSpinner />}
      {notFound && (
        <NotFoundMessage
          message='Không tìm thấy thành phố này!'
          quote={quotes[Math.floor(Math.random() * quotes.length)]}
          onClose={() => setNotFound(false)}
        />
      )}

      {weather && <WeatherCard weather={weather} />}
      <History historyList={history} onHistoryClick={handleHistoryClick} />
    </div>
  )
}

export default App
