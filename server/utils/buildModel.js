const { extractLatLngFields } = require("../recommendations/locationUtils");
const { mapSports } = require("./mapEnum");

const buildProfile = (req) => {
  const user = {};
  if (req.session.user?.id) {
    user.id = req.session.user.id;
  }
  const {
    bio,
    latitude,
    longitude,
    sports,
    username,
    email,
    location,
    profile_image_url,
  } = req.body;
  const mappedSports = sports.map((sport) => mapSports(sport));
  addIfPresent(bio, "bio", user);
  addIfPresent(latitude, "latitude", user);
  addIfPresent(longitude, "longitude", user);
  addIfPresent(mappedSports, "sports", user);
  addIfPresent(location, "location", user);
  addIfPresent(username, "username", user);
  addIfPresent(email, "email", user);
  addIfPresent(profile_image_url, "profile_image_url", user);
  return user;
};

const buildEvent = (req) => {
  const organizerId = req.session.user.id;
  const event = { organizerId: organizerId };
  const { eventImage, sport, description, eventTime, location } = req.body;
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
  const { comment } = req.body;
  const authorId = req.session.user.id;
  addIfPresent(authorId, "authorId", commentObj);
  addIfPresent(comment, "comment", commentObj);
  return commentObj;
};

const addIfPresent = (variable, name, obj) => {
  if (variable) {
    obj[name] = variable;
  }
};

module.exports = { buildProfile, buildEvent, buildComment };
