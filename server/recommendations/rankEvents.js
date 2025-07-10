const { performHaversine } = require("./locationUtils");
const rankEvents = (events, userLocation) => {
  events.map((event) => {
    event.distance =
      Math.round(
        performHaversine(
          userLocation.latitude,
          userLocation.longitude,
          event.latitude,
          event.longitude
        ) * 100
      ) / 100;
    return event;
  });
  events.sort((a, b) => (a.distance > b.distance ? 1 : -1));
  return events;
};

module.exports = rankEvents;
