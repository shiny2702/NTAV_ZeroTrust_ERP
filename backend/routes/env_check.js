// 클라이언트에서 보낸 환경 정보를 받아 처리하는 라우터

const express = require('express');
const router = express.Router();
const environmentController = require('../controllers/env_controller');

router.post('/', environmentController.checkEnvironment);

module.exports = router;
