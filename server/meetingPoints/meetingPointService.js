const prisma = require("../prisma.js");
const meetingPointUtils = require("./meetingPointUtils.js");
const rankingMeetingPoints = require("./rankingMeetingPoints.js");
const { filterOutliers } = require("./outliers.js");
const { GOOGLE_MAPS_RADIUS } = require("../config.js");

/**
 * This algorithm recommends meeting points for a specific event based
 * on where the rsvp'd users are located. It has two types of meeting points
 * that it recommends: user inputed meeting points, and generated meeting
 * points. It filters out users that have a location that is an outlier
 * to the other users.
 * @param {number} eventId - The event ID
 * @returns { MeetingPoint[] } -  A list of recommended meeting points
 */
const suggestMeetingPoints = async (eventId) => {
  const fullEvent = await getFullEventWithId(eventId);
  if (!fullEvent) {
    return [];
  }
  const { event, userSetMeetingPoints, fetchedUsers } =
    _parseFullEvent(fullEvent);
  const { keptUsers } = filterOutliers(fetchedUsers, event.organizer);
  // If there are no RSVP's, it sets the users to only the organizer.
  const users = keptUsers.length === 0 ? [event.organizer] : fetchedUsers;
  const preferenceMeetingPoints = await suggestPreferenceMeetingPoint(
    event,
    userSetMeetingPoints,
    users
  );
  const generatedMeetingPoints = await suggestGeneratedMeetingPoints(
    event,
    users
  );
  const recommendedMeetingPointsList = [
    ...preferenceMeetingPoints,
    ...generatedMeetingPoints,
  ];
  return recommendedMeetingPointsList;
};

/**
 * The function recommends user inputed meeting points by finding the
 * distance from each meeting point to each user, finding the max and average distance
 * from the meeting points to the users, and recommending the meeting point with
 * the best combination of minimum average distance and minimum max distance.
 * @param {Event} event - The event to recommend meeting points for
 * @param {MeetingPoint[]} userSetMeetingPoints - A list of preset meeting points
 * @param {User[]} users - A list of users that RSVP'd for the event
 * @returns
 */
const suggestPreferenceMeetingPoint = async (
  event,
  userSetMeetingPoints,
  users
) => {
  //No users or no meeting points
  if (userSetMeetingPoints.length === 0 || !users) {
    return [];
  }
  const preppedMeetingPoints = await _handleMeetingPointsPrep(
    userSetMeetingPoints,
    users,
    event
  );
  if (preppedMeetingPoints.length === 0) {
    return [];
  }
  const recommendedMeetingPoints =
    rankingMeetingPoints.recommendBestUserPreferences(preppedMeetingPoints);
  return recommendedMeetingPoints;
};

/**
 * The function recommends the most optimal generated meeting point
 * using the Google Maps Text Search API. It chooses a center coordinate
 * to search for meeting points with. Once retrieved it calculates the distance
 * from the meeting points to every RSVP'd user and calculates max and average
 * distances. It then recommends the meeting point that works best for the users.
 * @param {Event} event - The event to find meeting points for.
 * @param {User[]} users - The users RSVP'd to the event
 * @returns {MeetingPoint[]} - A list with generated meeting point recommendations
 */
const suggestGeneratedMeetingPoints = async (event, users) => {
  const centerCoordinate = meetingPointUtils.getUsersCenterCoordinate(users);
  const generatedMeetingPoints = await fetchGoogleMapsNearbyMeetingPoints(
    centerCoordinate,
    event.sport
  );
  // If no meeting points are generated, return an empty list
  if (generatedMeetingPoints.length === 0) {
    return [];
  }
  const preppedMeetingPoints = await _handleMeetingPointsPrep(
    generatedMeetingPoints,
    users,
    event
  );
  if (preppedMeetingPoints.length === 0) {
    return [];
  }
  const recommendations =
    rankingMeetingPoints.recommendBestGeneratedEvent(preppedMeetingPoints);
  return recommendations;
};

/**
 * The function preps a list of meeting points by calculating the
 * distance from every meeting to every user and calculates the maximum
 * and minimums for each meeting point. These calculations are used to
 * rank the best meeting points.
 * @param {MeetingPoint[]} meetingPoints - List of meeting points
 * @param {User[]} users - List of RSVP'd users
 * @param {Event[]} event - The event
 * @returns {MeetingPoint[]} - Meeting points with distance calculations
 */
const _handleMeetingPointsPrep = async (meetingPoints, users, event) => {
  const distancesFromUsersToParks =
    await meetingPointUtils.getDistancesFromUsersToParks(
      meetingPoints,
      users,
      event
    );
  if (distancesFromUsersToParks.length === 0) {
    return [];
  }
  const meetingPointsWithDistanceCalculations =
    meetingPointUtils.computeDistanceAveragesAndMaximums(
      distancesFromUsersToParks
    );
  return meetingPointsWithDistanceCalculations;
};

/*
Retrieves the full event, including event details, rsvps, and user preferences.
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
    console.error(error);
    return null;
  }
};

/*
Parses the event to break it down into event, set meeting points, and users.
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

/**
 * The function uses the google maps Routes API to find the distance from a
 * user to a meeting point. It uses the event time to find the travel time based
 * on when the event is. It then creates an object with information about the travel
 * distance from the user to the meeting point.
 * @param {Event} event - The event
 * @param {User} user - The user
 * @param {MeetingPoint} meetingPoint - The meeting point
 * @returns {Object} - An object with the user id, distance in meters,
 * miles, minutes, and seconds.
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
      throw new Error(
        `Optimal Route API failed: ${response.status}, ${response.statusText}`
      );
    }
    const data = await response.json();
    const formattedRoute = _formatGoogleMapsResponse(data, user.id);
    return formattedRoute;
  } catch (error) {
    console.error(error);
    return null;
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

/**
 * The function queries the google maps places API to find a list of potential
 * meeting points around a central coordinate. It uses the sport taking place
 * to query nearby. It filters out sports-clubs to prevent private locations
 * from being recommended.
 * @param {Coordinate} centerCoordinate - The coordinate to base searches on
 * @param {string} sport - The event sport
 * @returns {MeetingPoint[]} - List of nearby meeting points to a central coordinate
 */
const fetchGoogleMapsNearbyMeetingPoints = async (centerCoordinate, sport) => {
  const BASE_SEARCH_URL = `https://places.googleapis.com/v1/places:searchText?key=${process.env.GOOGLE_MAPS_API}`;
  try {
    const reqBody = {
      maxResultCount: 15,
      textQuery: sport,
      locationBias: {
        circle: {
          center: {
            latitude: centerCoordinate.latitude,
            longitude: centerCoordinate.longitude,
          },
          radius: GOOGLE_MAPS_RADIUS,
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
      throw new Error(
        `Nearby Meeting Points Search API Failed: ${response.status}, ${response.statusText}`
      );
    }
    const data = await response.json();
    if (data) {
      const results = _formatGoogleMapsNearbyMeetingPoints(data);
      return results;
    } else {
      // No response
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

/*
Filters out private meeting points and formats the response.
Input: Google Maps meeting points list
Output: Formatted list of meeting points
*/
/**
 * Format the google maps places response to match the structure of
 * the user inputted meeting points. Additionally, filter out
 * locations that may be private.
 * @param {MeetingPoint[]} meetingPoints - Generated meeting points
 * @returns {MeetingPoint{}} - Formatted meeting points
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
  // If all parks were filtered out, recommend original meeting points
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
