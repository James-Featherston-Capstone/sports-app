const { NotFoundError, ConflictError } = require("../middleware/Errors");
const prisma = require("../prisma.js");

exports.getUser = async (userId) => {
  const profile = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!profile) {
    throw new NotFoundError();
  }
  const { password, ...safeUser } = profile;
  return safeUser;
};

exports.createUserProfile = async (profileObj) => {
  if ((await this.getUserProfile(profileObj.userId)).profile) {
    throw new ConflictError("User Profile Already Created");
  }
  const resProfile = await prisma.profile.create({
    data: profileObj,
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

exports.updateUser = async (userObj) => {
  const resUser = await prisma.user.update({
    where: { id: userObj.id },
    data: userObj,
  });
  return resUser;
};
