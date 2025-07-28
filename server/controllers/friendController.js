const { ValidationError } = require("../middleware/Errors");
const friendService = require("../services/friendService");

exports.getFriends = async (req, res) => {
  const userId = req.session.user.id;
  const friendships = await friendService.getFriends(userId);
  res.json(friendships);
};

exports.searchFriends = async (req, res) => {
  const userId = req.session.user.id;
  const { query } = req.query;
  if (query === "undefined") {
    throw new ValidationError("Must include search term");
  }
  const possibleFriends = await friendService.searchFriends(userId, query);
  res.json(possibleFriends);
};

exports.createFriendship = async (req, res) => {
  const userId = parseInt(req.session.user.id);
  const friendId = parseInt(req.body.friendId);
  if (!friendId) {
    throw new ValidationError("Must add friendId");
  }
  if (friendId === userId) {
    throw new ValidationError("Cannot friend yourself");
  }
  const newFriend = await friendService.createFriendship(userId, friendId);
  res.json(newFriend);
};

exports.deleteFriendship = async (req, res) => {
  const friendshipId = parseInt(req.params.friendshipId);
  if (!friendshipId) {
    throw new ValidationError("Must provide frienship id");
  }
  const deletedFriend = await friendService.deleteFriendship(friendshipId);
  res.json(deletedFriend);
};
