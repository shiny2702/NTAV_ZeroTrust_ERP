const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config({ path: '/home/ntavadmin/ntavProject/backend/.env' });
// require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const roleRoutes = require('./routes/roleRoutes');
const projectRoutes = require('./routes/projectRoutes');
const orgRoutes = require('./routes/orgRoutes');
const financeRoutes = require('./routes/financeRoutes');
const tokenVerifyRoutes = require('./routes/tokenVerifyRoutes');
const clearCookiesRoutes = require('./routes/clearCookiesRoutes');

const authenticate = require('./middleware/authenticate');
const writeCheckWithMfa = require('./middleware/writeCheckWithMfa');

const app = express();

// SSL 인증서 로딩
const options = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')), // 개인 키 파일 경로
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem')) // 인증서 파일 경로
};

const allowedOrigins = [
  'https://ntav.project:4430',
  process.env.NGROK_BASE_URL,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman, curl 같은 도구를 위한 예외 처리
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // 쿠키 포함 허용
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 


app.use(bodyParser.json()); // JSON 요청 본문 처리
app.use(cookieParser());

app.use(express.json()); // bodyParser와 중복되지만, 유지 가능

// JWT 인증 미들웨어 적용
app.use(authenticate); // 모든 API에 인증 미들웨어 적용 
// MFA 미들웨어 - write 요청에 대해서만 적용
app.use(writeCheckWithMfa); // 모든 write요청 중 민감한 DB 접근시 MFA 체크  


// 정적 파일 서비스 (PDF 다운로드용)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 기본 GET 요청
app.get('/', (req, res) => {
    res.send('🚀 서버가 정상적으로 실행 중입니다.');
});

// 라우터 연결
app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/tokenVerify', tokenVerifyRoutes);
app.use('/api/clearCookies', clearCookiesRoutes);


// 서버 실행
const PORT = process.env.PORT || 5000;

// HTTPS 서버로 실행
https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
  console.log(`HTTPS 서버가 ${PORT}번 포트에서 실행 중입니다.`);
});



// // 서버 실행
// const PORT = process.env.PORT || 4430;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
// });