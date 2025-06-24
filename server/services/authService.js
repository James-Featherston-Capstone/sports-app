const prisma = require("../prisma.js");

exports.getUserByEmail = async (targetEmail) => {
  const user = await prisma.user.findFirst({
    where: { email: targetEmail },
  });
  return user;
};

exports.createUser = async (user) => {
  const newUser = await prisma.user.create({
    data: user,
  });
  if (!newUser) {
    throw Error;
  }
  return newUser;
};
