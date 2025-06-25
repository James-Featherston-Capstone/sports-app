const authService = require("../services/authService");
const { hashPassword, verifyPassword } = require("../utils/argon");

exports.register = async (req, res) => {
  try {
    const { email, password: plainPassword } = req.body;
    if (!email || !plainPassword) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }
    const filters = { email: email };
    const existingUser = await authService.getUser(filters);
    if (existingUser) {
      throw Error;
    }
    const hash = await hashPassword(plainPassword);
    const newUser = { email, password: hash };
    const retUser = await authService.createUser(newUser);
    req.session.user = retUser;
    res.json(retUser);
  } catch (error) {
    res.status(404).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password: plainPassword } = req.body;
    if (!email || !plainPassword) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }
    const filters = { email: email };
    const user = await authService.getUser(filters);
    if (user && (await verifyPassword(plainPassword, user.password))) {
      req.session.user = user;
      res.json(user);
    } else {
      throw Error;
    }
  } catch (error) {
    res.status(404).json({ message: "Internal Server Error" });
  }
};

exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    res.json({ message: "Logout successful" });
  });
  res.send("This person is logged out");
};

exports.me = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not logged in" });
    }
    const filters = { id: req.session.user.id };
    const user = await authService.getUser(filters);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: "Internal Server Error" });
  }
};
