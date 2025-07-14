const { performHaversine } = require("./locationUtils");
const TO_DAYS = 1000 * 60 * 60 * 24; // Milliseconds to days
/*
Takes in a list of nearby events to the user and ranks them based on user preferences
Input: events, user location, user sports preferences, date
Ouput: Ranked list of events
*/
const rankEvents = (events, userLocation, sports, userDate) => {
  const eventsWithDistance = events.map((event) => {
    event.distance =
      Math.round(
        performHaversine(
          userLocation.latitude,
          userLocation.longitude,
          event.latitude,
          event.longitude
        ) * 100
      ) / 100;
    return event;
  });
  const eventsWithWeights = eventsWithDistance.map((event) => {
    event.weight = getEventWeight(event, sports, userDate);
    return event;
  });
  const rankedEvents = eventsWithWeights.toSorted((a, b) =>
    a.weight < b.weight ? 1 : -1
  );
  return rankedEvents;
};

/*
Gets an event weight for an event where the higher the weight is, 
the higher the event should be recommended.
Input: Takes event, user date, and user's sports preferences
Ouput: A weight for the event
*/
const getEventWeight = (event, sports, userDate) => {
  const MAXDIST = 8;
  const WEIGHTS = { location: 1.3, date: 0.4, sport: 2 };
  const sportWeight = sports.includes(event.sport) ? WEIGHTS.sport : 0;
  const distanceWeight = (MAXDIST - event.distance) * WEIGHTS.location;
  const eventDate = new Date(event.eventTime);
  const dayDifference = getDaysDifference(eventDate, userDate);
  const timeUntilEventWeight =
    dayDifference < 7
      ? Math.min(
          (7 / (dayDifference === 0 ? 0.5 : dayDifference)) * WEIGHTS.date,
          3
        )
      : 0;
  return sportWeight + distanceWeight + timeUntilEventWeight;
};

/*
Input: Two dates
Ouput: The number of days apart the days are
*/
const getDaysDifference = (date1, date2) => {
  const time1 = date1.getTime();
  const time2 = date2.getTime();
  const diff = Math.abs(time1 - time2);
  const daysDiff = diff / TO_DAYS; //Convert millisecond difference to days difference
  return daysDiff;
};

module.exports = { rankEvents };
