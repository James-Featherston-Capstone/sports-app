const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");

router.get("/", friendController.getFriends);
router.post("/", friendController.createFriendship);
router.delete("/:friendshipId", friendController.deleteFriendship);
router.get("/search", friendController.searchFriends);

module.exports = router;
