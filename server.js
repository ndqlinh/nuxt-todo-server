const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./helpers/error-handler');
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();

// Create express app
const app = express();

// Setup server port
const port = process.env.PORT || 3000;

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Configuring the database
const dbConfig = require('./config/db.config');

const client = new MongoClient(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('documents');

  // the following code examples can be pasted here...

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());

// const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// // Connecting to the database
// mongoose.connect(dbConfig.url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
// mongoose.connection.once('open', () => {
//   console.log('Successfully connected to the database!');
// }).on('error', error => {
//   console.log('Error is: ', error);
//   process.exit();
// });

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
app.listen(port, '0.0.0.0', () => {
  console.log(`Node server is listening on port ${port}`);
});
