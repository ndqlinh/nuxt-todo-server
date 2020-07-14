const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const config = require('../config.json');

// Retrieve and return all users from database
exports.findAll = (req, res) => {
  User.find().then(users => {
    res.send(users);
  }).catch(err => next(err));
};

// Find a single User with a id
exports.findOne = (req, res) => {
  User.findById(req.params.id).then(user => {
    if (!user) {
      return res.status(404).send({
        code: 404,
        message: 'Not found'
      });
    } else {
      res.send(user);
    }
  }).catch(err => next(err));
};

// Create and save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      code: 400,
      message: 'Bad request'
    });
  }

  // Create a new User
  const user = new User({
    username: req.body.username,
    hash: bcrypt.hashSync(req.body.password, 10)
  });

  // Save user in the database
  user.save().then(data => {
    res.send({ code: 200, message: 'Success' })
  }).catch(err => next(err));
};

exports.update = (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      code: 400,
      message: 'Bad request'
    });
  }

  // Find user and update it with the request body
  User.findByIdAndUpdate(req.params.id, {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10)
  }).then(user => {
    if(!user) {
      return res.status(404).send({
        code: 404,
        message: `Not found`
      });
    } else {
      res.send({ code: 200, message: 'Update successful' });
    }
  }).catch(err => next(err));
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  User.findByIdAndRemove(req.params.id).then(user => {
    if(!user) {
      return res.status(404).send({
        code: 404,
        message: 'Not found'
      });
    } else {
      res.send({ code: 200, message: 'Deleted successful' });
    }
  }).catch(err => next(err));
}

exports.authenticate = async (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      code: 400,
      message: 'Bad request'
    });
  }

  User.findOne({username: req.body.username}).then(user => {
    if (!user) {
      return res.send({
        code: 404,
        message: `Username ${req.body.username} have not regiter yet`
      });
    } else {
      const token = jwt.sign(
        { id: user._id, username: user.username },
        config.secret,
        { expiresIn: '7d' }
      );
      user.tokens = token;
      user.save();
      return res.send({
        code: 200,
        ...user.toJSON(),
        token: token
      });
    }
  }).catch(err => next(err));
}
