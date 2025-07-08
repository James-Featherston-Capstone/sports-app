const express = require("express");
const router = express.Router();
const userController = require("../contollers/userController");

router.get("/", userController.getUserProfile);
router.put("/", userController.updateUserProfile);

module.exports = router;
