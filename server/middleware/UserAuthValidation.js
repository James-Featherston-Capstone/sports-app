const { UnauthorizedError } = require("./Errors");

const checkSessionExists = (req, res, next) => {
  if (
    req.url === "/api/auth/login" ||
    req.url === "/api/auth/register" ||
    req.url === "/api/auth/me"
  ) {
    next();
  } else if (req.session && req.session.user) {
    next();
  } else {
    throw new UnauthorizedError("User is not logged in");
  }
};

module.exports = { checkSessionExists };
