/*
Creates a list with information about each park and how far the meeting point is from each user.
Input: Meeting points, users, events
Output: List of meeting points that contain information about how far it is to each user.
*/
const getDistancesFromUsersToParks = async (meetingPoints, users, event) => {
  const { fetchOptimalRoute } = require("./meetingPointService.js");

  const result = await Promise.all(
    meetingPoints.map(async (meetingPoint) => {
      const userDistances = await Promise.all(
        users.map(async (user) => {
          return await fetchOptimalRoute(event, user, meetingPoint);
        })
      );
      return {
        ...meetingPoint,
        userDistances,
      };
    })
  );
  return result;
};

/* 
Gets the median coordiante to find the fairest central point
for all the users.
Input: Users list with locations
Output: Central coordinate.
*/
const getUsersCenterCoordinate = (users) => {
  if (users.length === 0) {
    throw new Error("Users required");
  }
  const latitudes = users
    .map((user) => parseFloat(user.latitude))
    .toSorted((lat1, lat2) => lat1 - lat2);
  const longitudes = users
    .map((user) => parseFloat(user.longitude))
    .toSorted((lng1, lng2) => lng1 - lng2);

  const midPoint = Math.floor(users.length / 2);
  const odd = users.length % 2;

  const medianLatitude = odd
    ? latitudes[midPoint]
    : (latitudes[midPoint] + latitudes[midPoint - 1]) / 2;
  const medianLongitude = odd
    ? longitudes[midPoint]
    : (longitudes[midPoint] + longitudes[midPoint - 1]) / 2;
  return { latitude: medianLatitude, longitude: medianLongitude };
};

/* 
Computes distance metrics for each meeting points and adds them to the object
*/
const computeDistanceAveragesAndMaximums = (meetingPoints) => {
  const result = meetingPoints.map((meetingPointData) => {
    return {
      ...meetingPointData,
      averageDistance: findAverageDistance(meetingPointData),
      maximumDistance: findMaxDistance(meetingPointData),
      averageTravelTime: findAverageTravelTime(meetingPointData),
      maximumTravelTime: findMaxTravelTime(meetingPointData),
    };
  });
  return result;
};

/* 
Finds average distance in miles from each user to a meeting point
*/
const findAverageDistance = (meetingPointsData) => {
  const totalDistance = meetingPointsData.userDistances.reduce(
    (sum, distance) => sum + distance.miles,
    0
  );
  const averageDistance =
    totalDistance / meetingPointsData.userDistances.length;
  return averageDistance;
};

/* 
Finds maximum distance in miles from each user to a meeting point
*/
const findMaxDistance = (meetingPointsData) => {
  const maxDistance = meetingPointsData.userDistances.reduce(
    (maximumDistance, distance) => Math.max(maximumDistance, distance.miles),
    0
  );
  return maxDistance;
};

/* 
Finds average time in minutes from each user to a meeting point
*/
const findAverageTravelTime = (meetingPointsData) => {
  const totalTravelTime = meetingPointsData.userDistances.reduce(
    (sum, distance) => sum + distance.minutes,
    0
  );
  const averageTravelTime =
    totalTravelTime / meetingPointsData.userDistances.length;
  return averageTravelTime;
};

/* 
Finds maximum time in minutes from each user to a meeting point
*/
const findMaxTravelTime = (meetingPointsData) => {
  const maxTravelTime = meetingPointsData.userDistances.reduce(
    (currentMax, distance) => Math.max(currentMax, distance.minutes),
    0
  );
  return maxTravelTime;
};

module.exports = {
  getDistancesFromUsersToParks,
  computeDistanceAveragesAndMaximums,
  getUsersCenterCoordinate,
};
