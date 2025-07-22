const prisma = require("../prisma.js");
const locationUtils = require("./locationUtils.js");
const { rankEvents } = require("./rankEvents.js");
const {
  DISTANCE_RANGES,
  NUM_WEATHER_DAYS,
  MILLISECS_TO_DAYS,
} = require("../config.js");

/**
 * Gets the coordinates for a location string using the
 * Google Maps geocode api.
 * @param {string} location - The locations
 * @returns {Coordinate} - The coordinate for that location
 */
const getGeoCode = async (location) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${process.env.GOOGLE_MAPS_API}`
    );
    const data = await response.json();
    if (!data.results[0]) {
      throw new Error("No locations found with input strings");
    }
    const coords = data.results[0].geometry.location;
    return { latitude: coords.lat, longitude: coords.lng };
  } catch (error) {
    throw error;
  }
};

/*
Gets nearby events and recommends them based on user characteristics
Input: user id and user filters
Output: List of events
*/
/**
 * Recommends a list of events to a user based on their location,
 * preferences, and activity. The user is able to add their
 * own filters to get different results.
 * @param {number} userId - The current users id
 * @param {Object} userInputs - The inputs from the user for filtering
 * @returns {Event[]} - List of events sorted
 */
const getAllNearbyEvents = async (userId, userInputs) => {
  const user = await getNeededUserData(userId, userInputs);
  const filters = _getEventsFilters(userInputs);
  const keys = _getEventKeys(user, userInputs);
  const search = userInputs.query ? userInputs.query : "";
  const events = await getEvents(filters, keys, userId, search);
  const preparedEvents = await _prepareEvents(events, userInputs);
  const recentRSVPs = _filterDataLastThreeMonths(user.eventsRSVP);
  const recentClicks = _filterDataLastThreeMonths(user.clickedEvents);
  const userSportsMap = userInputs.sport
    ? new Map([[userInputs.sport, 1]]) // User inputted sport
    : _getUserSportPreferences(recentRSVPs, recentClicks, user.sports);
  const userTimesMap = _getUserPreferredTimes(recentRSVPs, recentClicks);
  const userDistanceMap = _getUserPreferredDistance(recentClicks);
  const rankedEvents = rankEvents(
    preparedEvents,
    { latitude: user.latitude, longitude: user.longitude },
    { userSportsMap, userTimesMap, userDistanceMap },
    userInputs.radius
  );
  return rankedEvents;
};

/**
 * Queries the events table using the keys to get
 * events within a certain radius of the user and user
 * filters.
 * @param {Object} filters - Filters object
 * @param {Key} keys - Indexes for nearby events
 * @param {number} userId - The users id
 * @returns
 */
const getEvents = async (filters, keys, userId, search) => {
  const events = await prisma.event.findMany({
    where: {
      ...filters,
      OR: keys.map((key) => ({
        latitudeKey: key.latitudeKey,
        longitudeKey: key.longitudeKey,
      })),
      OR: [
        { description: { contains: search, mode: "insensitive" } },
        { organizer: { username: { contains: search, mode: "insensitive" } } },
      ],
    },
    include: {
      rsvps: {
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      },
    },
  });
  return events;
};

/**
 * Queries the db, getting all necessary data needed for
 * recommending events to the user such as past RSVPs,
 * clickedEvents, and users preferences.
 * @param {number} userId - The users id
 * @param {Object} userInputs - The inputs from the user for filtering
 * @returns {User} - The current user
 */
const getNeededUserData = async (userId, userInputs) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      eventsRSVP: {
        include: {
          event: true,
        },
      },
      clickedEvents: {
        include: {
          event: {
            select: {
              id: true,
              sport: true,
              eventTime: true,
            },
          },
        },
      },
    },
  });
  if (userInputs.location) {
    user.location = userInputs.location;
    await locationUtils.extractLatLngFields(user);
  }
  return user;
};

/**
 * Creates a filter object for the prisma event db query
 * @param {Object} userInputs - The inputs from the user for filtering
 * @returns {Object} Filters object
 */
const _getEventsFilters = (userInputs) => {
  const filters = {};
  if (userInputs.startDate && userInputs.startDate !== "undefined") {
    const start = new Date(userInputs.startDate);
    start.setHours(0, 0, 0, 0);
    filters.eventTime = {
      gte: start,
    };
  }
  if (userInputs.endDate && userInputs.endDate !== "undefined") {
    const end = new Date(userInputs.endDate);
    end.setHours(23, 59, 59, 59);
    filters.eventTime = {
      ...filters.eventTime,
      lte: end,
    };
  }
  if (userInputs.sport) {
    filters.sport = userInputs.sport;
  }
  return filters;
};

/**
 * Calculates the keys needed for searching events by location using
 * user inputs.
 * @param {User} user - The user
 * @param {Object} userInputs - The inputs from the user for filtering
 * @returns {Key[]} - List of coordinate keys
 */
const _getEventKeys = (user, userInputs) => {
  const baseKey = {
    latitudeKey: user.latitudeKey,
    longitudeKey: user.longitudeKey,
  };
  const radius = userInputs.radius ? parseInt(userInputs.radius) : 10; // In miles
  const offsets = locationUtils.calculateKeyOffsets(radius, user.latitude);
  const keys = locationUtils.getAllKeys(baseKey, offsets);
  return keys;
};

/**
 * @param {Event[]} events
 * @param {Object} userInputs - The inputs from the user for filtering
 * @returns {Event[]} - Prepared events
 */
const _prepareEvents = async (events, userInputs) => {
  const userDate =
    userInputs.date && userInputs.date !== "undefined"
      ? new Date(userInputs.date)
      : new Date();
  const futureEvents = events.filter((event) => {
    const eventDate = new Date(event.eventTime);
    return eventDate >= userDate;
  });
  const eventsWithWeatherData = await _getEventsWeatherData(futureEvents);
  return eventsWithWeatherData;
};

const _getEventsWeatherData = async (events) => {
  const eventsWithWeatherData = await Promise.all(
    events.map(async (event) => {
      const weather = await getGoogleMapsWeather(event);
      return {
        ...event,
        weather: weather,
      };
    })
  );
  return eventsWithWeatherData;
};

const getGoogleMapsWeather = async (event) => {
  const BASE_WEATHER_URL = `https://weather.googleapis.com/v1/forecast/days:lookup`;
  const paramsObj = {
    key: process.env.GOOGLE_MAPS_API,
    "location.latitude": event.latitude,
    "location.longitude": event.longitude,
    days: NUM_WEATHER_DAYS,
  };
  const urlParams = new URLSearchParams(paramsObj);
  const url = `${BASE_WEATHER_URL}?${urlParams.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  const data = await response.json();
  if (data) {
    const weatherIndex = _getWeatherDayIndex(event.eventTime);
    return _formatGoogleMapsWeatherResponse(data, weatherIndex);
  } else {
    return "UNKNOWN";
  }
};

const _formatGoogleMapsWeatherResponse = (data, weatherIndex) => {
  const weatherOnEventDay = data.forecastDays[weatherIndex];
  if (!weatherOnEventDay) {
    return "UNKNOWN";
  } else {
    return weatherOnEventDay.daytimeForecast.weatherCondition.type;
  }
};

const _getWeatherDayIndex = (eventTime) => {
  const now = new Date();
  const eventDate = new Date(eventTime);
  const diff = eventDate - now;
  const diffDays = Math.floor(diff / MILLISECS_TO_DAYS);
  return diffDays;
};

/**
 * Creates a map that tracks how much the user
 * interacts/ preferences each sport.
 * @param {RSVP[]} rsvps - Users previous RSVPs
 * @param {Click[]} clicks - Users previous clicks
 * @param {Sport[]} sports - Users preferred sports
 * @returns {Map} - Sport preference map
 */
const _getUserSportPreferences = (rsvps, clicks, sports) => {
  const PROFILE_SPORT_VALUE = 20;
  const RSVP_SPORT_VALUE = 5;
  const CLICKED_SPORT_VALUE = 1;
  const sportMap = new Map();
  for (const rsvp of rsvps) {
    const sport = rsvp.event.sport;
    sportMap.set(sport, (sportMap.get(sport) || 0) + RSVP_SPORT_VALUE);
  }
  for (const sport of sports) {
    sportMap.set(sport, (sportMap.get(sport) || 0) + PROFILE_SPORT_VALUE);
  }
  for (const click of clicks) {
    const sport = click.event.sport;
    sportMap.set(sport, (sportMap.get(sport) || 0) + CLICKED_SPORT_VALUE);
  }
  return sportMap;
};

/**
 * Creates a Map that tracks how much the user interacts/
 * preferences each hour of the day.
 * @param {RSVP[]} rsvps - Users previous RSVPs
 * @param {Click[]} clicks - Users previous clicks
 * @returns {Map} - Preferred times map
 */
const _getUserPreferredTimes = (rsvps, clicks) => {
  const RSVP_TIME_VALUE = 10;
  const CLICKED_TIME_VALUE = 1;
  const timeOfDayMap = new Map();
  for (const rsvp of rsvps) {
    const eventTime = new Date(rsvp.event.eventTime);
    const minutes = eventTime.getMinutes();
    const roundUp = Math.floor(minutes / 30);
    const hour = roundUp ? eventTime.getHours() + 1 : eventTime.getHours();
    timeOfDayMap.set(hour, (timeOfDayMap.get(hour) || 0) + RSVP_TIME_VALUE);
  }
  for (const click of clicks) {
    const eventTime = new Date(click.event.eventTime);
    const minutes = eventTime.getMinutes();
    const roundUp = Math.floor(minutes / 30);
    const hour = roundUp ? eventTime.getHours() + 1 : eventTime.getHours();
    timeOfDayMap.set(hour, (timeOfDayMap.get(hour) || 0) + CLICKED_TIME_VALUE);
  }
  return timeOfDayMap;
};

/**
 * Created a map that tracks how much a user clicks on events
 * that lie within different radius ranges.
 * @param {Click[]} clicks
 * @returns {Map} - Preferred distance map
 */
const _getUserPreferredDistance = (clicks) => {
  const rangesLength = DISTANCE_RANGES.length;
  const distanceMap = new Map();
  for (const click of clicks) {
    const distance = click.eventDistance;
    for (const range of DISTANCE_RANGES) {
      if (distance <= range) {
        distanceMap.set(range, (distanceMap.get(range) || 0) + 1);
        break;
      }
    }
    const lastRange = DISTANCE_RANGES[rangesLength - 1];
    if (distance > lastRange) {
      distanceMap.set(lastRange + 1, (distanceMap.get(lastRange + 1) || 0) + 1);
    }
  }
  return distanceMap;
};

/*
Filters out RSVPs or clicks for events that happened over 3 months ago. 
*/
const _filterDataLastThreeMonths = (data) => {
  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  const recentData = data.filter((instance) => {
    const eventDate = new Date(instance.event.eventTime);
    return eventDate >= threeMonthsAgo;
  });
  return recentData;
};
module.exports = { getGeoCode, getAllNearbyEvents };
