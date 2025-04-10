const express = require('express');
const { getProjects } = require('../controllers/projectController');

const router = express.Router();

// 프로젝트 목록 조회
router.get('/projects', getProjects);

module.exports = router;