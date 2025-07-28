const prisma = require("../prisma.js");

exports.getFriends = async (userId) => {
  // User following others relationship
  const friends = await prisma.friendship.findMany({
    where: { userId },
    include: {
      friend: {
        select: {
          username: true,
          profile_image_url: true,
        },
      },
    },
  });
  // Others following user relationship
  const friendsOf = await prisma.friendship.findMany({
    where: { friendId: userId },
    include: {
      user: {
        select: {
          username: true,
          profile_image_url: true,
        },
      },
    },
  });

  const followingIds = new Set(friends.map((friend) => friend.friendId));
  const result = {
    friends: friends.map((friend) => {
      return {
        ...friend,
        followingUser: true,
      };
    }),
    friendsOf: friendsOf.map(({ user, ...friendOf }) => {
      return {
        ...friendOf,
        friend: user,
        followingUser: followingIds.has(friendOf.userId),
      };
    }),
  };
  return result;
};

exports.searchFriends = async (userId, query) => {
  const possibleFriends = await prisma.user.findMany({
    where: {
      NOT: {
        id: userId,
      },
      friendshipSent: {
        none: {
          userId: userId,
        },
      },
      username: { contains: query, mode: "insensitive" },
    },
  });
  return possibleFriends;
};

exports.createFriendship = async (userId, friendId) => {
  const newFriend = await prisma.friendship.create({
    data: {
      userId: userId,
      friendId: friendId,
    },
  });
  return newFriend;
};

exports.deleteFriendship = async (friendshipId) => {
  const deletedFriend = await prisma.friendship.delete({
    where: { id: friendshipId },
  });
  return deletedFriend;
};
