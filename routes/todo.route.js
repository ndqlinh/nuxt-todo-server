const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');

// Retrieve all todos
router.get('/', todoController.findAll);

// Create new todo
router.post('/', todoController.create);

// Retrieve a single todo with id
router.get('/:id', todoController.findOne);

// Update a todo with id
router.put('/:id', todoController.update);

// Delete a todo with id
router.delete('/:id', todoController.delete);

// Delete all todos
router.delete('/', todoController.deleteAll);

module.exports = router;
