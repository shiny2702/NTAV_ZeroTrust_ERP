const express = require('express');
const { } = require('../controllers/roleController');

const router = express.Router();

router.post("/roleInfoWholeRegenerate", roleInfoWholeRegenerate);

router.post("/roleInfoRegenerate", roleInfoRegenerate);

module.exports = router;