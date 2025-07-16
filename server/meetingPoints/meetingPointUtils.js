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
};
