const prisma = require("../prisma.js");

exports.getUser = async (filters) => {
  const user = await prisma.user.findFirst({
    where: filters,
  });
  return user;
};

exports.createUser = async (user) => {
  const newUser = await prisma.user.create({
    data: user,
  });
  return newUser;
};
