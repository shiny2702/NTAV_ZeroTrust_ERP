// 서버 설정 및 Express 앱 실행 파일
// MySQL 데이터베이스 연결과 라우팅 처리

const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
require('dotenv').config();
const environmentRoutes = require('./routes/envCheck');

const app = express();

// CORS 설정 (모든 도메인 허용)
app.use(cors());
// JSON 바디 파싱싱
app.use(bodyParser.json());

// 환경 체크 라우트트
app.use('/api/environment-check', environmentRoutes);  // 환경 체크 라우트

// 서버 시작
// app.listen(5000, () => {
//   console.log('Server running on port 5000');
// });
const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`The server is running on port ${port}.`);
})


// 특정 도메인만 CORS 허용
// const corsOptions = {
//     origin: 'http://localhost:3000',  // 프론트엔드 도메인
//     methods: 'GET,POST,PUT,DELETE',   // 허용할 HTTP 메소드
//     allowedHeaders: 'Content-Type,Authorization'  // 허용할 헤더
//   };
  
//   const app = express();
  
//   // CORS 미들웨어 적용
//   app.use(cors(corsOptions));
