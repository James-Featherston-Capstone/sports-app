const { performHaversine } = require("../recommendations/locationUtils");

/*
Removes outliers from consideration
Inputs: users and outlier
Output: a list of users to keep and drop
*/
const filterOutliers = (users, organizer, multiplier = 2) => {
  if (users.length < 3) {
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
    if (distances[index] <= median * multiplier || distances[index] <= 50) {
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
