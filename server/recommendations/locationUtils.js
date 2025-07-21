/*
Returns the key that corresponds with the degree entered.
*/
const calculateLocationKey = (value) => {
  return Math.round(value * 100);
};

/**
 * Calculates the haversine distance from one coordinate to another.
 * @param {Degree} lat1Degrees - Coordinate 1 latitude
 * @param {Degree} lng1Degrees - Coordinate 1 longitude
 * @param {Degree} lat2Degrees - Coordinate 2 latitude
 * @param {Degree} lng2Degrees - Coordinate 2 longitude
 * @returns
 * Reference: https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
 */
const performHaversine = (
  lat1Degrees,
  lng1Degrees,
  lat2Degrees,
  lng2Degrees
) => {
  const toRadians = (degree) => {
    return (degree * Math.PI) / 180;
  };
  const EARTHRADIUSMILES = 3958.8;
  const lat1Radians = toRadians(lat1Degrees);
  const lng1Radians = toRadians(lng1Degrees);
  const lat2Radians = toRadians(lat2Degrees);
  const lng2Radians = toRadians(lng2Degrees);

  const dLat = lat2Radians - lat1Radians;
  const dLng = lng2Radians - lng1Radians;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Radians) *
      Math.cos(lat2Radians) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTHRADIUSMILES * c;
};

/**
 * Adds the latitude, longitude, latitude key, and longitude key
 * to an object with a location field.
 * @param {Object} obj - Object with a location field
 */
const extractLatLngFields = async (obj) => {
  const locationService = require("./locationService");
  const coords = await locationService.getGeoCode(obj.location);
  obj.latitude = coords.latitude;
  obj.longitude = coords.longitude;
  obj.latitudeKey = calculateLocationKey(coords.latitude);
  obj.longitudeKey = calculateLocationKey(coords.longitude);
};

/**
 * Generates a list of keys based on the offsets
 * @param {Coordinate} baseKey - The central key
 * @param {Offset} offsets - Latitude and longitude key offsets
 * @returns {Key[][]} - A 2D list of keys
 */
const getAllKeys = (baseKey, offsets) => {
  const latitudeOffsets = Array.from(
    { length: offsets.latitudeKeyOffset * 2 + 1 },
    (_, i) => i - offsets.latitudeKeyOffset
  );
  const longitudeOffsets = Array.from(
    { length: offsets.longitudeKeyOffset * 2 + 1 },
    (_, i) => i - offsets.longitudeKeyOffset
  );

  const keyGen = latitudeOffsets.map((latKey) => {
    return longitudeOffsets.map((lngKey) => {
      return {
        latitudeKey: latKey + baseKey.latitudeKey,
        longitudeKey: lngKey + baseKey.longitudeKey,
      };
    });
  });
  const keys = keyGen.flat();
  return keys;
};

/**
 * Calculates the key offsets needed for a give radius and latitude,
 * factoring in the curvature of the earth.
 * @param {number} radius - Radius in miles
 * @param {Degree} latitude - The latitude
 * @returns {Offset} - Latitude and longitude key offsets
 */
const calculateKeyOffsets = (radius, latitude) => {
  const MILES_PER_DEGREE = 69.17;
  const latitudeMultiplier = Math.cos(parseFloat(latitude)); // Due to the earth being round

  const milesPerDegreeLatitude = MILES_PER_DEGREE * latitudeMultiplier;
  const milesPerDegreeLongitude = MILES_PER_DEGREE;
  const latitudeMilesPerKey = milesPerDegreeLatitude / 100;
  const longitudeMilesPerKey = milesPerDegreeLongitude / 100;

  const latitudeKeys = radius / latitudeMilesPerKey;
  const longitudeKeys = radius / longitudeMilesPerKey;
  return {
    latitudeKeyOffset: Math.ceil(latitudeKeys),
    longitudeKeyOffset: Math.ceil(longitudeKeys),
  };
};

module.exports = {
  extractLatLngFields,
  calculateLocationKey,
  getAllKeys,
  performHaversine,
  calculateKeyOffsets,
};
