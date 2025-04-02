const express = require("express");
const { getSecurityStatus } = require("../controllers/securityController");

const router = express.Router();

// 보안 상태 확인 API
router.get("/verify-security", getSecurityStatus);

module.exports = router;
