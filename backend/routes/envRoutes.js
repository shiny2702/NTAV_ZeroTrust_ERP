const express = require('express');
const { generateDeviceToken } = require('../controllers/envController')

const router = express.Router();

router.post('/verify-device', generateDeviceToken);

module.exports = router;
