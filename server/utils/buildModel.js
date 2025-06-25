const buildProfile = (req) => {
  const userId = parseInt(req.params.userId);
  const profile = { userId: userId };
  const { username, firstname, lastname, description, location, sports, pfp } =
    req.body;
  addIfPresent(username, "username", profile);
  addIfPresent(firstname, "firstname", profile);
  addIfPresent(lastname, "lastname", profile);
  addIfPresent(description, "description", profile);
  addIfPresent(location, "location", profile);
  addIfPresent(sports, "sports", profile);
  addIfPresent(pfp, "pfp", profile);
  return profile;
};

const addIfPresent = (variable, name, obj) => {
  if (variable) {
    obj[name] = variable;
  }
};

module.exports = { buildProfile };
