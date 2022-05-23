const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');

// Using as middleware before APIs which need to be verified
const authMiddleWare = require('../middleware/auth.middleware');
router.use(authMiddleWare.isAuth);

// Retrieve all todos
router.get('/', todoController.findAll);

// Get all todos by user id
router.post('/', todoController.findAllById);

// Create new todo
router.post('/:id', todoController.create);

// Retrieve a single todo with id
router.get('/:id', todoController.findOne);

// Update a todo with id
router.put('/:id', todoController.update);

// Delete a todo with id
router.delete('/:id', todoController.delete);

// Delete all todos
router.delete('/', todoController.deleteAll);

module.exports = router;
