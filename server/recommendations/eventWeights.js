const prisma = require("../prisma.js");

/**
 *
 * @param {*} click
 */
const handleWeightChange = async (click) => {
  const recommendationData = await getRecommendationData(click.userId);
  const MAX_DAYS_AWAY = 7;
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
  const totalSport = Object.values(sportBuckets).reduce(
    (sum, sport) => sum + sport,
    0
  );

  const sportAddition = sportBuckets[click.event.sport] / totalSport;
  const timeOfDayAddition = timeOfDayBuckets[timeOfDayBucket] / totalTimeOfDay;
  const dateAddition =
    Math.max((MAX_DAYS_AWAY - dateDiff) / MAX_DAYS_AWAY, 0) * 0.33;

  const newCounts = {
    timeOfDayCount: counts.timeOfDayCount + timeOfDayAddition,
    sportCount: counts.sportCount + sportAddition,
    dateCount: counts.dateCount + dateAddition,
  };

  const total = Object.values(newCounts).reduce((sum, count) => sum + count, 1);

  const MAX_CHANGE = 0.1;
  const newTimeOfDayWeight = Math.min(
    (1 - MAX_CHANGE) * weights.timeOfDayWeight +
      MAX_CHANGE * (newCounts.timeOfDayCount / total),
    0.15
  );
  const newDateWeight = Math.min(
    (1 - MAX_CHANGE) * weights.dateWeight +
      MAX_CHANGE * (newCounts.dateCount / total),
    0.65
  );
  const newSportWeight = Math.min(
    (1 - MAX_CHANGE) * weights.sportWeight +
      MAX_CHANGE * (newCounts.sportCount / total),
    0.65
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

const _getDaysDiff = (date1, date2) => {
  const diff = date1 - date2;
  const daysDiff = diff / (1000 * 60 * 60 * 24);
  return daysDiff;
};

const _getTimeOfDayBucket = (eventTime) => {
  const minutes = eventTime.getMinutes();
  const roundUp = Math.floor(minutes / 30);
  const timeOfDay = roundUp ? eventTime.getHours() + 1 : eventTime.getHours();
  return timeOfDay;
};

/* 
Gets recommendation data and creates it if it does not already exist
*/
const getRecommendationData = async (userId) => {
  const data = await prisma.recommendationData.upsert({
    where: { userId: userId },
    update: {},
    create: { userId: userId, timeOfDayBuckets: {}, sportBuckets: {} },
  });
  return data;
};

/* 
Updates recommendation data
*/
const updateRecommendationData = async (userId, newData) => {
  const result = await prisma.recommendationData.update({
    where: { userId: userId },
    data: newData,
  });
};
module.exports = { handleWeightChange };
