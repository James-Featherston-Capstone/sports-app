const { DISTANCE_RANGES } = require("../config");
const { performHaversine } = require("./locationUtils");

/**
 * Ranks events based on user preferences/ activity and sorts.
 * @param {Event[]} events - Events to rank
 * @param {Coordinate} userLocation - User's location
 * @param {Object} preferenceMaps - Object with preference Maps
 * @returns {Event[]} - Ranked events
 */
const rankEvents = (events, userLocation, preferenceMaps) => {
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
  const bounds = getBounds(eventsWithDistance, preferenceMaps);
  const eventsWithWeights = eventsWithDistance.map((event) => {
    event.weight = getEventWeight(event, bounds, preferenceMaps);
    return event;
  });
  const rankedEvents = eventsWithWeights.toSorted((a, b) =>
    a.weight < b.weight ? 1 : -1
  );
  return rankedEvents;
};

/**
 * Finds the max, min, and ranges of multiple fields, such as
 * distance, date, sport values, time values, and distance values.
 * @param {Event[]} events
 * @param {Object} preferenceMaps - Object with preference Maps
 * @returns {Bound} - The bounds of the fields
 */
const getBounds = (events, preferenceMaps) => {
  const sportMap = preferenceMaps.userSportsMap;
  const userTimesMap = preferenceMaps.userTimesMap;
  const userDistanceMap = preferenceMaps.userDistanceMap;

  const minDistance = Math.min(...events.map((event) => event.distance));
  const maxDistance = Math.max(...events.map((event) => event.distance));
  const minDate = Math.min(...events.map((event) => new Date(event.eventTime)));
  const maxDate = Math.max(...events.map((event) => new Date(event.eventTime)));
  const maxSportValue = Math.max(...sportMap.values());
  const distanceRange = maxDistance - minDistance;
  const dateRange = maxDate - minDate;
  const maxTimeValue = Math.max(...userTimesMap.values());
  const maxDistanceValue = Math.max(...userDistanceMap.values());
  return {
    maxSportValue: maxSportValue > 0 ? maxSportValue : 1,
    minDistance,
    maxDistance,
    minDate,
    maxDate,
    distanceRange,
    dateRange,
    maxTimeValue: maxTimeValue > 0 ? maxTimeValue : 1,
    maxDistanceValue: maxDistanceValue > 0 ? maxDistanceValue : 1,
  };
};

/**
 * Gets an event weight for an event where the higher the weight is,
 * the higher the event should be recommended.
 * @param {Event} event - The current event
 * @param {Bound} bounds - Bounds of Fields for ranked events
 * @param {Object} preferenceMaps - Object with preference Maps
 * @returns {number} - Resulting weight for the object
 */
const getEventWeight = (event, bounds, preferenceMaps) => {
  const sportsMap = preferenceMaps.userSportsMap;
  const userTimesMap = preferenceMaps.userTimesMap;
  const userDistanceMap = preferenceMaps.userDistanceMap;
  const LOCATION_WEIGHT = 0.45; // 45%
  const DISTANCE_WEIGHT = 0.05; // 5%
  const DATE_WEIGHT = 0.25; // 25%
  const SPORT_WEIGHT = 0.15; // 15%
  const TIME_OF_DAY_WEIGHT = 0.1; // 10%
  const sportValue = sportsMap.get(event.sport)
    ? sportsMap.get(event.sport)
    : 0;
  const sportWeight =
    1 - (bounds.maxSportValue - sportValue) / bounds.maxSportValue;
  const locationWeight =
    1 - (event.distance - bounds.minDistance) / bounds.distanceRange;
  const dateWeight =
    1 - (new Date(event.eventTime) - bounds.minDate) / bounds.dateRange;
  const eventDate = new Date(event.eventTime);
  const minutes = eventDate.getMinutes();
  const roundUp = Math.floor(minutes / 30);
  const hour = roundUp ? eventDate.getHours() + 1 : eventDate.getHours();
  const timeValue = userTimesMap.get(hour) ? userTimesMap.get(hour) : 0;
  const timeWeight =
    1 - (bounds.maxTimeValue - timeValue) / bounds.maxTimeValue;
  const distanceValue = _getDistanceValue(event.distance, userDistanceMap);
  const distanceWeight =
    1 - (bounds.maxDistanceValue - distanceValue) / bounds.maxDistanceValue;
  return (
    sportWeight * SPORT_WEIGHT +
    locationWeight * LOCATION_WEIGHT +
    dateWeight * DATE_WEIGHT +
    timeWeight * TIME_OF_DAY_WEIGHT +
    distanceWeight * DISTANCE_WEIGHT
  );
};

/*
Gets the distance value for a given distance
*/
const _getDistanceValue = (distance, userDistanceMap) => {
  const index = DISTANCE_RANGES.findIndex(
    (currDistance) => distance <= currDistance
  );
  if (index === -1) {
    return 0;
  }
  const value = userDistanceMap.get(DISTANCE_RANGES[index]);
  return value ? value : 0;
};

module.exports = { rankEvents };
