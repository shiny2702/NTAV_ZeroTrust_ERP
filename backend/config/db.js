// MySQL DB 연결 설정

const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err);
    throw err;
  }
  console.log('MySQL connection successful.');
});

module.exports = db;
