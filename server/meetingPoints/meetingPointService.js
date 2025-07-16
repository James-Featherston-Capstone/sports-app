const { NotFoundError } = require("../middleware/Errors.js");
const prisma = require("../prisma.js");
const meetingPointUtils = require("./meetingPointUtils.js");

/*
Entry point for the algorithm
Input: eventId
Output: List of recommended parks that used different ranking algorithms
*/
const suggestMeetingPoints = async (eventId) => {
  const fullEvent = await getFullEventWithId(eventId);
  const { event, userSetMeetingPoints, users } = parseFullEvent(fullEvent);
  const preferenceMeetingPoints = await suggestPreferenceMeetingPoint(
    event,
    userSetMeetingPoints,
    users
  );
  //Will add more to this list such as generated recommendations
  const recommendedMeetingPointsListWithNulls = [...preferenceMeetingPoints];
  // Filters out possible nulls (i.e. when no user preferences are set that suggestion will be null)
  const recommendedMeetingPointsList =
    recommendedMeetingPointsListWithNulls.filter((obj) => obj);
  return recommendedMeetingPointsList;
};

/*
Suggests meeting points based on the users entered events
Input: event, userSetMeetingPoints, users
Output: Lists of recommended meeting points
*/
const suggestPreferenceMeetingPoint = async (
  event,
  userSetMeetingPoints,
  users
) => {
  if (!userSetMeetingPoints) {
    return null;
  }
  const distancesFromUsersToParks =
    await meetingPointUtils.getDistancesFromUsersToParks(
      userSetMeetingPoints,
      users,
      event
    );
  const meetingPointsWithDistanceCalculations =
    meetingPointUtils.computeDistanceAveragesAndMaximums(
      distancesFromUsersToParks
    );
  return [...meetingPointsWithDistanceCalculations]; //Temporarily return all until ranking logic implemented
};

/* 
Retrieves the full event, including event details, rsvps, and user preferences
*/
const getFullEventWithId = async (eventId) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        eventTime: true,
        rsvps: {
          select: {
            user: {
              select: {
                id: true,
                location: true,
                latitude: true,
                longitude: true,
              },
            },
          },
        },
        preferences: {
          select: {
            id: true,
            location: true,
            latitude: true,
            longitude: true,
            eventId: true,
          },
        },
      },
    });
    return event;
  } catch (error) {
    throw new NotFoundError("The event you are querying does not exist");
  }
};

/*
Parses the event to break it down into event, user set meeting points, and users.
*/
const parseFullEvent = (fullEvent) => {
  const event = {
    id: fullEvent.id,
    eventTime: fullEvent.eventTime,
  };
  const userSetMeetingPoints = fullEvent.preferences;
  const users = fullEvent.rsvps.map((userRSVP) => {
    return userRSVP.user;
  });
  return { event, userSetMeetingPoints, users };
};

/* 
Uses the google maps routes API to find the distance from a user to a meeting point.
Uses the event time to determine the travel time based on when the event is.
Returns an object with the travel time, travel distance, and user id.
*/
const fetchOptimalRoute = async (event, user, meetingPoint) => {
  const BASE_ROUTES_URL = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${process.env.GOOGLE_MAPS_API}`;
  try {
    const reqBody = {
      origin: {
        location: {
          latLng: {
            latitude: user.latitude,
            longitude: user.longitude,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: meetingPoint.latitude,
            longitude: meetingPoint.longitude,
          },
        },
      },
      routing_preference: "TRAFFIC_AWARE",
      travelMode: "DRIVE",
      arrivalTime: event.eventTime.toISOString(),
      units: "IMPERIAL",
    };
    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
      },
      body: JSON.stringify(reqBody),
    };
    const path = `${BASE_ROUTES_URL}`;
    const response = await fetch(path, req);
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const data = await response.json();
    const formattedRoute = formatGoogleMapsResponse(data, user.id);
    return formattedRoute;
  } catch (error) {
    console.error(error);
  }
};

/* 
Formats the google maps response
*/
const formatGoogleMapsResponse = (data, userId) => {
  const meters = data.routes[0].distanceMeters;
  const miles = meters * 0.000621371; // Meters to miles calculation
  const seconds = parseInt(data.routes[0].duration.replace("s", ""));
  const minutes = Math.round(seconds / 60);
  const distanceObj = {
    user: userId,
    meters: meters,
    miles: miles,
    minutes: minutes,
    seconds: seconds,
  };
  return distanceObj;
};

suggestMeetingPoints(277);
module.exports = { suggestMeetingPoints, fetchOptimalRoute };
