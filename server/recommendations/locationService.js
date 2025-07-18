const prisma = require("../prisma.js");
const locationUtils = require("./locationUtils.js");
const { rankEvents } = require("./rankEvents.js");
const { DISTANCE_RANGES } = require("../config.js");

/*
Input: Location
Ouput: Latitude and longitude of that location 
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
Input: user id and user filters
Output: List of nearby events sorted by most recommended -> least recommended
*/
const getAllNearbyEvents = async (userId, userInputs) => {
  const user = await getNeededUserData(userId, userInputs);
  const filters = _getEventsFilters(userInputs);
  const keys = _getEventKeys(user, userInputs);
  const events = await getEvents(filters, keys, userId);
  const preparedEvents = _prepareEvents(events, userInputs);
  const recentRSVPs = _filterDataLastThreeMonths(user.eventsRSVP);
  const recentClicks = _filterDataLastThreeMonths(user.clickedEvents);
  const userSportsMap = userInputs.sport
    ? new Map([[userInputs.sport, 1]])
    : _getUserSportPreferences(recentRSVPs, recentClicks, user.sports);
  const userTimesMap = _getUserPreferredTimes(recentRSVPs, recentClicks);
  const userDistanceMap = _getUserPreferredDistance(recentClicks);
  const rankedEvents = rankEvents(
    preparedEvents,
    { latitude: user.latitude, longitude: user.longitude },
    { userSportsMap, userTimesMap, userDistanceMap }
  );
  return rankedEvents;
};

/* 
Retrieve events nearby to the user with the users filters
*/
const getEvents = async (filters, keys, userId) => {
  const events = await prisma.event.findMany({
    where: {
      ...filters,
      OR: keys.map((key) => ({
        latitudeKey: key.latitudeKey,
        longitudeKey: key.longitudeKey,
      })),
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

const _getEventsFilters = (userInputs) => {
  const filters = {};
  if (userInputs.date && userInputs.date !== "undefined") {
    const start = new Date(userInputs.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(userInputs.date);
    end.setHours(23, 59, 59, 999);
    filters.eventTime = {
      gte: start,
      lte: end,
    };
  }
  if (userInputs.sport) {
    filters.sport = userInputs.sport;
  }
  return filters;
};

const _getEventKeys = (user, userInputs) => {
  const baseKey = {
    latitudeKey: user.latitudeKey,
    longitudeKey: user.longitudeKey,
  };
  const radius = userInputs.radius ? userInputs.radius : 10; // In miles
  const offsets = locationUtils.calculateKeyOffsets(radius, user.latitude);
  const keys = locationUtils.getAllKeys(baseKey, offsets);
  return keys;
};

/*
Prepares event data
Input: Events
Output: Prepared Events
*/
const _prepareEvents = (events, userInputs) => {
  const userDate =
    userInputs.date && userInputs.date !== "undefined"
      ? new Date(userInputs.date)
      : new Date();
  const futureEvents = events.filter((event) => {
    const eventDate = new Date(event.eventTime);
    return eventDate >= userDate;
  });
  return futureEvents;
};

/*
Finds sports the user prefers by looking at their profile and old RSVPs
Input: user
Output: Map - key: sport value: Rsvps for sport
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

/*
Finds times the user prefers to play by looking at old RSVPs
Input: User
Output: Map: key: time (hour) value: rsvps for that hour
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

/*
Finds distance the user prefers by looking at user clicks
Input
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
Filters out RSVPs for events that happened over 3 months ago. 
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
