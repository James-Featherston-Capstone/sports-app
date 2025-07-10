const { performHaversine } = require("./locationUtils");
const rankEvents = (events, userLocation, sports) => {
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
  events.map((event) => {
    event.weight = getEventWeight(event, sports);
    return event;
  });
  events.sort((a, b) => (a.weight < b.weight ? 1 : -1));
  return events;
};

const getEventWeight = (event, sports) => {
  const maxDist = 8;
  const weights = { location: 1, date: 0.7, sport: 1 };
  let totalWeight = 0;
  if (sports.includes(event.sport)) {
    totalWeight += weights.sport;
  }
  totalWeight += (maxDist - event.distance) * weights.location;
  const eventDate = new Date(event.eventTime);
  const now = new Date();
  totalWeight += getDaysDifference(eventDate, now) * weights.date;
  return totalWeight;
};

const getDaysDifference = (date1, date2) => {
  const toDays = 1000 * 60 * 60 * 24;
  const time1 = date1.getTime();
  const time2 = date2.getTime();
  const diff = Math.abs(time1 - time2);
  const daysDiff = diff / toDays;
  return daysDiff;
};

module.exports = { rankEvents };
