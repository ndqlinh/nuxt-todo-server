const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jsonwebtoken = require("jsonwebtoken");
require('dotenv').config();

// Create express app
const app = express();

// Setup server port
const port = process.env.port || 5000;

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use(function(req, res, next) {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', (err, decode) => {
      if (err) {
        req.user = undefined;
      }
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

// Configuring the database
const dbConfig = require('./config/db.config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once('open', () => {
  console.log('Successfully connected to the database!');
}).on('error', error => {
  console.log('Error is: ', error);
  process.exit();
});

// Define a root/default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Nuxt Todo Server' });
});

// Require routes
const userRoute = require('./routes/user.route');
const todoRoute = require('./routes/todo.route');

// Using as middleware
app.use('/api/users', userRoute);
app.use('/api/todos', todoRoute);

// Listen for requests
app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Node server is listening on port ${port}`);
});
