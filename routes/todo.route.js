const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');

// Retrieve all users
router.get('/', todoController.findAll);

// Create new user
router.post('/', todoController.create);

// Retrieve a single user with id
router.get('/:id', todoController.findOne);

// Update a user with id
router.put('/:id', todoController.update);

// Delete a user with id
router.delete('/:id', todoController.delete);

module.exports = router;
