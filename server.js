require('dotenv').config();
const express = require('express');
const axios = require('axios');
const db = require('./db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY; // Lấy API Key từ .env

app.use(cors({ origin: '*' })); // Cho phép mọi nguồn gọi API
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src * 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;");
  next();
});

// API lấy dữ liệu thời tiết theo thành phố
app.get('/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
      const response = await axios.get(`https://api.weatherapi.com/v1/current.json`, {
          params: { key: process.env.WEATHER_API_KEY, q: city }
      });
      res.json(response.data);
      db.query('INSERT INTO search_history (city_name) VALUES (?)', [city], (err, result) => {
        if (err) console.error('Lỗi lưu history:', err);
      });      
  } catch (error) {
      console.error('Lỗi API:', error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get('/history', async (req, res) => {
  try {
    //const [rows] = await db.query('SELECT DISTINCT city_name FROM search_history ORDER BY id DESC LIMIT 10')
    const [rows] = await db.query(`
      SELECT city_name 
      FROM search_history 
      GROUP BY city_name 
      ORDER BY MAX(id) DESC 
      LIMIT 10
  `);
  
    res.json(rows)
  } catch (error) {
    console.error('Lỗi lấy history:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})



app.get('/top-cities', (req, res) => {
  db.query('SELECT city_name, COUNT(*) AS total FROM search_history GROUP BY city_name ORDER BY total DESC LIMIT 5', (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi lấy top city' });
    res.json(results);
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
