const userService = require("../services/userService");

const { validateNewUser } = require("../utils/validation");
const { buildProfile, buildUserUpdates } = require("../utils/buildModel");

exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await userService.getUserProfile(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.createUserProfile = async (req, res, next) => {
  try {
    validateNewUser(req);
    const profileObj = buildProfile(req);
    const userObj = buildUserUpdates(req);
    const updateUser = await userService.updateUser(userObj);
    const newProfile = await userService.createUserProfile(profileObj);
    res.json({ ...updateUser, profile: newProfile });
  } catch (error) {
    next(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const profileObj = buildProfile(req);
    const userObj = buildUserUpdates(req);
    const updatedUser = await userService.updateUser(userObj);
    const updatedProfile = await userService.updateUserProfile(profileObj);
    res.json({ ...updatedUser, profile: updatedProfile });
  } catch (error) {
    next(error);
  }
};
