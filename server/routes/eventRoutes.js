const express = require("express");
const router = express.Router();
const eventController = require("../contollers/eventController");

router.get("/", eventController.getAllEvents);
router.post("/", eventController.createEvent);
router.put("/:eventId", eventController.updateEvent);
router.delete("/:eventId", eventController.deleteEvent);
router.post("/:eventId/rsvp", eventController.rsvpEvent);
router.delete("/rsvp/:rsvpId", eventController.removeRsvpEvent);
router.get("/:eventId/comments", eventController.getComments);
router.post("/:eventId/comments", eventController.createComment);

module.exports = router;
