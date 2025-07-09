const prisma = require("../prisma.js");
const userService = require("../services/userService.js");
const locationUtils = require("./locationUtils.js");

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
  const keyOffset = 2;
  const keys = locationUtils.getAllKeys(baseKey, keyOffset);
  const results = await Promise.all(
    keys.map(async (key) => {
      return await prisma.event.findMany({
        where: key,
      });
    })
  );
  const events = results.flat();
  return events;
};

module.exports = { getGeoCode, getAllNearbyEvents };
