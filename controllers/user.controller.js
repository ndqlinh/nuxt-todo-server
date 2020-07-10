const User = require('../models/user.model');

// Retrieve and return all users from database
exports.findAll = (req, res) => {
  User.find().then(users => {
    res.send(users);
  }).catch(err => {
    res.status(500).send({
      code: 500,
      message: err.message || 'Internal server error'
    });
  });
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
  }).catch(err => {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({
        code: 404,
        message: 'Not found'
      });
    } else {
      return res.status(500).send({
        code: 500,
        message: err.message || `Internal server error`
      });
    }
  });
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
    password: req.body.password
  });
  // Save user in the database
  user.save().then(data => {
    res.send({ code: 200, message: 'Success' })
  }).catch(err => {
    res.status(500).send({
      code: 500,
      message: err.message || 'Internal server error'
    });
  });
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
    password: req.body.password
  }, { new: true }).then(user => {
    if(!user) {
      return res.status(404).send({
        code: 404,
        message: `Not found`
      });
    } else {
      res.send({ code: 200, message: 'Update successful' });
    }
  }).catch(err => {
    if(err.kind === 'ObjectId') {
      return res.status(404).send({
        code: 404,
        message: 'Not found'
      });
    } else {
      res.status(500).send({
        code: 500,
        message: err.message || 'Internal server error'
      });
    }
  });
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
  }).catch(err => {
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
        code: 404,
        message: 'Not found'
      });
    } else {
      return res.status(500).send({
        code: 500,
        message: err.message || 'Internal server error'
      });
    }
  });
}
