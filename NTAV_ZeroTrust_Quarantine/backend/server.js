const express = require('express');
const cors = require('cors');
require('dotenv').config();

const envRoute = require('./routes/envRoutes');

const app = express();

// CORS 설정 (특정 도메인 허용)
const corsOptions = {
    origin: process.env.CLIENT_URL || '*',  // 허용할 도메인 환경변수에서 설정 가능
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors());

// JSON 요청 본문 파싱
app.use(express.json());

// 환경 체크 라우트
app.use('/api', envRoute);

// 기본 에러 처리 미들웨어 추가 (기타 예상치 못한 오류 처리)
app.use((err, req, res, next) => {
    console.error(err.stack); // 에러 로그 출력
    res.status(500).json({ error: '서버에서 오류가 발생했습니다.' });
});

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
