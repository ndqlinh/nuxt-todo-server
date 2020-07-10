const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
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

// Configuring the database
const dbConfig = require('./config/db.config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connecting to the database
// mongoose.connect(dbConfig.url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('Successfully connected to the database.');
// }).catch(err => {
//   console.log("Couldn't connect to the database.", err);
//   process.exit();
// });
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once('open', () => {
  console.log('Conection has been made!');
}).on('error', error => {
  console.log('Error is: ', error);
});

// Define a root/default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Nuxt Todo Server' });
});

// Require Users routes
const userRoute = require('./routes/user.route');
// Using as middleware
app.use('/api/users', userRoute);

// Listen for requests
app.listen(port, () => {
  console.log(`Node server is listening on port ${port}`);
});
