const authService = require("../services/authService");
const { hashPassword, verifyPassword } = require("../utils/argon");

exports.register = async (req, res) => {
  try {
    const { email, password: plainPassword } = req.body;
    const user = await authService.getUserByEmail(email);
    if (user) {
      throw Error;
    }
    const hash = await hashPassword(plainPassword);
    const newUser = { email, password: hash };
    const retUser = await authService.createUser(newUser);
    res.json(retUser);
  } catch (error) {
    res.status(404).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  res.send("You are now logged in");
};

exports.logout = async (req, res) => {
  res.send("You are now logged out");
};
