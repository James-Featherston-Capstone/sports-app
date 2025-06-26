const prisma = require("../prisma.js");

exports.createEvent = async (eventObj) => {
  const event = await prisma.event.create({
    data: eventObj,
  });
  return event;
};

exports.updateEvent = async (eventObj) => {
  const event = await prisma.event.update({
    where: { id: eventObj.id },
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

exports.getComments = async (eventId) => {
  const comments = await prisma.eventComment.findMany({
    where: { eventId: eventId },
  });
  return comments;
};
