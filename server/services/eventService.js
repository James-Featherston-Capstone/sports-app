const prisma = require("../prisma.js");

exports.getAllEvents = async (query, userId) => {
  const events = await prisma.event.findMany({
    where: {
      description: {
        contains: query,
      },
    },
    include: {
      rsvps: {
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      },
    },
    take: 10,
    orderBy: {
      eventTime: "desc",
    },
  });
  return events;
};

exports.getEvent = async (eventId) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      rsvps: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      organizer: true,
      comments: {
        select: {
          id: true,
          comment: true,
          author: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });
  return event;
};

exports.getAllEventRSVP = async (userId) => {
  const rsvps = await prisma.eventRSVP.findMany({
    where: {
      userId: userId,
    },
    include: {
      event: {
        include: {
          rsvps: {
            where: {
              userId: userId,
            },
          },
        },
      },
    },
  });
  const eventArr = rsvps.map((rsvp) => rsvp.event);
  return eventArr;
};

exports.getAllEventsCreated = async (userId) => {
  const events = await prisma.event.findMany({
    where: {
      organizerId: userId,
    },
    include: {
      rsvps: {
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      },
    },
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

exports.removeRsvpEvent = async (eventId, userId) => {
  const delRsvp = await prisma.eventRSVP.delete({
    where: {
      eventId_userId: {
        userId: userId,
        eventId: eventId,
      },
    },
  });
  return delRsvp;
};

exports.createComment = async (commentObj) => {
  const comment = await prisma.eventComment.create({
    data: commentObj,
    select: {
      id: true,
      comment: true,
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  return comment;
};

exports.getComments = async (eventId) => {
  const comments = await prisma.eventComment.findMany({
    where: { eventId: eventId },
  });
  return comments;
};
