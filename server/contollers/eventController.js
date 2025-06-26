const { ValidationError } = require("../middleware/Errors");
const eventService = require("../services/eventService");
const { buildEvent } = require("../utils/buildModel");
const { validateNewEvent } = require("../utils/validation");

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
    const eventId = req.params.eventId;
    const eventObj = buildEvent(req);
    eventObj.id = eventId;
    const event = await eventService.updateEvent(eventObj);
    res.json(event);
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
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
    const rsvpObj = { eventId, userId };
    const rsvp = await eventService.rsvpEvent(rsvpObj);
    res.json(rsvp);
  } catch (error) {
    next(error);
  }
};

exports.removeRsvpEvent = async (req, res, next) => {
  try {
    const rsvpId = req.params.rsvpId;
    const delRsvp = await eventService.removeRsvpEvent(rsvpId);
    res.json(delRsvp);
  } catch (error) {
    next(error);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const comments = await eventService.getComments(eventId);
    res.json(comments);
  } catch (error) {
    next(error);
  }
};
