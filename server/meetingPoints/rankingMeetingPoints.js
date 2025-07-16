const UPVOTE_WEIGHT = 0.3; // 30%
const MAX_DISTANCE_WEIGHT = 0.2; // 20%
const AVERAGE_DISTANCE_WEIGHT = 0.5; // 50 %

/*
Fetchs a list of meeting points with certain qualities such as most optimal,
smallest average distance, and smallest max distance
Input: Meeting points
Output: Recommended Meeting Points
*/
const recommendBestUserPreferences = (meetingPoints) => {
  if (meetingPoints.length === 1) {
    const bestUserPreference = {
      recommendationTitle: "Preferenced Meeting Point",
      ...meetingPoints[0],
    };
    return [bestUserPreference];
  }
  const bounds = _getNormalizationBounds(meetingPoints);
  const weightedMeetingPoints = _weightMeetingPoints(meetingPoints, bounds);
  const preferenceWithLargestWeight = weightedMeetingPoints.reduce(
    (bestPreference, currPreference) =>
      bestPreference && bestPreference.weight >= currPreference.weight
        ? bestPreference
        : currPreference
  );
  const bestUserPreference = {
    recommendationTitle: "Optimal Preferenced Meeting Point",
    ...preferenceWithLargestWeight,
  };

  return [bestUserPreference]; // Only optimal meeting point recommended so far
};

/*
Weights meeting points by normalizing the values and using weight constants.
Input: Meeting points list and a bounds object
Output: Meeting points list with weights
*/
const _weightMeetingPoints = (meetingPoints, bounds) => {
  const averageDistanceRange = Math.max(
    bounds.maxAvgDistance - bounds.minAvgDistance,
    1
  );
  const maximumDistanceRange = Math.max(
    bounds.maxMaxDistance - bounds.minMaxDistance,
    1
  );
  const upvotesRange = Math.max(bounds.maxUpvotes - bounds.minUpvotes, 1);
  return meetingPoints.map((point) => {
    const upvotesScore = (point.upvotes - bounds.minUpvotes) / upvotesRange;
    const maxDistanceScore =
      1 -
      (point.maximumDistance - bounds.minMaxDistance) / maximumDistanceRange;
    const averageDistance =
      1 -
      (point.averageDistance - bounds.minAvgDistance) / averageDistanceRange;
    const weight =
      upvotesScore * UPVOTE_WEIGHT +
      maxDistanceScore * MAX_DISTANCE_WEIGHT +
      averageDistance * AVERAGE_DISTANCE_WEIGHT;
    return {
      ...point,
      weight,
    };
  });
};

/*
Finds the min and max of each value to be used for normalization
*/
const _getNormalizationBounds = (meetingPoints) => {
  const minAvgDistance = Math.min(
    ...meetingPoints.map((point) => point.averageDistance)
  );
  const maxAvgDistance = Math.max(
    ...meetingPoints.map((point) => point.averageDistance)
  );

  const minMaxDistance = Math.min(
    ...meetingPoints.map((point) => point.maximumDistance)
  );
  const maxMaxDistance = Math.max(
    ...meetingPoints.map((point) => point.maximumDistance)
  );
  const minUpvotes = meetingPoints[0].upvotes
    ? Math.min(...meetingPoints.map((point) => point.upvotes))
    : 0;
  const maxUpvotes = meetingPoints[0].upvotes
    ? Math.max(...meetingPoints.map((point) => point.upvotes))
    : 0;
  return {
    minAvgDistance,
    maxAvgDistance,
    minMaxDistance,
    maxMaxDistance,
    minUpvotes,
    maxUpvotes,
  };
};

module.exports = {
  recommendBestUserPreferences,
};
