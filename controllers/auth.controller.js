const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const jwtHelper = require('../helpers/jwt.helper');
const config = require('../config.json');
const debug = console.log.bind(console);
const accessTokenSecret = config.secret;
const accessTokenLife = '5m';
const refreshTokenSecret = config.refreshSecret;
const refreshTokenLife = '3650d';

/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
exports.login = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      code: 400,
      message: 'Bad request'
    });
  }

  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send({
        code: 404,
        message: `Username or password is invalid!`
      });
    } else {
      const match = await bcrypt.compareSync(req.body.password, user.hash);
      if (match) {
        const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
        const refreshToken = await jwtHelper.generateToken(user, refreshTokenSecret, refreshTokenLife);
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        user.save(err => {
          if (err) {
            return res.status(403).json(err);
          }
          return res.status(200).json({
            code: 200,
            ...user.toJSON()
          });
        });
      } else {
        return res.status(403).send({
          code: 403,
          message: 'Password is not matched'
        });
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}

/**
 * controller refreshToken
 * @param {*} req 
 * @param {*} res 
 */
exports.refreshToken = async (req, res) => {
  const clientRefreshToken = req.body.refreshToken;
  if (clientRefreshToken) {
    try {
      const user = await User.findOne({ refreshToken: clientRefreshToken });
      if (!user) {
        return res.status(404).send({
          code: 404,
          message: 'Cannot find token.'
        });
      } else {
        const decoded = await jwtHelper.verifyToken(clientRefreshToken, config.refreshSecret);
        const userData = decoded.data;
        const accessToken = await jwtHelper.generateToken(userData, config.secret, accessTokenLife);
        user.accessToken = accessToken;
        await user.save();
        return res.status(200).json({ accessToken });
      }
    } catch (error) {
      debug(error);
      return res.status(403).json({
        message: 'Invalid refresh token.',
      });
    }
  } else {
    return res.status(403).send({
      message: 'No token provided.',
    });
  }
}

/**
 * controller logout
 * @param {*} req 
 * @param {*} res 
 */
exports.logout = async (req, res) => {
  try {
    const user = await User.findOne({ accessToken: req.headers['x-access-token'] });
    if (!user) {
      return res.status(404).send({
        code: 404,
        message: 'Cannot find token.'
      });
    } else {
      user.accessToken = '';
      user.refreshToken = '';
      await user.save();
      res.status(200).json({ code: 200, message: 'Logout success' });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}

/**
 * controller register
 * @param {*} req 
 * @param {*} res 
 */
exports.register = async (req, res) => {
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
    res.status(200).send({ code: 200, message: 'Register success' })
  }).catch(err => next(err));
}
