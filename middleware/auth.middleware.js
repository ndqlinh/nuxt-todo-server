const jwtHelper = require('../helpers/jwt.helper');
const config = require('../config.json');
const User = require('../models/user.model');
const debug = console.log.bind(console);
const accessTokenSecret = config.secret;

/**
 * Middleware: Authorization user by Token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const isAuth = async (req, res, next) => {
  const clientToken = req.body.token || req.query.token || req.headers['x-access-token'];

  if (clientToken) {
    try {
      const user = await User.findOne({ accessToken: clientToken });
      if (user) {
        const decoded = await jwtHelper.verifyToken(clientToken, accessTokenSecret);
        req.jwtDecoded = decoded;
        next();
      } else {
        return res.status(401).json({
          code: 401,
          message: 'Unauthorized.',
        });
      }
    } catch (err) {
      debug("Error while verify token:", error);
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized.',
      });
    }
  } else {
    return res.status(401).send({
      code: 401,
      message: 'No token provided.',
    });
  }
}

module.exports = {
  isAuth: isAuth,
};
