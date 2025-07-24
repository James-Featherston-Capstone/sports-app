const { DISTANCE_RANGES, DEFAULT_WEATHER_WEIGHTS } = require("../config");
const { performHaversine } = require("./locationUtils");

/**
 * Ranks events based on user preferences/ activity and sorts.
 * @param {Event[]} events - Events to rank
 * @param {Coordinate} userLocation - User's location
 * @param {Object} preferenceMaps - Object with preference Maps
 * @returns {Event[]} - Ranked events
 */
const rankEvents = (
  events,
  userLocation,
  preferenceMaps,
  radius,
  dynamicWeights
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
  const realRadius = radius ? radius : 10;
  const filterFarEvents = eventsWithDistance.filter(
    (event) => event.distance < realRadius
  );
  const bounds = getBounds(filterFarEvents, preferenceMaps);
  const eventsWithWeights = filterFarEvents.map((event) => {
    event.weight = getEventWeight(
      event,
      bounds,
      preferenceMaps,
      dynamicWeights
    );
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
    distanceRange: distanceRange > 0 ? distanceRange : 1,
    dateRange: dateRange > 0 ? dateRange : 1,
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
const getEventWeight = (event, bounds, preferenceMaps, dynamicWeights) => {
  const sportsMap = preferenceMaps.userSportsMap;
  const userTimesMap = preferenceMaps.userTimesMap;
  const userDistanceMap = preferenceMaps.userDistanceMap;
  const LOCATION_WEIGHT = 0.45; // 45%
  const DISTANCE_WEIGHT = 0.05; // 5%
  const WEATHER_WEIGHT = 0.05; // 5%
  const DYNAMIC_WEIGHT_PERCENTAGE = 0.45; //45%
  const dynamicSportWeight =
    DYNAMIC_WEIGHT_PERCENTAGE * dynamicWeights.sportWeight;
  const dynamicDateWeight =
    DYNAMIC_WEIGHT_PERCENTAGE * dynamicWeights.dateWeight;
  const dynamicTimeOfDayWeight =
    DYNAMIC_WEIGHT_PERCENTAGE * dynamicWeights.timeOfDayWeight;
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
  const weatherWeight = _getWeatherValue(event.weather);
  return (
    sportWeight * dynamicSportWeight +
    locationWeight * LOCATION_WEIGHT +
    dateWeight * dynamicDateWeight +
    timeWeight * dynamicTimeOfDayWeight +
    distanceWeight * DISTANCE_WEIGHT +
    weatherWeight * WEATHER_WEIGHT
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

/**
 * Returns a value given the weather condition. All conditions are
 * found using the google maps API.
 * https://developers.google.com/maps/documentation/weather/
 * @param {string} condition - The weather description
 */
const _getWeatherValue = (condition) => {
  for (const [key, weight] of Object.entries(DEFAULT_WEATHER_WEIGHTS)) {
    if (condition.includes(key)) {
      return weight;
    }
  }
  return 0; //Return 0 if not found
};

module.exports = { rankEvents };
