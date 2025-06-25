const { NotFoundError, ConflictError } = require("../middleware/Errors");
const prisma = require("../prisma.js");

exports.getUserProfile = async (userId) => {
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      profile: true,
    },
  });
  if (!profile) {
    throw new NotFoundError();
  }
  return profile;
};

exports.createUserProfile = async (userObj) => {
  if ((await this.getUserProfile(userObj.userId)).profile) {
    throw new ConflictError("User Profile Already Created");
  }
  const resProfile = await prisma.profile.create({
    data: userObj,
  });
  return resProfile;
};

exports.updateUserProfile = async (updatedUser) => {
  const resProfile = await prisma.profile.update({
    where: { userId: updatedUser.userId },
    data: updatedUser,
  });
  return resProfile;
};
