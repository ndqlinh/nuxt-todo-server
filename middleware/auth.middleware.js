const jwtHelper = require('../helpers/jwt.helper');
const config = require('../config.json');
const debug = console.log.bind(console);
const accessTokenSecret = config.secret;

/**
 * Middleware: Authorization user by Token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const isAuth = async (req, res, next) => {
  const clientToken = req.body.token || req.query.token || req.headers['Authorization'];

  if (clientToken) {
    try {
      const decoded = await jwtHelper.verifyToken(clientToken, accessTokenSecret);
      req.jwtDecoded = decoded;
      next();
    } catch (err) {
      debug("Error while verify token:", error);
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }
  } else {
    return res.status(403).send({
      message: 'No token provided.',
    });
  }
}

module.exports = {
  isAuth: isAuth,
};
