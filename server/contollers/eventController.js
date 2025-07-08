const { ValidationError, UnauthorizedError } = require("../middleware/Errors");
const eventService = require("../services/eventService");
const { buildEvent, buildComment } = require("../utils/buildModel");
const { validateNewEvent, validateNewComment } = require("../utils/validation");

exports.getAllEvents = async (req, res, next) => {
  try {
    const user = req.session.user;
    const { searchQuery, filter } = req.query;
    let events = [];
    if (filter === "rsvp") {
      events = await eventService.getAllEventRSVP(user.id);
    } else if (filter === "created") {
      events = await eventService.getAllEventsCreated(user.id);
    } else {
      events = await eventService.getAllEvents(searchQuery, user.id);
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
