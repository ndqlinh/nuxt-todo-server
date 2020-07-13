const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Retrieve all users
router.get('/', userController.findAll);

// Create new user
router.post('/', userController.create);

// Retrieve a single user with id
router.get('/:id', userController.findOne);

// Update a user with id
router.put('/:id', userController.update);

// Delete a user with id
router.delete('/:id', userController.delete);

// Register
router.post('/auth/register', userController.register);

// Login
router.post('/auth/login', userController.login);

module.exports = router;
