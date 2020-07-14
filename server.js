const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./helpers/error-handler');
const jwt = require('./helpers/jwt');

require('dotenv').config();

// Create express app
const app = express();

// Setup server port
const port = process.env.PORT || 5000;

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// Configuring the database
const dbConfig = require('./config/db.config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
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

// global error handler
app.use(errorHandler);

process
  .on('SIGTERM', shutdown('SIGTERM'))
  .on('SIGINT', shutdown('SIGINT'))
  .on('uncaughtException', shutdown('uncaughtException'));

// Listen for requests
app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Node server is listening on port ${port}`);
});

function shutdown(signal) {
  return (err) => {
    console.log(`${ signal }...`);
    if (err) console.error(err.stack || err);
    setTimeout(() => {
      console.log('...waited 5s, exiting.');
      process.exit(err ? 1 : 0);
    }, 5000).unref();
  };
}
