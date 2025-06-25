const express = require("express");
const router = express.Router();
const eventController = require("../contollers/eventController");

router.post("/", eventController.createEvent);
router.put("/:eventId", eventController.updateEvent);
router.delete("/:eventId", eventController.deleteEvent);
router.post("/signup", eventController.rsvpEvent);
router.delete("/signup/:rsvpId", eventController.removeRsvpEvent);
router.post("/:eventId/comments", eventController.getComments);

module.exports = router;
