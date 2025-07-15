const prisma = require("../prisma.js");
const suggestMeetingPoints = async (eventId) => {
  const preferenceMeetingPoints = await suggestPreferenceMeetingPoint(eventId);
  // Get all preferenced events
  // User Google Distance Matrix API
  // Scoring logic for preferenced events
  return { test: "This is a test" };
};

const suggestPreferenceMeetingPoint = async (eventId) => {
  const mauallySetMeetingPoints = await prisma.eventParkPreference.findMany({
    where: { eventId },
  });
};

module.exports = { suggestMeetingPoints };
