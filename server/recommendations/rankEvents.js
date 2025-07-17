const { performHaversine } = require("./locationUtils");
/*
Takes in a list of nearby events to the user and ranks them based on user preferences
Input: events, user location, user sports preferences, date
Ouput: Ranked list of events
*/
const rankEvents = (
  events,
  userLocation,
  sportsMap,
  userDate,
  userPreferedTimesMap
) => {
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
  const bounds = getBounds(eventsWithDistance, sportsMap, userPreferedTimesMap);
  const eventsWithWeights = eventsWithDistance.map((event) => {
    event.weight = getEventWeight(
      event,
      sportsMap,
      userDate,
      bounds,
      userPreferedTimesMap
    );
    return event;
  });
  const rankedEvents = eventsWithWeights.toSorted((a, b) =>
    a.weight < b.weight ? 1 : -1
  );
  return rankedEvents;
};

/*
Calculates the bounds of a series of variables for normalization
*/
const getBounds = (events, sportMap, userPreferedTimesMap) => {
  const minDistance = Math.min(...events.map((event) => event.distance));
  const maxDistance = Math.max(...events.map((event) => event.distance));
  const minDate = Math.min(...events.map((event) => new Date(event.eventTime)));
  const maxDate = Math.max(...events.map((event) => new Date(event.eventTime)));
  const maxSportValue = Math.max(...sportMap.values());
  const distanceRange = maxDistance - minDistance;
  const dateRange = maxDate - minDate;
  const maxTimeValue = Math.max(...userPreferedTimesMap.values());
  return {
    maxSportValue,
    minDistance,
    maxDistance,
    minDate,
    maxDate,
    distanceRange,
    dateRange,
    maxTimeValue,
  };
};

/*
Gets an event weight for an event where the higher the weight is, 
the higher the event should be recommended.
Input: Takes event, user date, and user's sports preferences
Ouput: A weight for the event
*/
const getEventWeight = (
  event,
  sportsMap,
  userDate,
  bounds,
  userPreferedTimesMap
) => {
  const LOCATION_WEIGHT = 0.5; // 50%
  const DATE_WEIGHT = 0.25; // 25%
  const SPORT_WEIGHT = 0.15; // 15%
  const TIME_OF_DAY_WEIGHT = 0.1; // 10%
  const sportValue = sportsMap.get(event.sport)
    ? sportsMap.get(event.sport)
    : 0;
  const sportWeight =
    1 - (bounds.maxSportValue - sportValue) / bounds.maxSportValue;
  const distanceWeight =
    1 - (event.distance - bounds.minDistance) / bounds.distanceRange;
  const dateWeight =
    1 - (new Date(userDate) - bounds.minDate) / bounds.dateRange;
  const eventDate = new Date(event.eventTime);
  const minutes = eventDate.getMinutes();
  const roundUp = Math.floor(minutes / 30);
  const hour = roundUp ? eventDate.getHours() + 1 : eventDate.getHours();
  const timeValue = userPreferedTimesMap.get(hour)
    ? userPreferedTimesMap.get(hour)
    : 0;
  const timeWeight =
    1 - (bounds.maxTimeValue - timeValue) / bounds.maxTimeValue;
  return (
    sportWeight * SPORT_WEIGHT +
    distanceWeight * LOCATION_WEIGHT +
    dateWeight * DATE_WEIGHT +
    timeWeight * TIME_OF_DAY_WEIGHT
  );
};

module.exports = { rankEvents };
