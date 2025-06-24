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
      console.log("Creating session");
      req.session.user = user;
      console.log(req.session);
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
    console.log(req.session);
    console.log(req.session.user);
    if (!req.session.user) {
      console.log("In here");
      return res.status(401).json({ message: "Not logged in" });
    }
    console.log(1);
    const filters = { id: req.session.userId };
    const user = await authService.getUser(filters);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: "Internal Server Error" });
  }
};
