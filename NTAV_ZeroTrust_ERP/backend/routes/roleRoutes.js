const express = require('express');
const {roleInfoWholeRegenerate } = require('../controllers/roleController');

const router = express.Router();

router.post("/roleInfoWholeRegenerate", roleInfoWholeRegenerate);

module.exports = router;