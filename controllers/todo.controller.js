const Todo = require('../models/todo.model');

// Retrieve and return all todos from database
exports.findAll = (req, res) => {
  Todo.find().then(todos => {
    res.send(todos);
  }).catch(err => next(err));
};

// Retrieve and return all todos by user id from database
exports.findAllById = (req, res) => {
  Todo.find({ userId: req.body.userId }).then(todos => {
    res.send(todos);
  }).catch(err => next(err));
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
  }).catch(err => next(err));
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
    name: req.body.name,
    userId: req.params.id
  });
  // Save todo in the database
  todo.save().then(() => {
    res.send({ code: 200, message: 'Success', todo: todo })
  }).catch(err => next(err));
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
    name: req.body.name,
    isActive: req.body.isActive
  }).then(todo => {
    if(!todo) {
      return res.status(404).send({
        code: 404,
        message: `Not found`
      });
    } else {
      res.send({ code: 200, message: 'Update successful' });
    }
  }).catch(err => next(err));
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
  }).catch(err => next(err));
}

// Delete all todos
exports.deleteAll = (req, res) => {
  Todo.remove().then(() => {
    res.send({ code: 200, message: 'Deleted successful' });
  }).catch(err => next(err))
}
