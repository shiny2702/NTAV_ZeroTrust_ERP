const express = require('express');
const { verifyTokens } = require('../controllers/tokenVerifyController');

const router = express.Router();

router.get('/verifyTokens', verifyTokens);

module.exports = router;