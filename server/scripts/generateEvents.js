const eventService = require("../services/eventService");
const locationUtils = require("../recommendations/locationUtils");
/* 
Generates Events in a city
*/
const generateEvents = async (baseLat, baseLng, city, count) => {
  Array.from({ length: count }).forEach(async (_, i) => {
    const event = createEventObj(baseLat, baseLng, city, i);
    try {
      await eventService.createEvent(event);
    } catch (error) {
      console.error("Events not created");
    }
  });
};

const createEventObj = (baseLat, baseLng, city, i) => {
  const latitude = baseLat + getRandomCoord();
  const longitude = baseLng + getRandomCoord();
  return {
    organizerId: 1,
    eventTime: oneWeekFromNow(),
    location: `Generated Event: ${city}: ${i}`,
    latitude: latitude,
    longitude: longitude,
    latitudeKey: locationUtils.calculateLocationKey(latitude),
    longitudeKey: locationUtils.calculateLocationKey(longitude),
  };
};

const oneWeekFromNow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
};

//Gets random coords .05 degress (~3.5 miles)
const getRandomCoord = () => {
  return (Math.random() * 2 - 1) * 0.05;
};

generateEvents(37.7749295, -122.4194155, "San Francisco", 1);
