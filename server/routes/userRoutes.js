const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getUserProfile);
router.put("/", userController.updateUserProfile);

module.exports = router;
