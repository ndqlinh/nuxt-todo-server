const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./helpers/error-handler');

require('dotenv').config();

// Create express app
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

// Setup server port
const port = process.env.PORT || 5000;

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

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
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const todoRoute = require('./routes/todo.route');
const healthRoute = require('./routes/health.route');

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/todos', todoRoute);
app.use('/api/health', healthRoute);

// global error handler
app.use(errorHandler);

// Listen for requests
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`Node server is listening on port ${port}`);
});
