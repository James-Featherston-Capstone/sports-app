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

exports.getAllEvents = async (req, res, next) => {
  try {
    const user = req.session.user;
    const { filter, date, sport, location } = req.query;
    let events = [];
    if (filter === "rsvp") {
      events = await eventService.getAllEventRSVP(user.id);
    } else if (filter === "created") {
      events = await eventService.getAllEventsCreated(user.id);
    } else {
      events = await locationService.getAllNearbyEvents(user.id, {
        date,
        sport,
        location,
      });
    }
    res.json(events);
  } catch (error) {
    next(error);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const event = await eventService.getEvent(eventId);
    res.json(event);
  } catch (error) {
    next();
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    validateNewEvent(req);
    const eventObj = buildEvent(req);
    if (eventObj.location) {
      await locationUtils.extractLatLngFields(eventObj);
    } else {
      throw new ValidationError("Location missing");
    }
    const event = await eventService.createEvent(eventObj);
    res.json(event);
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const delEvent = await eventService.deleteEvent(eventId);
    res.json(delEvent);
  } catch (error) {
    next(error);
  }
};

exports.rsvpEvent = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

exports.removeRsvpEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const userId = req.session.user.id;
    const delRsvp = await eventService.removeRsvpEvent(eventId, userId);
    res.json(delRsvp);
  } catch (error) {
    next(error);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const comments = await eventService.getComments(eventId);
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    validateNewComment(req);
    const commentObj = buildComment(req);
    const comment = await eventService.createComment(commentObj);
    res.json(comment);
  } catch (error) {
    next(error);
  }
};

exports.getEventPreferences = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId);
    if (!eventId) {
      throw new ValidationError("Event id missing");
    }
    const preferences = await eventService.getEventPreferences(eventId);
    res.json(preferences);
  } catch (error) {
    next(error);
  }
};

exports.createEventPreference = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

exports.preferenceUpvote = async (req, res, next) => {
  try {
    const preferenceId = parseInt(req.params.preferenceId);
    if (!preferenceId) {
      throw new ValidationError("Preference id required");
    }
    const updatedPreference = await eventService.preferenceUpvote(preferenceId);
    res.json(updatedPreference);
  } catch (error) {
    next(error);
  }
};
