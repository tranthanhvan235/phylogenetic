const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root',
  password: '12345678', 
  database: 'weather_app'
}).promise();

connection.connect((err) => {
  if (err) {
    console.error('Connection error:', err);
    return;
  }
  console.log('MySQL Connected!');
});

module.exports = connection;
