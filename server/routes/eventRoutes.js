const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.get("/", eventController.getAllEvents);
router.post("/", eventController.createEvent);
router.get("/:eventId", eventController.getEvent);
router.put("/:eventId", eventController.updateEvent);
router.delete("/:eventId", eventController.deleteEvent);
router.post("/:eventId/rsvp", eventController.rsvpEvent);
router.delete("/:eventId/rsvp", eventController.removeRsvpEvent);
router.get("/:eventId/comments", eventController.getComments);
router.post("/:eventId/comments", eventController.createComment);
router.get("/:eventId/preferences", eventController.getEventPreferences);
router.post("/:eventId/preferences", eventController.createEventPreference);
router.put("/preferences/:preferenceId", eventController.preferenceUpvote);
router.get(
  "/:eventId/meeting-points",
  eventController.getRecommendedMeetingPoints
);

module.exports = router;
