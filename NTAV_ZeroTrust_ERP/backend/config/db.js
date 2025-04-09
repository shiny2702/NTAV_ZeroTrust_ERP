// const mysql = require('mysql2');
// // require('dotenv').config({ path: '/home/ntavadmin/ntavProject/backend/.env' });

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

// db.connect((err) => {
//   if (err) {
//     console.error('MySQL 연결 실패:', err);
//     throw err;
//   }
//   console.log('MySQL에 성공적으로 연결되었습니다.');
// });

// module.exports = db;

const mysql = require('mysql2/promise');
// require('dotenv').config({ path: '/home/ntavadmin/ntavProject/backend/.env' });

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 연결 테스트용
(async () => {
  try {
    await db.query('SELECT 1');
    console.log('MySQL에 성공적으로 연결되었습니다.');
  } catch (err) {
    console.error('MySQL 연결 실패:', err);
    process.exit(1); // 연결 실패 시 서버 종료
  }
})();

module.exports = db;