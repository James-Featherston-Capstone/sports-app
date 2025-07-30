const {
  ValidationError,
  UnauthorizedError,
} = require("../middleware/Errors.js");
const eventService = require("../services/eventService.js");
const locationService = require("../recommendations/locationService.js");
const { buildEvent, buildComment } = require("../utils/buildModel.js");
const {
  validateNewEvent,
  validateNewComment,
} = require("../utils/validation.js");
const locationUtils = require("../recommendations/locationUtils.js");
const meetingPointService = require("../meetingPoints/meetingPointService.js");
const { handleWeightChange } = require("../recommendations/eventWeights.js");

exports.getAllEvents = async (req, res) => {
  const user = req.session.user;
  const { filter, startDate, endDate, sport, location, radius, query } =
    req.query;
  let events = [];
  if (filter === "rsvp") {
    events = await eventService.getAllEventRSVP(user.id);
  } else if (filter === "created") {
    events = await eventService.getAllEventsCreated(user.id);
  } else {
    events = await locationService.getAllNearbyEvents(user.id, {
      startDate,
      endDate,
      radius,
      sport,
      location,
      query,
    });
  }
  res.json(events);
};

exports.getEvent = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const event = await eventService.getEvent(eventId);
  res.json(event);
};

exports.createEvent = async (req, res) => {
  validateNewEvent(req);
  const eventObj = buildEvent(req);
  if (eventObj.location) {
    await locationUtils.extractLatLngFields(eventObj);
  } else {
    throw new ValidationError("Location missing");
  }
  const event = await eventService.createEvent(eventObj);
  res.json(event);
};

exports.updateEvent = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const eventObj = buildEvent(req);
  const updatedAt = new Date();
  eventObj.updated_at = updatedAt;
  if (eventObj.location) {
    await locationUtils.extractLatLngFields(eventObj);
  } else {
    throw new ValidationError("Location missing");
  }
  const event = await eventService.updateEvent(eventObj, eventId);
  res.json(event);
};

exports.deleteEvent = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const delEvent = await eventService.deleteEvent(eventId);
  res.json(delEvent);
};

exports.rsvpEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.session.user.id;
  if (!eventId || !userId) {
    throw new ValidationError("User id or event id invalid");
  }
  const eId = parseInt(eventId);
  const uId = parseInt(userId);
  const rsvpObj = { eventId: eId, userId: uId };
  const rsvp = await eventService.rsvpEvent(rsvpObj);
  res.json(rsvp);
};

exports.removeRsvpEvent = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const userId = req.session.user.id;
  const delRsvp = await eventService.removeRsvpEvent(eventId, userId);
  res.json(delRsvp);
};

exports.getComments = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const comments = await eventService.getComments(eventId);
  res.json(comments);
};

exports.createComment = async (req, res) => {
  validateNewComment(req);
  const commentObj = buildComment(req);
  const comment = await eventService.createComment(commentObj);
  res.json(comment);
};

exports.getEventPreferences = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  if (!eventId) {
    throw new ValidationError("Event id missing");
  }
  const preferences = await eventService.getEventPreferences(eventId);
  res.json(preferences);
};

exports.createEventPreference = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const { location } = req.body;
  if (!location || !eventId) {
    throw new ValidationError("Location required");
  }
  const preferenceObj = { eventId: eventId, location: location };
  await locationUtils.extractLatLngFields(preferenceObj);
  delete preferenceObj.latitudeKey;
  delete preferenceObj.longitudeKey;
  const preference = await eventService.createEventPreference(preferenceObj);
  res.json(preference);
};

exports.preferenceUpvote = async (req, res) => {
  const preferenceId = parseInt(req.params.preferenceId);
  if (!preferenceId) {
    throw new ValidationError("Preference id required");
  }
  const updatedPreference = await eventService.preferenceUpvote(preferenceId);
  res.json(updatedPreference);
};

exports.getRecommendedMeetingPoints = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  if (!eventId) {
    throw new ValidationError("Event id required");
  }
  const recommendations = await meetingPointService.suggestMeetingPoints(
    eventId
  );
  res.json(recommendations);
};

exports.createEventClick = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const eventDistance = parseFloat(req.body.eventDistance);
  const userId = req.session.user.id;
  if (
    !eventId ||
    !userId ||
    eventDistance === undefined ||
    eventDistance === null
  ) {
    throw new ValidationError("Event id and event distance required");
  }
  const clickEvent = await eventService.createClickEvent({
    eventId,
    eventDistance,
    userId,
  });
  handleWeightChange(clickEvent);
  res.json(clickEvent);
};

exports.createEventInvite = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const invitedId = parseFloat(req.body.invitedId);
  if (!eventId || !invitedId) {
    throw new ValidationError("Event id and invited id are required");
  }
  const eventInvite = await eventService.createEventInvite(eventId, invitedId);
  res.json(eventInvite);
};
