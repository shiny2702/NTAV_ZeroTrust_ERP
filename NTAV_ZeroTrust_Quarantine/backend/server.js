const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const envRoute = require('./routes/envRoutes');

const app = express();

// CORS 설정
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors(corsOptions));

// JSON 요청 본문 파싱
app.use(express.json());

// UTF-8 인코딩 설정 (한글 깨짐 방지)
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// 업로드 폴더 생성
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// multer 설정 (파일명 유지)
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// 기본 GET 요청
app.get('/', (req, res) => {
    res.send('🚀 서버가 정상적으로 실행 중입니다.');
});

// 파일 업로드 엔드포인트
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        console.log("파일 업로드 실패: 요청에 파일이 없음.");
        return res.status(400).send('File upload failed!\n');
    }
    console.log(`파일 업로드 성공: ${req.file.originalname} → ${req.file.path}`);
    res.send('File uploaded successfully\n');  // JSON 대신 단순 텍스트 응답
});

// 파일 목록 조회
app.get('/files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: '파일 목록을 불러오는 중 오류 발생' });
        }
        res.json({ files });
    });
});

// 파일 다운로드
app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
    }
});

// 기본 에러 처리 미들웨어
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '서버에서 오류가 발생했습니다.' });
});

// 서버 실행
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
