const jwt = require('jsonwebtoken');
const authConfig = require('../../configuration/auth.config');

const checkToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Authorization failed, supply the header Authorization Header!',
    });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, authConfig.SECRET, (error, decoded) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    req.decoded = decoded;
    return next();
  });
};

module.exports = {
  checkToken,
};
