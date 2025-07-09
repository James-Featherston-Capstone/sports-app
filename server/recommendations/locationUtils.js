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
  const latLngOffsets = Array.from(
    { length: keyOffset * 2 + 1 },
    (_, i) => i - keyOffset
  );
  console.log(latLngOffsets);

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

module.exports = { extractLatLngFields, calculateLocationKey, getAllKeys };
