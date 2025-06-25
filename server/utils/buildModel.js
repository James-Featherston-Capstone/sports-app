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

const addIfPresent = (variable, name, obj) => {
  if (variable) {
    obj[name] = variable;
  }
};

module.exports = { buildProfile, buildUserUpdates };
