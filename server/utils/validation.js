const { ValidationError } = require("../middleware/Errors");

const validateNewUser = (req) => {
  if (!req.body.username || !req.body.firstname || !req.body.lastname) {
    throw new ValidationError("Must include username, firstname, and lastname");
  }
};

module.exports = { validateNewUser };
