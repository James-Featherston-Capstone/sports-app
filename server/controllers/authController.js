const authService = require("../services/authService");
const { hashPassword, verifyPassword } = require("../utils/argon");
const {
  ValidationError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} = require("../middleware/Errors");

exports.register = async (req, res, next) => {
  try {
    const { email, password: plainPassword, username } = req.body;
    if (!email || !plainPassword || !username) {
      throw new ValidationError("Missing email or password");
    }
    const filters = { email: email };
    const existingUser = await authService.getUser(filters);
    if (existingUser) {
      throw new ConflictError("This email is already in use");
    }
    const hash = await hashPassword(plainPassword);
    const newUser = { email, password: hash, username: username };
    const retUser = await authService.createUser(newUser);
    req.session.user = retUser;
    res.json(retUser);
  } catch (error) {
    next(error);
  }
};

exports.checkEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ValidationError("Missing email");
    }
    const filters = { email: email };
    const existingUser = await authService.getUser(filters);
    if (existingUser) {
      res.json({ emailInUse: true });
    } else {
      res.json({ emailInUse: false });
    }
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password: plainPassword } = req.body;
    if (!email || !plainPassword) {
      throw new ValidationError("Missing email or password");
    }
    const filters = { email: email };
    const user = await authService.getUser(filters);
    if (user && (await verifyPassword(plainPassword, user.password))) {
      req.session.user = user;
      res.json(user);
    } else {
      throw new NotFoundError("Email or password is incorrect.");
    }
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    req.session.destroy(() => {
      res.json({ message: "Logout successful" });
    });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    if (!req.session.user) {
      throw new UnauthorizedError("User is not logged in");
    }
    const filters = { id: req.session.user.id };
    const user = await authService.getUser(filters);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
