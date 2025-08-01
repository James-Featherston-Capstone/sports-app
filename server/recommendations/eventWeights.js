const {
  MILLISECS_TO_DAYS,
  MAX_TIME_OF_DAY_WEIGHT,
  MAX_DATE_AND_SPORT_WEIGHT,
  MAX_DAYS_AWAY,
  MAX_CHANGE_PER_CLICK,
  MAX_FEATURE_COUNT,
  SHRINK_MULTIPLIER_ON_MAX,
} = require("../config.js");
const prisma = require("../prisma.js");

/**
 * Updates weights for the event recommendation algorithm.
 * Based on an event click, it calculates the likelyhood that the
 * click was based on time of day, sport count, or date count. It
 * then updates the weights to reflect the reason for a click.
 * @param {Click} click - The click event
 */
const handleWeightChange = async (click) => {
  const recommendationData = await getRecommendationData(click.userId);
  const counts = {
    timeOfDayCount: parseFloat(recommendationData.timeOfDayCount),
    sportCount: parseFloat(recommendationData.sportCount),
    dateCount: parseFloat(recommendationData.dateCount),
  };
  const weights = {
    timeOfDayWeight: recommendationData.timeOfDayWeight,
    sportWeight: recommendationData.sportWeight,
    dateWeight: recommendationData.dateWeight,
  };

  const sportBuckets = recommendationData.sportBuckets;
  const timeOfDayBuckets = recommendationData.timeOfDayBuckets;

  const now = new Date();
  const eventTime = new Date(click.event.eventTime);
  const dateDiff = _getDaysDiff(eventTime, now);
  const timeOfDayBucket = _getTimeOfDayBucket(eventTime);

  timeOfDayBuckets[timeOfDayBucket] =
    timeOfDayBuckets[timeOfDayBucket] + 1 || 1;
  sportBuckets[click.event.sport] = sportBuckets[click.event.sport] + 1 || 1;

  const totalTimeOfDay = Object.values(timeOfDayBuckets).reduce(
    (sum, sport) => sum + sport,
    0
  );
  const maxSport = Object.values(sportBuckets).reduce(
    (max, sport) => Math.max(max, sport),
    0
  );

  const sportAddition = sportBuckets[click.event.sport] / maxSport;
  const timeOfDayAddition = timeOfDayBuckets[timeOfDayBucket] / totalTimeOfDay;
  const dateAddition = Math.max((MAX_DAYS_AWAY - dateDiff) / MAX_DAYS_AWAY, 0);

  const shouldShrinkCounts = Object.values(counts).some(
    (count) => count > MAX_FEATURE_COUNT
  );

  const multiplier = shouldShrinkCounts ? SHRINK_MULTIPLIER_ON_MAX : 1;

  const newCounts = {
    timeOfDayCount: (counts.timeOfDayCount + timeOfDayAddition) * multiplier,
    sportCount: (counts.sportCount + sportAddition) * multiplier,
    dateCount: (counts.dateCount + dateAddition) * multiplier,
  };

  const total = Object.values(newCounts).reduce((sum, count) => sum + count, 0);

  const newTimeOfDayWeight = Math.min(
    (1 - MAX_CHANGE_PER_CLICK) * weights.timeOfDayWeight +
      MAX_CHANGE_PER_CLICK * (newCounts.timeOfDayCount / total),
    MAX_TIME_OF_DAY_WEIGHT
  );
  const newDateWeight = Math.min(
    (1 - MAX_CHANGE_PER_CLICK) * weights.dateWeight +
      MAX_CHANGE_PER_CLICK * (newCounts.dateCount / total),
    MAX_DATE_AND_SPORT_WEIGHT
  );
  const newSportWeight = Math.min(
    (1 - MAX_CHANGE_PER_CLICK) * weights.sportWeight +
      MAX_CHANGE_PER_CLICK * (newCounts.sportCount / total),
    MAX_DATE_AND_SPORT_WEIGHT
  );

  const normalized = _normalizeWeights(
    newTimeOfDayWeight,
    newDateWeight,
    newSportWeight
  );

  const updatedRecommendationData = {
    ...newCounts,
    timeOfDayBuckets: timeOfDayBuckets,
    sportBuckets: sportBuckets,
    sportWeight: normalized.sportWeight,
    dateWeight: normalized.dateWeight,
    timeOfDayWeight: normalized.timeOfDayWeight,
  };
  updateRecommendationData(click.userId, updatedRecommendationData);
};

/* Normalizes the weights */
const _normalizeWeights = (
  newTimeOfDayWeight,
  newDateWeight,
  newSportWeight
) => {
  const total = newTimeOfDayWeight + newDateWeight + newSportWeight;
  return {
    timeOfDayWeight: newTimeOfDayWeight / total,
    dateWeight: newDateWeight / total,
    sportWeight: newSportWeight / total,
  };
};

/* Gets the difference in days between two dates */
const _getDaysDiff = (date1, date2) => {
  const diff = date1 - date2;
  const daysDiff = diff / MILLISECS_TO_DAYS;
  return daysDiff;
};

/**
 * Calculates the time of day bucket by
 * rounding the time to the nearest hour.
 * @param {Date} eventTime - The event time
 * @returns {number} - The event bucket
 */
const _getTimeOfDayBucket = (eventTime) => {
  const minutes = eventTime.getMinutes();
  const roundUp = Math.floor(minutes / 30);
  const timeOfDay = roundUp ? eventTime.getHours() + 1 : eventTime.getHours();
  return timeOfDay;
};

/**
 * Gets the recommendation data for a user and creates an
 * entry if one does not already exist.
 * @param {number} userId - The user id
 * @returns {RecommendationData} - Recommendation data for the user
 */
const getRecommendationData = async (userId) => {
  const data = await prisma.recommendationData.upsert({
    where: { userId: userId },
    update: {},
    create: { userId: userId, timeOfDayBuckets: {}, sportBuckets: {} },
  });
  return data;
};

/**
 * Updates the recommendation data for a user
 * @param {number} userId - The user id
 * @param {RecommendationData} newData - The updated recommendation data
 * @returns
 */
const updateRecommendationData = async (userId, newData) => {
  const result = await prisma.recommendationData.update({
    where: { userId: userId },
    data: newData,
  });
  return result;
};

module.exports = { handleWeightChange };
