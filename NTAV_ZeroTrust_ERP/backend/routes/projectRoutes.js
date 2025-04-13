const express = require('express');
const { getProjects, updateProjectTitleSection } = require('../controllers/projectController');

const router = express.Router();

// 프로젝트 목록 조회
router.get('/projects', getProjects);

// 특정 프로젝트 수정
router.put('/updateProjectTitleSection', updateProjectTitleSection);

module.exports = router;