const prisma = require("../prisma.js");
const userService = require("../services/userService.js");
const locationUtils = require("./locationUtils.js");
const { rankEvents } = require("./rankEvents.js");

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

const getNeededUserData = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      eventsRSVP: {
        include: {
          event: true,
        },
      },
    },
  });
  return user;
};

/*
Input: user id and user filters
Output: List of nearby events sorted by most recommended -> least recommended
*/
const getAllNearbyEvents = async (userId, userInputs) => {
  const user = await getNeededUserData(userId);
  if (userInputs.location) {
    user.location = userInputs.location;
    await locationUtils.extractLatLngFields(user);
  }
  const baseKey = {
    latitudeKey: user.latitudeKey,
    longitudeKey: user.longitudeKey,
  };
  const radius = userInputs.radius ? userInputs.radius : 10; // In miles
  const offsets = locationUtils.calculateKeyOffsets(radius, user.latitude);
  const keys = locationUtils.getAllKeys(baseKey, offsets);
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
  const userDate =
    userInputs.date && userInputs.date !== "undefined"
      ? new Date(userInputs.date)
      : new Date();

  const preparedEvents = _prepareEvents(events, user, userDate);
  const userSportsMap = userInputs.sport
    ? new Map([userInputs.sport, 1])
    : _getUserSportPreferences(user);
  const userPreferedTimesMap = _getUserPreferredTimes(user);
  const rankedEvents = rankEvents(
    preparedEvents,
    { latitude: user.latitude, longitude: user.longitude },
    userSportsMap,
    userDate,
    userPreferedTimesMap
  );
  return rankedEvents;
};

/*
Prepares event data
Input: Events
Output: Prepared Events
*/
const _prepareEvents = (events, user, userDate) => {
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
const _getUserSportPreferences = (user) => {
  const PROFILE_SPORT_WEIGHT_MULTIPLIER = 10; // Give profile sports 10x value of RSVP'd sports
  const profileSports = user.sports;
  const previousRSVPs = _filterRSVPsLastThreeMonths(user.eventsRSVP);
  const profileSportWeight = Math.max(
    previousRSVPs.length / PROFILE_SPORT_WEIGHT_MULTIPLIER,
    3 // Minimum value of 3 for a profile sport weight
  );
  const sportMap = new Map();
  for (const rsvp of previousRSVPs) {
    const sport = rsvp.event.sport;
    sportMap.set(sport, (sportMap.get(sport) || 0) + 1);
  }
  for (const sport of profileSports) {
    sportMap.set(sport, (sportMap.get(sport) || 0) + profileSportWeight);
  }
  return sportMap;
};

/*
Finds times the user prefers to play by looking at old RSVPs
Input: User
Output: Map: key: time (hour) value: rsvps for that hour
*/
const _getUserPreferredTimes = (user) => {
  const previousRSVPs = _filterRSVPsLastThreeMonths(user.eventsRSVP);
  const timeOfDayMap = new Map();
  for (const rsvp of previousRSVPs) {
    const eventTime = new Date(rsvp.event.eventTime);
    const minutes = eventTime.getMinutes();
    const roundUp = Math.floor(minutes / 30);
    const hour = roundUp ? eventTime.getHours() + 1 : eventTime.getHours();
    timeOfDayMap.set(hour, (timeOfDayMap.get(hour) || 0) + 1);
  }
  return timeOfDayMap;
};

/*
Filters out RSVPs for events that happened over 3 months ago. 
*/
const _filterRSVPsLastThreeMonths = (rsvps) => {
  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  const oldRsvps = rsvps.filter((rsvp) => {
    const eventDate = new Date(rsvp.event.eventTime);
    return eventDate >= threeMonthsAgo;
  });
  return oldRsvps;
};

module.exports = { getGeoCode, getAllNearbyEvents };
