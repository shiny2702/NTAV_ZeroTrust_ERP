const express = require('express');
const { clearingCookies } = require('../controllers/clearCookiesController');

const router = express.Router();

router.post('/clearingCookies', clearingCookies);

module.exports = router;