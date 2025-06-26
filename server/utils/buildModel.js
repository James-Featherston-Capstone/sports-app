const buildProfile = (req) => {
  const userId = parseInt(req.params.userId);
  const profile = { userId: userId };
  const { firstname, lastname, description, location, sports } = req.body;
  addIfPresent(firstname, "firstname", profile);
  addIfPresent(lastname, "lastname", profile);
  addIfPresent(description, "description", profile);
  addIfPresent(location, "location", profile);
  addIfPresent(sports, "sports", profile);
  return profile;
};

const buildUserUpdates = (req) => {
  const userId = parseInt(req.params.userId);
  const user = { id: userId };
  const { username, pfp } = req.body;
  addIfPresent(username, "username", user);
  addIfPresent(pfp, "pfp", user);
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

const addIfPresent = (variable, name, obj) => {
  if (variable) {
    obj[name] = variable;
  }
};

module.exports = { buildProfile, buildUserUpdates, buildEvent };
