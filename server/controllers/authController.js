const authService = require("../services/authService");
const { hashPassword, verifyPassword } = require("../utils/argon");
const {
  ValidationError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} = require("../middleware/Errors");
const { buildProfile } = require("../utils/buildModel");
const locationUtils = require("../recommendations/locationUtils.js");

exports.register = async (req, res) => {
  const { email, password: plainPassword, username } = req.body;
  if (!email || !plainPassword || !username) {
    throw new ValidationError("Missing email or password");
  }
  const filters = { email: email };
  const existingUser = await authService.getUser(filters);
  if (existingUser) {
    throw new ConflictError("This email is already in use");
  }
  const profile = buildProfile(req);
  const hash = await hashPassword(plainPassword);
  const userCredentials = { email, password: hash, username: username };
  const newUser = { ...profile, ...userCredentials };
  await locationUtils.extractLatLngFields(newUser);
  if (
    !newUser.bio ||
    !newUser.location ||
    !newUser.latitude ||
    !newUser.longitude ||
    !newUser.latitudeKey ||
    !newUser.longitudeKey
  ) {
    throw new ValidationError("Location and bio required");
  }
  const retUser = await authService.createUser(newUser);
  req.session.user = retUser;
  res.json(retUser);
};

exports.checkEmailAndPassword = async (req, res) => {
  const { email, username } = req.body;
  if (!email || !username) {
    throw new ValidationError("Missing email");
  }
  const filters = { OR: [{ email: email }, { username: username }] };
  const existingUser = await authService.getUser(filters);
  if (!existingUser) {
    res.json({ emailInUse: false, usernameInUse: false });
  } else if (
    existingUser.username === username &&
    existingUser.email === email
  ) {
    res.json({ emailInUse: true, usernameInUse: true });
  } else if (existingUser.username === username) {
    res.json({ emailInUse: false, usernameInUse: true });
  } else {
    res.json({ emailInUse: true, usernameInUse: false });
  }
};

exports.login = async (req, res) => {
  const { email, password: plainPassword } = req.body;
  if (!email || !plainPassword) {
    throw new ValidationError("Missing email or password");
  }
  const filters = { email: email };
  const user = await authService.getUser(filters);
  if (user && (await verifyPassword(plainPassword, user.password))) {
    req.session.user = user;
    res.json(user);
  } else {
    throw new NotFoundError("Email or password is incorrect.");
  }
};

exports.logout = async (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logout successful" });
  });
};
