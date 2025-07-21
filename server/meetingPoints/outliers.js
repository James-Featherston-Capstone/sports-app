const { performHaversine } = require("../recommendations/locationUtils");
const REQUIRED_USERS_FOR_FILTER = 3;
const SAFETY_RADIUS = 30; // miles

/**
 * Removes outliers in a list of users. Uses the organizer as
 * the center location and filters out users who are not within
 * the multiplier times the median distance from the organizer or
 * within a safety radius of the organizer.
 * @param {User[]} users - A list of RSVP'd users for an event
 * @param {User} organizer - The event organizer
 * @param {number} multiplier - The radius multiplier
 * @returns {Users[], Users[]} - Users kept and dropped
 */
const filterOutliers = (users, organizer, multiplier = 2) => {
  if (users.length < REQUIRED_USERS_FOR_FILTER) {
    return { keptUsers: users, droppedUsers: [] };
  }
  const distances = users.map((user) => {
    return performHaversine(
      user.latitude,
      user.longitude,
      organizer.latitude,
      organizer.longitude
    );
  });
  const median = findMedian(distances);
  const keptUsers = users.filter((user, index) => {
    if (
      distances[index] <= median * multiplier ||
      distances[index] <= SAFETY_RADIUS
    ) {
      return user;
    }
  });
  const droppedUsers = users.filter((user, index) => {
    if (distances[index] > median * multiplier) {
      return user;
    }
  });
  return { keptUsers, droppedUsers };
};

/*
Finds the median of a list of distances
*/
const findMedian = (distances) => {
  const sortedDistances = distances.toSorted((a, b) => a - b);
  const midIndex = Math.floor(distances.length / 2);
  return sortedDistances.length % 2
    ? sortedDistances[midIndex]
    : (sortedDistances[midIndex] + sortedDistances[midIndex]) / 2;
};

module.exports = { filterOutliers };
