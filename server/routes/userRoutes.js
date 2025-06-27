const express = require("express");
const router = express.Router();
const userController = require("../contollers/userController");

router.get("/:userId", userController.getUserProfile);
router.put("/:userId", userController.updateUserProfile);
router.get("/", userController.getAllUsers);

module.exports = router;
