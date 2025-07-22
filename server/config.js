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
Provides the different weather types and their values
*/
const DEFAULT_WEATHER_ENTRIES = [
  ["CLEAR", 1],
  ["CLOUDY", 0.8],
  ["WIND", 0.7],
  ["UNKNOWN", 0.6],
  ["RAIN", 0.5],
  ["SHOWERS", 0.4],
  ["SNOW", 0.2],
  ["HAIL", 0],
  ["THUNDERSTORM", 0],
];
const WEATHER_VALUES_MAP = new Map(DEFAULT_WEATHER_ENTRIES);

module.exports = {
  GOOGLE_MAPS_RADIUS,
  DISTANCE_RANGES,
  MAX_AGE,
  NUM_WEATHER_DAYS,
  MILLISECS_TO_DAYS,
  WEATHER_VALUES_MAP,
};
