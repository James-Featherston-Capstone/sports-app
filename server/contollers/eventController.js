const { ValidationError } = require("../middleware/Errors");
const eventService = require("../services/eventService");
const { buildEvent, buildComment } = require("../utils/buildModel");
const { validateNewEvent, validateNewComment } = require("../utils/validation");

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
    const { eventId, userId } = req.body;
    if (!eventId || !userId) {
      throw new ValidationError();
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
    const rsvpId = parseInt(req.params.rsvpId);
    const delRsvp = await eventService.removeRsvpEvent(rsvpId);
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
