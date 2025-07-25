const { UnauthorizedError } = require("../middleware/Errors.js");
const userService = require("../services/userService.js");
const locationUtils = require("../recommendations/locationUtils.js");

const { buildProfile } = require("../utils/buildModel.js");

exports.updateUserProfile = async (req, res) => {
  const userObj = buildProfile(req);
  const updatedAt = new Date();
  userObj.updated_at = updatedAt;
  if (userObj.location) {
    await locationUtils.extractLatLngFields(userObj);
  } else {
    throw new ValidationError("Location missing");
  }
  const updatedUser = await userService.updateUser(userObj);
  res.json(updatedUser);
};

exports.getUserProfile = async (req, res) => {
  const userId = req.session.user.id;
  const user = await userService.getUser(userId);
  res.json(user);
};

exports.getAllUsers = async (req, res) => {
  const user = req.session.user;
  if (!user) {
    throw new UnauthorizedError("Must be logged in");
  }
  const users = await userService.getAllUsers(user.id);
  res.json(users);
};
