const express = require('express');
const cors = require('cors');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Tạo thư mục data nếu chưa tồn tại
const dataDir = path.join(__dirname, 'data');
require('fs').mkdirSync(dataDir, { recursive: true });

// Kết nối database
const db = new sqlite3.Database(path.join(dataDir, 'weather.db'), (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
    // Tạo bảng history nếu chưa tồn tại
    db.run(`CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// API endpoint để lấy thời tiết
app.get('/weather', async (req, res) => {
  try {
    const { city, q } = req.query;
    if (!process.env.WEATHER_API_KEY) {
      throw new Error('WEATHER_API_KEY is not set');
    }

    // Sử dụng q (cho coordinates) hoặc city
    const query = q || city;
    if (!query) {
      throw new Error('No location specified');
    }

    const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: query,
        aqi: 'no'
      }
    });

    // Lưu vào history nếu tìm bằng tên thành phố
    if (city && response.data) {
      db.run('INSERT INTO history (city_name) VALUES (?)', [city]);
    }

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      details: error.message 
    });
  }
});

// API endpoint để lấy history
app.get('/history', (req, res) => {
  db.all('SELECT DISTINCT city_name FROM history ORDER BY created_at DESC LIMIT 10', [], (err, rows) => {
    if (err) {
      console.error('Error fetching history:', err);
      res.status(500).json({ error: 'Failed to fetch history' });
      return;
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 