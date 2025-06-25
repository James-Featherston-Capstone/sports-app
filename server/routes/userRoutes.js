const express = require("express");
const router = express.Router();
const userController = require("../contollers/userController");

router.get("/:userId", userController.getUserProfile);
router.post("/:userId", userController.createUserProfile);
router.put("/:userId", userController.updateUserProfile);

module.exports = router;
