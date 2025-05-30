const https = require('https');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // ✅ 쿠키 파서 추가
const multer = require('multer');
const fs = require('fs');
const path = require('path');
// require('dotenv').config();
require('dotenv').config({ path: '/home/ntavadmin/ntavProject/backend/.env' });

const envRoutes = require('./routes/envRoutes');
const securityRoutes = require('./routes/securityRoutes');

const app = express();

// SSL 인증서 로딩
const options = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', '192.168.100.52-key.pem')), // 개인 키 파일 경로
  cert: fs.readFileSync(path.join(__dirname, 'ssl', '192.168.100.52.pem')) // 인증서 파일 경로
};

// ✅ CORS 설정 (자격 증명 허용)
const corsOptions = {
  origin: 'https://ntav.project:4430',   
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true                      // 쿠키/세션 전송 허용
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ preflight 요청 허용

// ✅ 쿠키 파싱 미들웨어
app.use(cookieParser());

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
  console.log("📁 uploads 폴더 없음. 생성 중...");
  fs.mkdirSync(uploadDir);
}
console.log("📁 업로드 디렉토리 경로:", uploadDir);

// multer 설정 (파일명 유지)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📥 multer: 저장 경로 설정 →", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log("📛 multer: 저장할 파일명 →", file.originalname);
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

console.log("📦 multer 설정 완료");

// 기본 GET 요청
app.get('/', (req, res) => {
    res.send('🚀 서버가 정상적으로 실행 중입니다.');
});

app.post('/uploads', upload.single('file'), (req, res) => {
    if (!req.file) {
        console.log("파일 업로드 실패: 요청에 파일이 없음.");
        return res.status(400).send('File upload failed!\n');
    }
    console.log(`파일 업로드 성공: ${req.file.originalname} → ${req.file.path}`);
    res.send('File uploaded successfully\n');  // JSON 대신 단순 텍스트 응답
});

// 파일 업로드 엔드포인트
app.get('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        console.log("파일 업로드 실패: 요청에 파일이 없음.");
        return res.status(400).send('File upload failed!\n');
    }
    console.log(`파일 업로드 성공: ${req.file.originalname} → ${req.file.path}`);
    res.send('File uploaded successfully\n');  // JSON 대신 단순 텍스트 응답
});

// ✅ 업로드 파일 목록 조회
app.get('/files', (req, res) => {
  console.log("📄 [GET] /files 요청 수신");
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("❌ 파일 목록 조회 에러:", err);
      return res.status(500).json({ error: '파일 목록을 불러오는 중 오류 발생' });
    }
    console.log("📄 업로드된 파일 목록:", files);
    res.json({ files });
  });
});

// ✅ 파일 다운로드
app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  console.log("📥 파일 다운로드 요청:", filePath);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    console.warn("❌ 파일 존재하지 않음:", filePath);
    res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
  }
});

// 라우트 등록
app.use('/api', envRoutes);  // 디바이스 검증 API
app.use('/security', securityRoutes);  // 보안 검사 API

// 기본 에러 처리 미들웨어
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '서버에서 오류가 발생했습니다.' });
});

// 서버 실행
const PORT = process.env.PORT || 3001;

// HTTPS 서버로 실행
https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
  console.log(`HTTPS 서버가 ${PORT}번 포트에서 실행 중입니다.`);
});

// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`🚀 서버가 http://192.168.100.52:${PORT} 에서 실행 중입니다.`);
// });
