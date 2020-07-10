const Todo = require('../models/todo.model');

// Retrieve and return all todos from database
exports.findAll = (req, res) => {
  Todo.find().then(todos => {
    res.send(todos);
  }).catch(err => {
    res.status(500).send({
      message: err.message || 'Internal server error'
    });
  });
};

// Find a single Todo with a id
exports.findOne = (req, res) => {
  Todo.findById(req.params.id).then(todo => {
    if (!todo) {
      return res.status(404).send({
        code: 404,
        message: 'Not found'
      });
    } else {
      res.send(todo);
    }
  }).catch(err => {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({
        code: 404,
        message: `Not found`
      });
    } else {
      return res.status(500).send({
        code: 500,
        message: err.message || `Internal server error`
      });
    }
  });
};

// Create and save a new Todo
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      code: 400,
      message: 'Bad request'
    });
  }
  // Create a new Todo
  const todo = new Todo({
    name: req.body.todo
  });
  // Save todo in the database
  todo.save().then(() => {
    res.send({ code: 200, message: 'Success' })
  }).catch(err => {
    res.status(500).send({
      code: 500,
      message: err.message || 'Internal server error'
    });
  });
};

// Update a single Todo with a id
exports.update = (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      code: 400,
      message: 'Bad request'
    });
  }

  // Find todo and update it with the request body
  Todo.findByIdAndUpdate(req.params.id, {
    name: req.body.todo,
    isActive: req.body.isActive
  }, { new: true }).then(todo => {
    if(!todo) {
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

// Delete a Todo with the specified id in the request
exports.delete = (req, res) => {
  Todo.findByIdAndRemove(req.params.id).then(todo => {
    if(!todo) {
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
