const calculateLocationKey = (value) => {
  return Math.round(value * 100);
};

// https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
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

const extractLatLngFields = async (obj) => {
  const locationService = require("./locationService");
  const coords = await locationService.getGeoCode(obj.location);
  obj.latitude = coords.latitude;
  obj.longitude = coords.longitude;
  obj.latitudeKey = calculateLocationKey(coords.latitude);
  obj.longitudeKey = calculateLocationKey(coords.longitude);
};

const getAllKeys = (baseKey, keyOffset) => {
  const latLngOffsets = Array.from(
    { length: keyOffset * 2 + 1 },
    (_, i) => i - keyOffset
  );

  const keyGen = latLngOffsets.map((latKey) => {
    return latLngOffsets.map((lngKey) => {
      return {
        latitudeKey: latKey + baseKey.latitudeKey,
        longitudeKey: lngKey + baseKey.longitudeKey,
      };
    });
  });
  const keys = keyGen.flat();
  return keys;
};

module.exports = {
  extractLatLngFields,
  calculateLocationKey,
  getAllKeys,
  performHaversine,
};
