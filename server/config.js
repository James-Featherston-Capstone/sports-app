/*
Distance ranges used for finding the ranges a user
would typically click on.
*/
const DISTANCE_RANGES = [1, 3, 5, 8, 10, 15, 20, 30];

/*
Used for defining the max distance to search
for locations near a center coordinate.
*/
const GOOGLE_MAPS_RADIUS = 5000.0; //5 Kilometers

/*
Used to set the max age of the cookie
*/
const MAX_AGE = 1000 * 60 * 60; // 1 Hour

/*
The days in the future the Google Maps API searches
*/
const NUM_WEATHER_DAYS = 7; // 7 days

/*
Converts milliseconds to days
Used for date subtraction
*/
const MILLISECS_TO_DAYS = 1000 * 60 * 60 * 24;

/*
The object provides a mapping from weather condition to a weight.
It is used to recommend events with better weather.
*/
const DEFAULT_WEATHER_WEIGHTS = {
  CLEAR: 1,
  CLOUDY: 0.8,
  WIND: 0.7,
  UNKNOWN: 0.6,
  RAIN: 0.5,
  SHOWERS: 0.4,
  SNOW: 0.2,
  HAIL: 0,
  THUNDERSTORM: 0,
};

/* 
The following constants are used for the event weights 
calculation in the event recommendation algorithm 
*/
// Used to calculate the likely hood an event was cliked on
// because it is near in the future
const MAX_DAYS_AWAY = 7;
// Max weight for the time of day.
// Less important weight to the algorithm, so it gets capped.
const MAX_TIME_OF_DAY_WEIGHT = 0.15;
// Max weight for date or sport
// Ensures fairness in the algorithm for extreme cases
const MAX_DATE_AND_SPORT_WEIGHT = 0.6;
// Max weight change per click
const MAX_CHANGE_PER_CLICK = 0.1;

module.exports = {
  GOOGLE_MAPS_RADIUS,
  DISTANCE_RANGES,
  MAX_AGE,
  NUM_WEATHER_DAYS,
  MILLISECS_TO_DAYS,
  DEFAULT_WEATHER_WEIGHTS,
  MAX_DAYS_AWAY,
  MAX_DATE_AND_SPORT_WEIGHT,
  MAX_TIME_OF_DAY_WEIGHT,
  MAX_CHANGE_PER_CLICK,
};
