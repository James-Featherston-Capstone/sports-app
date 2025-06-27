const prisma = require("../prisma.js");

exports.getAllEvents = async (userId) => {
  const events = await prisma.event.findMany({
    take: 10,
    orderBy: {
      eventTime: "desc",
    },
  });
  return events;
};

exports.createEvent = async (eventObj) => {
  const event = await prisma.event.create({
    data: eventObj,
  });
  return event;
};

exports.updateEvent = async (eventObj, eventId) => {
  const event = await prisma.event.update({
    where: { id: eventId },
    data: eventObj,
  });
  return event;
};

exports.deleteEvent = async (eventId) => {
  const event = await prisma.event.delete({
    where: { id: eventId },
  });
  return event;
};

exports.rsvpEvent = async (rsvpObj) => {
  const rsvp = await prisma.eventRSVP.create({
    data: rsvpObj,
  });
  return rsvp;
};

exports.removeRsvpEvent = async (rsvpId) => {
  const delRsvp = await prisma.eventRSVP.delete({
    where: { id: rsvpId },
  });
  return delRsvp;
};

exports.createComment = async (commentObj) => {
  const comment = await prisma.eventComment.create({
    data: commentObj,
  });
  return comment;
};

exports.getComments = async (eventId) => {
  const comments = await prisma.eventComment.findMany({
    where: { eventId: eventId },
  });
  return comments;
};
