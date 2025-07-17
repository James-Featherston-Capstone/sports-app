const { performHaversine } = require("./locationUtils");
const TO_DAYS = 1000 * 60 * 60 * 24; // Milliseconds to days
/*
Takes in a list of nearby events to the user and ranks them based on user preferences
Input: events, user location, user sports preferences, date
Ouput: Ranked list of events
*/
const rankEvents = (events, userLocation, sports, userDate) => {
  const eventsWithDistance = events.map((event) => {
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
  const bounds = getBounds(eventsWithDistance);
  const eventsWithWeights = eventsWithDistance.map((event) => {
    event.weight = getEventWeight(event, sports, userDate, bounds);
    return event;
  });
  const rankedEvents = eventsWithWeights.toSorted((a, b) =>
    a.weight < b.weight ? 1 : -1
  );
  return rankedEvents;
};

const getBounds = (events) => {
  const minDistance = Math.min(...events.map((event) => event.distance));
  const maxDistance = Math.max(...events.map((event) => event.distance));
  const minDate = Math.min(...events.map((event) => new Date(event.eventTime)));
  const maxDate = Math.max(...events.map((event) => new Date(event.eventTime)));
  const distanceRange = maxDistance - minDistance;
  const dateRange = maxDate - minDate;
  return {
    minDistance,
    maxDistance,
    minDate,
    maxDate,
    distanceRange,
    dateRange,
  };
};

/*
Gets an event weight for an event where the higher the weight is, 
the higher the event should be recommended.
Input: Takes event, user date, and user's sports preferences
Ouput: A weight for the event
*/
const getEventWeight = (event, sports, userDate, bounds) => {
  const LOCATION_WEIGHT = 0.5; // 50%
  const DATE_WEIGHT = 0.35; // 35%
  const SPORT_WEIGHT = 0.15; // 15%

  const sportWeight = sports.includes(event.sport) ? 1 : 0;
  const distanceWeight =
    1 - (event.distance - bounds.minDistance) / bounds.distanceRange;
  const dateWeight =
    1 - (new Date(userDate) - bounds.minDate) / bounds.dateRange;

  return (
    sportWeight * SPORT_WEIGHT +
    distanceWeight * LOCATION_WEIGHT +
    dateWeight * DATE_WEIGHT
  );
};

module.exports = { rankEvents };
