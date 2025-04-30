const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// require('dotenv').config({ path: '/home/ntavadmin/ntavProject/backend/.env' });
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const roleRoutes = require('./routes/roleRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// SSL 인증서 로딩
const options = {
  key: fs.readFileSync('./ssl/key.pem'), // 개인 키 파일 경로
  cert: fs.readFileSync('./ssl/cert.pem') // 인증서 파일 경로
};

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json()); // JSON 요청 본문 처리
app.use(express.json()); // bodyParser와 중복되지만, 유지 가능

// 라우터 연결
app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/project', projectRoutes);

// // 서버 실행
// const PORT = process.env.PORT || 4430;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
// });

// 서버 실행
const PORT = process.env.PORT || 4430;

// HTTPS 서버로 실행
https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
  console.log(`HTTPS 서버가 ${PORT}번 포트에서 실행 중입니다.`);
});