const expressJwt = require('express-jwt');
const config = require('../config.json');
const userController = require('../controllers/user.controller');

module.exports = jwt;

function jwt() {
  const secret = config.secret;
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked
  }).unless({
    path: [
      // public routes that don't require authentication
      '/api/users/login',
      '/api/users/register'
    ]
  });
}

isRevoked = (req, payload, done) => {
  // Find user by ID
  userController.findOne(payload.sub, (err, user) => {
    if (!user) {
      return done(null, true)
    }
    done();
  });
};
