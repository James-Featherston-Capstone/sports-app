const userService = require("../services/userService");

const { buildProfile } = require("../utils/buildModel");

exports.updateUserProfile = async (req, res, next) => {
  try {
    const userObj = buildProfile(req);
    const updatedUser = await userService.updateUser(userObj);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await userService.getUser(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
