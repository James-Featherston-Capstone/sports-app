const prisma = require("../prisma.js");
const meetingPointUtils = require("./meetingPointUtils.js");
const rankingMeetingPoints = require("./rankingMeetingPoints.js");
const { filterOutliers } = require("./outliers.js");

/*
Entry point for the algorithm
Input: eventId
Output: List of recommended parks that used different ranking algorithms
*/
const suggestMeetingPoints = async (eventId) => {
  const fullEvent = await getFullEventWithId(eventId);
  const { event, userSetMeetingPoints, fetchedUsers } =
    _parseFullEvent(fullEvent);
  const { keptUsers } = filterOutliers(fetchedUsers, event.organizer);
  const users = keptUsers.length === 0 ? event.organizer : fetchedUsers;
  const preferenceMeetingPoints = await suggestPreferenceMeetingPoint(
    event,
    userSetMeetingPoints,
    users
  );
  const generatedMeetingPoints = await suggestGeneratedMeetingPoints(
    event,
    users
  );
  const recommendedMeetingPointsListWithNulls = [
    ...preferenceMeetingPoints,
    ...generatedMeetingPoints,
  ];
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
  if (!userSetMeetingPoints || !users) {
    return null;
  }
  const preppedMeetingPoints = await _handleMeetingPointsPrep(
    userSetMeetingPoints,
    users,
    event
  );
  const recommendedMeetingPoints =
    rankingMeetingPoints.recommendBestUserPreferences(preppedMeetingPoints);
  return recommendedMeetingPoints;
};

/*
Suggests generated meeting points for the users
Input: event, users
Output: List of recommended meeting points
*/
const suggestGeneratedMeetingPoints = async (event, users) => {
  const centerCoordinate = meetingPointUtils.getUsersCenterCoordinate(users);
  const generatedMeetingPoints = await fetchGoogleMapsNearbyMeetingPoints(
    centerCoordinate,
    event.sport
  );
  console.log(generatedMeetingPoints);
  if (generatedMeetingPoints.length === 0) {
    return null;
  }
  const preppedMeetingPoints = await _handleMeetingPointsPrep(
    generatedMeetingPoints,
    users,
    event
  );
  const recommendations =
    rankingMeetingPoints.recommendBestGeneratedEvent(preppedMeetingPoints);
  return recommendations;
};

/*
Preps a list of meeting points
Input: Meeting points, users, event
Output: Meeting points with additional metrics
*/
const _handleMeetingPointsPrep = async (meetingPoints, users, event) => {
  const distancesFromUsersToParks =
    await meetingPointUtils.getDistancesFromUsersToParks(
      meetingPoints,
      users,
      event
    );
  const meetingPointsWithDistanceCalculations =
    meetingPointUtils.computeDistanceAveragesAndMaximums(
      distancesFromUsersToParks
    );
  return meetingPointsWithDistanceCalculations;
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
        sport: true,
        organizer: {
          select: {
            id: true,
            location: true,
            latitude: true,
            longitude: true,
          },
        },
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
            upvotes: true,
          },
        },
      },
    });
    return event;
  } catch (error) {
    throw error;
  }
};

/*
Parses the event to break it down into event, user set meeting points, and users.
*/
const _parseFullEvent = (fullEvent) => {
  const event = {
    id: fullEvent.id,
    eventTime: fullEvent.eventTime,
    organizer: fullEvent.organizer,
    sport: fullEvent.sport,
  };
  const userSetMeetingPoints = fullEvent.preferences;
  const users = fullEvent.rsvps.map((userRSVP) => {
    return userRSVP.user;
  });
  return { event, userSetMeetingPoints, fetchedUsers: users };
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
    const formattedRoute = _formatGoogleMapsResponse(data, user.id);
    return formattedRoute;
  } catch (error) {
    console.error(error);
  }
};

/*
Formats the google maps response
*/
const _formatGoogleMapsResponse = (data, userId) => {
  const meters = data.routes[0].distanceMeters;
  const miles = meters * 0.000621371; // Meters to miles calculation
  const seconds = parseInt(data.routes[0].duration.replace("s", ""));
  const minutes = Math.round(seconds / 60);
  const distanceObj = {
    user: userId,
    meters: meters ? meters : 0, //Fixes bug where no distance is returned when the locations are the same
    miles: miles ? miles : 0,
    minutes: minutes,
    seconds: seconds,
  };
  return distanceObj;
};

/*
Retrieves a list of potential meeting points around a central coordinate
Input: Center coordinate, sport (text query)
Output: A list of meeting points
*/
const fetchGoogleMapsNearbyMeetingPoints = async (centerCoordinate, sport) => {
  const BASE_SEARCH_URL = `https://places.googleapis.com/v1/places:searchText?key=${process.env.GOOGLE_MAPS_API}`;
  try {
    const reqBody = {
      maxResultCount: 10,
      textQuery: sport,
      locationBias: {
        circle: {
          center: {
            latitude: centerCoordinate.latitude,
            longitude: centerCoordinate.longitude,
          },
          radius: 500.0,
        },
      },
    };
    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask":
          "places.formattedAddress,places.displayName,places.location,places.types",
      },
      body: JSON.stringify(reqBody),
    };
    const response = await fetch(BASE_SEARCH_URL, req);
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const data = await response.json();
    if (data) {
      const results = _formatGoogleMapsNearbyMeetingPoints(data);
      return results;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

/*
Filters out private meeting points and formats the response.
Input: Google Maps meeting points list
Output: Formatted list of meeting points
*/
const _formatGoogleMapsNearbyMeetingPoints = (meetingPoints) => {
  const placesList = meetingPoints.places;
  const parks = placesList.filter(
    //Prevents private clubs from being recommended
    (meetingPoint) =>
      ["athletic_field", "sports_activity_location", "park"].some((type) =>
        meetingPoint.types.includes(type)
      ) && !meetingPoint.types.includes("sports_club")
  );
  const actualPlaces = parks.length === 0 ? placesList : parks;
  const formattedPoints = actualPlaces.map((place) => {
    return {
      displayName: place.displayName.text,
      location: place.formattedAddress,
      latitude: place.location.latitude,
      longitude: place.location.longitude,
    };
  });
  return formattedPoints;
};

module.exports = { suggestMeetingPoints, fetchOptimalRoute };
