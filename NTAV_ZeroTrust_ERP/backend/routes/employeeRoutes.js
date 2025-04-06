const express = require('express');
const { getEmployees, getRegisterableEmployees, getEmployeeInfo, registerEmployee, deleteEmployees, updateEmployee, sendEmployeeEmail } = require('../controllers/employeeController');

const router = express.Router();

// 직원 목록 조회
router.get('/employees', getEmployees);

// 등록 가능한 직원 목록 조회
router.get("/registerable", getRegisterableEmployees);

// 특정 직원 상세 정보 조회
router.get("/details/:id", getEmployeeInfo);

// 직원 등록
router.post('/employees', registerEmployee);

// 직원 삭제
router.delete('/employees', deleteEmployees);

// 직원 정보 업데이트 (PUT)
router.put('/employees/:id', updateEmployee);

// 이메일 전송 API 추가
router.post("/send-email", sendEmployeeEmail);

module.exports = router;


