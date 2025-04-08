import React from 'react'
import './WeatherCard.scss'
interface WeatherCardProps {
  weather: any
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <div className='weather-card'>
      {weather && (
        <div className='weather-info'>
          <h2>
            {weather.location.name}, {weather.location.country}
          </h2>
          <img src={weather.current.condition.icon} alt='Weather Icon' className='weather-icon' />
          <p>Nhiệt độ: {weather.current.temp_c}°C</p>
          <p>Trạng thái: {weather.current.condition.text}</p>
        </div>
      )}
    </div>
  )
}

export default WeatherCard
