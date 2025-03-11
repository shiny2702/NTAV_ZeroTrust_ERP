const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// uploads 폴더가 없으면 생성
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 파일 업로드 처리
const upload = multer({ dest: uploadDir });

// 기본 GET 요청 처리
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// POST 요청 처리
app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully\n');
});

app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
