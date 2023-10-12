const { getToken } = require("../../utils/tokenUtils")
const jwt = require('jsonwebtoken');
const config = require("../config");
const User = require("../model/userModel");

function decodeToken() {
  return async function(req, res, next) {
    try {
      let token = getToken(req);

      if (!token) {
        return next()
      };
      
      req.user = jwt.verify(token, config.secretkey);

      const decodedToken = jwt.decode(token, { complete: true });
      console.log(decodedToken, '<<<< Decode Token');

      let user = await User.findOne({token: {$in: [token]} });
      if (!user) {
        res.json({
          error: 1,
          message: 'Token Expired'
        });
      }

    } catch (err) {
      if (err && err.name === 'JsonWebTokenError') {
        return res.json({
          error: 1,
          message: err.message
        });
      }
    }
    return next();
  }
}

module.exports = {
  decodeToken
}