const express = require('express');
const { clearingUserCookie, clearingDeviceCookie, clearingSecurityCookie } = require('../controllers/clearCookiesController');

const router = express.Router();

router.post('/clearingUserCookie', clearingUserCookie);

router.post('/clearingDeviceCookie', clearingDeviceCookie);

router.post('/clearingSecurityCookie', clearingSecurityCookie);

module.exports = router;