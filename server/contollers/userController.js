const { UnauthorizedError } = require("../middleware/Errors");
const userService = require("../services/userService");

const { buildProfile } = require("../utils/buildModel");

exports.updateUserProfile = async (req, res, next) => {
  try {
    const userObj = buildProfile(req);
    const updatedAt = new Date();
    userObj.updated_at = updatedAt;
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

exports.getAllUsers = async (req, res, next) => {
  try {
    const user = req.session.user;
    if (!user) {
      throw new UnauthorizedError("Must be logged in");
    }
    const users = await userService.getAllUsers(user.id);
    res.json(users);
  } catch (error) {
    next(error);
  }
};
