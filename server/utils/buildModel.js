const buildProfile = (req) => {
  const userId = parseInt(req.params.userId);
  const user = { id: userId };
  const { bio, location, sports, username, email, profile_image_url } =
    req.body;
  addIfPresent(bio, "bio", user);
  addIfPresent(location, "location", user);
  addIfPresent(sports, "sports", user);
  addIfPresent(username, "username", user);
  addIfPresent(email, "email", user);
  addIfPresent(profile_image_url, "profile_image_url", user);
  return user;
};

const buildEvent = (req) => {
  const event = {};
  const { organizerId, eventImage, sport, description, eventTime, location } =
    req.body;
  addIfPresent(organizerId, "organizerId", event);
  addIfPresent(eventImage, "eventImage", event);
  addIfPresent(sport, "sport", event);
  addIfPresent(description, "description", event);
  addIfPresent(eventTime, "eventTime", event);
  addIfPresent(location, "location", event);
  return event;
};

const buildComment = (req) => {
  const eventId = parseInt(req.params.eventId);
  const commentObj = { eventId: eventId };
  const { authorId, comment } = req.body;
  const intAId = parseInt(authorId);
  addIfPresent(intAId, "authorId", commentObj);
  addIfPresent(comment, "comment", commentObj);
  return commentObj;
};

const addIfPresent = (variable, name, obj) => {
  if (variable) {
    obj[name] = variable;
  }
};

module.exports = { buildProfile, buildEvent, buildComment };
