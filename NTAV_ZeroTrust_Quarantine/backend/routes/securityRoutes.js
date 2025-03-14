const express = require("express");
const { getSecurityStatus } = require("../controllers/securityController");

const router = express.Router();

// 보안 상태 확인 API
router.get("/security", getSecurityStatus);

module.exports = router;
