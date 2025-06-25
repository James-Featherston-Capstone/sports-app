const userService = require("../services/userService");

const { validateNewUser } = require("../utils/validation");
const { buildProfile } = require("../utils/buildModel");

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
    const userObj = buildProfile(req);
    const newUser = await userService.createUserProfile(userObj);
    res.json(newUser);
  } catch (error) {
    next(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const userObj = buildProfile(req);
    const updatedUser = await userService.updateUserProfile(userObj);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};
