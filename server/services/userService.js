const { NotFoundError, ConflictError } = require("../middleware/Errors");
const prisma = require("../prisma.js");

exports.getUser = async (userId) => {
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      eventsCreated: true,
      eventsRSVP: true,
    },
  });
  if (!profile) {
    throw new NotFoundError();
  }
  const { password, ...safeUser } = profile;
  return safeUser;
};

exports.updateUser = async (userObj) => {
  const resUser = await prisma.user.update({
    where: { id: userObj.id },
    data: userObj,
  });
  return resUser;
};

exports.getAllUsers = async (userId) => {
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        id: userId,
      },
    },
    take: 10,
  });
  return users;
};
