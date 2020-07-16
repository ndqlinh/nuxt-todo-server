const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const jwtHelper = require('../helpers/jwt.helper');
const config = require('../config.json');
const debug = console.log.bind(console);
const accessTokenSecret = config.secret;
const accessTokenLife = '1h';
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

  const account = {
    username: req.body.username,
    hash: bcrypt.hashSync(req.body.password, 10)
  };

  try {
    const user = await User.findOne({username: req.body.username});
    // if (!user) {
    //   return res.send({
    //     code: 404,
    //     message: `Username ${req.body.username} have not register yet`
    //   });
    // } else {
    //   const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
    //   const refreshToken = await jwtHelper.generateToken(user, refreshTokenSecret, refreshTokenLife);
    //   user.tokens[refreshToken] = {accessToken, refreshToken};
    //   user.update((err, user) => {
    //     if (err) {
    //       return res.json(err);
    //     }
    //     return res.status(200).json({
    //       code: 200,
    //       ...user.toJSON(),
    //       accessToken,
    //       refreshToken
    //     });
    //   });
    // }
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
      const user = User.findOne({
        tokens: { clientRefreshToken: clientRefreshToken }
      });
      if (!user) {
        return res.send({
          code: 404,
          message: 'Cannot find token.'
        });
      } else {
        const decoded = await jwtHelper.verifyToken(clientRefreshToken, refreshTokenSecret);
        const userFakeData = decoded.data;
        const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife);
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
