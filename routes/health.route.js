const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');

router.get('/check-health', healthController);

module.exports = router;
