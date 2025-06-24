const express = require("express");
const router = express.Router();
const authController = require("../contollers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/me", authController.me);

module.exports = router;
