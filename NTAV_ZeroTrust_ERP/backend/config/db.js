const mysql = require('mysql2');
// require('dotenv').config({ path: '/home/ntavadmin/ntavProject/backend/.env' });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
    throw err;
  }
  console.log('MySQL에 성공적으로 연결되었습니다.');
});

module.exports = db;
