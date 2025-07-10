const prisma = require("../prisma.js");
const userService = require("../services/userService.js");
const locationUtils = require("./locationUtils.js");
const rankEvents = require("./rankEvents.js");

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

const getAllNearbyEvents = async (userId) => {
  const user = await userService.getUser(userId);
  const baseKey = {
    latitudeKey: user.latitudeKey,
    longitudeKey: user.longitudeKey,
  };
  const keyOffset = 5;
  const keys = locationUtils.getAllKeys(baseKey, keyOffset);
  const results = await Promise.all(
    keys.map(async (key) => {
      return await prisma.event.findMany({
        where: key,
      });
    })
  );
  const events = results.flat();
  const userDate = new Date();
  const futureEvents = events.filter((event) => {
    const eventDate = new Date(event.eventTime);
    return eventDate >= userDate;
  });
  const userLocation = { latitude: user.latitude, longitude: user.longitude };
  const rankedEvents = rankEvents(futureEvents, userLocation);
  return rankedEvents;
};

module.exports = { getGeoCode, getAllNearbyEvents };
