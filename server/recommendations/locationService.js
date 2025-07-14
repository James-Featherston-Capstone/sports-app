const prisma = require("../prisma.js");
const userService = require("../services/userService.js");
const locationUtils = require("./locationUtils.js");
const { rankEvents } = require("./rankEvents.js");

/*
Input: Location
Ouput: Latitude and longitude of that location 
*/
const getGeoCode = async (location) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${process.env.GOOGLE_MAPS_API}`
    );
    const data = await response.json();
    if (!data.results[0]) {
      throw new Error("No locations found with input strings");
    }
    const coords = data.results[0].geometry.location;
    return { latitude: coords.lat, longitude: coords.lng };
  } catch (error) {
    throw error;
  }
};

/*
Input: user id and user filters
Output: List of nearby events sorted by most recommended -> least recommended
*/
const getAllNearbyEvents = async (userId, userInputs) => {
  const user = await userService.getUser(userId);
  if (userInputs.location) {
    user.location = userInputs.location;
    await locationUtils.extractLatLngFields(user);
  }
  const baseKey = {
    latitudeKey: user.latitudeKey,
    longitudeKey: user.longitudeKey,
  };
  const keyOffset = 10;
  const keys = locationUtils.getAllKeys(baseKey, keyOffset);
  const events = await prisma.event.findMany({
    where: {
      OR: keys.map((key) => ({
        latitudeKey: key.latitudeKey,
        longitudeKey: key.longitudeKey,
      })),
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
  });
  const userDate = userInputs.date ? new Date(userInputs.date) : new Date();
  const futureEvents = events.filter((event) => {
    const eventDate = new Date(event.eventTime);
    return eventDate >= userDate;
  });
  const userSports = userInputs.sport ? [userInputs.sport] : user.sports;
  const rankedEvents = rankEvents(
    futureEvents,
    { latitude: user.latitude, longitude: user.longitude },
    userSports,
    userDate
  );
  rankedEvents.map((event) => {
    delete event.weight;
  });
  return rankedEvents;
};

module.exports = { getGeoCode, getAllNearbyEvents };
