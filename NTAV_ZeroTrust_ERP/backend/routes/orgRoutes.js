const express = require('express');
const { fetchEmployeeLists, fetchDepartment, fetchTeam, fetchDeptHead, fetchTeamHead, employeeDetail, updateEmployeeDetail } = require('../controllers/orgController');

const router = express.Router();

router.get('/employeeLists', fetchEmployeeLists);

router.get("/department", fetchDepartment);

router.get("/team", fetchTeam);

router.get('/deptHead', fetchDeptHead);

router.get('/teamHead', fetchTeamHead);

router.post('/employeeDetail', employeeDetail);
 
router.post('/updateEmployeeDetail', updateEmployeeDetail);

module.exports = router;