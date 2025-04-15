const express = require('express');
const { getProjects, updateProjectTitleSection, updateProjectManager, deleteEmployeesFromProject } = require('../controllers/projectController');

const router = express.Router();

// 프로젝트 목록 조회
router.get('/projects', getProjects);

// 특정 프로젝트 수정
router.put('/updateProjectTitleSection', updateProjectTitleSection);

// 프로젝트 매니저 수정
router.patch('/updateProjectManager', updateProjectManager);

// 삭제 요청 핸들링
router.post('/deleteEmployeesFromProject', deleteEmployeesFromProject);

module.exports = router;