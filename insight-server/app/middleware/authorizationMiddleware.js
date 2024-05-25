const { policyFor } = require("../../utils/policies");

function checkAuthorization(action, subject) {
  return function(req, res, next) {
    let policy = policyFor(req.user);

    if (!policy.can(action, subject)) {
      return res.json({
        error: 1,
        message: `You are not allowed to ${action} ${subject}`
      });
    }
    next();
  }
}

module.exports = {
  checkAuthorization
}