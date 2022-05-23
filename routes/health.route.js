const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');
const todoController = require('../controllers/todo.controller');

router.get('/check-health', todoController.findAll);

module.exports = router;
