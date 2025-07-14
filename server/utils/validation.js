const { ValidationError } = require("../middleware/Errors");

const validateNewUser = (req) => {
  if (!req.body.username || !req.body.firstname || !req.body.lastname) {
    throw new ValidationError("Must include username, firstname, and lastname");
  }
};

const validateNewEvent = (req) => {
  const { organizerId, eventTime, location } = req.body;
  if ((!organizerId || !eventTime, !location)) {
    throw new ValidationError("Must include organizerId, time, and location");
  }
};

const validateNewComment = (req) => {
  const eventId = req.params.eventId;
  const { comment } = req.body;
  const authorId = req.session.user.id;
  if ((!eventId || !authorId, !comment)) {
    throw new ValidationError(
      "Must include authorId, eventId, and the comment"
    );
  }
};

module.exports = { validateNewUser, validateNewEvent, validateNewComment };
