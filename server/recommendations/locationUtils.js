const calculateLocationKey = (value) => {
  return Math.round(value * 100);
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
  let keys = [];
  for (let latKey = keyOffset * -1; latKey <= keyOffset; latKey++) {
    for (let lngKey = keyOffset * -1; lngKey <= keyOffset; lngKey++) {
      keys = [
        ...keys,
        {
          latitudeKey: latKey + baseKey.latitudeKey,
          longitudeKey: lngKey + baseKey.longitudeKey,
        },
      ];
    }
  }
  return keys;
};

module.exports = { extractLatLngFields, calculateLocationKey, getAllKeys };
