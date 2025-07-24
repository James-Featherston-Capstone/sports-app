const prisma = require("../prisma.js");

/*
Create a function to update the event counts:
When you click on an event: Find the maxes for every feature that is non-linear

Find the the new importance by of the each new count / totalCounts
Create a max change variable by using a constant and doing
for each weight weight = (1 - change) * w + change * new importance

*/
/**
 *
 * @param {*} click
 */
const handleWeightChange = async (click) => {
  await getRecommendationData(click.userId);
  const MAX_DAYS_AWAY = 7;
  const counts = {
    timeOfDayCount: 0,
    sportCount: 0,
    dateCount: 0,
  };
  const mockWeights = {
    timeOfDayWeight: 0.15,
    sportWeight: 0.35,
    dateWeight: 0.5,
  };

  const mockSportsBuckets = {
    SOCCER: 5,
    BASEBALL: 10,
    BASKETBALL: 15,
  };
  const mockTimeOfDayBuckets = {
    10: 5,
    11: 2,
    12: 7,
  };

  const now = new Date();
  const eventTime = new Date(click.event.eventTime);
  const dateDiff = _getDaysDiff(eventTime, now);
  const timeOfDayBucket = _getTimeOfDayBucket(eventTime);

  mockTimeOfDayBuckets[timeOfDayBucket] =
    mockTimeOfDayBuckets[timeOfDayBucket] + 1 || 1;
  mockSportsBuckets[click.event.sport] =
    mockSportsBuckets[click.event.sport] + 1 || 1;

  const totalTimeOfDay = Object.values(mockTimeOfDayBuckets).reduce(
    (sum, sport) => sum + sport,
    0
  );
  const totalSport = Object.values(mockSportsBuckets).reduce(
    (sum, sport) => sum + sport,
    0
  );

  const sportAddition = mockSportsBuckets[click.event.sport] / totalSport;
  const timeOfDayAddition =
    mockTimeOfDayBuckets[timeOfDayBucket] / totalTimeOfDay;
  const dateAddition =
    Math.max((MAX_DAYS_AWAY - dateDiff) / MAX_DAYS_AWAY, 0) * 0.33;

  const newCounts = {
    timeOfDayCount: counts.timeOfDayCount + timeOfDayAddition,
    sportCount: counts.sportCount + sportAddition,
    dateCount: counts.dateCount + dateAddition,
  };

  const MAX_CHANGE = 0.1;
  const newTimeOfDayWeight = Math.min(
    (1 - MAX_CHANGE) * mockWeights.timeOfDayWeight +
      MAX_CHANGE * newCounts.timeOfDayCount,
    0.15
  );
  const newDateWeight =
    (1 - MAX_CHANGE) * mockWeights.dateWeight +
    MAX_CHANGE * newCounts.dateCount;
  const newSportWeight =
    (1 - MAX_CHANGE) * mockWeights.sportWeight +
    MAX_CHANGE * newCounts.sportCount;

  const updatedRecommendationData = {
    ...newCounts,
    timeOfDayBuckets: mockTimeOfDayBuckets,
    sportBuckets: mockSportsBuckets,
    sportWeight: newSportWeight,
    dateWeight: newDateWeight,
    timeOfDayWeight: newTimeOfDayWeight,
  };
  updateRecommendationData(click.userId, updatedRecommendationData);
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
  console.log(data);
};

/* 
Updates recommendation data
*/
const updateRecommendationData = async (userId, newData) => {
  const result = await prisma.recommendationData.update({
    where: { userId: userId },
    data: newData,
  });
  console.log(result);
};
module.exports = { handleWeightChange };
