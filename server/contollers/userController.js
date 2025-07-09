const { UnauthorizedError } = require("../middleware/Errors");
const userService = require("../services/userService");
const locationService = require("../recommendations/locationService");
const locationUtils = require("../recommendations/locationUtils.js");

const { buildProfile } = require("../utils/buildModel");

exports.updateUserProfile = async (req, res, next) => {
  try {
    const userObj = buildProfile(req);
    const updatedAt = new Date();
    userObj.updated_at = updatedAt;
    if (userObj.location) {
      const coords = await locationService.getGeoCode(userObj.location);
      userObj.latitude = coords.latitude;
      userObj.longitude = coords.longitude;
      userObj.latitudeKey = locationUtils.calculateLocationKey(
        coords.longitude
      );
      userObj.longitudeKey = locationUtils.calculateLocationKey(
        coords.latitude
      );
    }
    const updatedUser = await userService.updateUser(userObj);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
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
