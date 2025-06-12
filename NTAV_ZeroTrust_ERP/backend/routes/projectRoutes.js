const express = require('express');
const { getProjects, updateProjectTitleSection, updateProjectManager, deleteEmployeesFromProject, addibleEmployeesToProject, addEmployeesToProject } = require('../controllers/projectController');

const router = express.Router();

// 프로젝트 목록 조회
router.get('/projects', getProjects);

// 특정 프로젝트 수정
router.put('/updateProjectTitleSection', updateProjectTitleSection);

// 프로젝트 매니저 수정
router.patch('/updateProjectManager', updateProjectManager);

// 참여직원 삭제
router.post('/deleteEmployeesFromProject', deleteEmployeesFromProject);

// 참여가능직원 조회
router.post('/addibleEmployeesToProject', addibleEmployeesToProject);

// 참여직원 추가
// router.post('/addEmployeesToProject', addEmployeesToProject);

module.exports = router;