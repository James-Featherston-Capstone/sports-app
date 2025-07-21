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

module.exports = { GOOGLE_MAPS_RADIUS, DISTANCE_RANGES, MAX_AGE };
