const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Using as middleware before APIs which need to be verified
const authMiddleWare = require('../middleware/auth.middleware');
// router.use(authMiddleWare.isAuth);

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

// Login with username and password
router.post('/login', userController.authenticate);

module.exports = router;
