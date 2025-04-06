const express = require('express');
const { login, verifyPassword, updatePassword, updateInitialPasswordStatus } = require('../controllers/authController');

const router = express.Router();

// 로그인 라우트
router.post('/login', login);

// 비밀번호 확인 라우트
router.post('/verify-password', verifyPassword);

// 비밀번호 변경 버튼 실행행
router.put("/update-password", updatePassword);

// 초기 비밀번호 여부 업데이트 라우트
router.patch("/update-initial-password", updateInitialPasswordStatus);

module.exports = router;



