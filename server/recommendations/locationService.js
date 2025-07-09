const locationUtils = require("./locationUtils");
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

const extractLatLngFields = async (obj) => {
  const coords = await getGeoCode(obj.location);
  obj.latitude = coords.latitude;
  obj.longitude = coords.longitude;
  obj.latitudeKey = locationUtils.calculateLocationKey(coords.latitude);
  obj.longitudeKey = locationUtils.calculateLocationKey(coords.longitude);
};

module.exports = { extractLatLngFields };
