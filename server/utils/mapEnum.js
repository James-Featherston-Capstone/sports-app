const { Sports } = require("../generated/prisma");

const mapSports = (sport) => {
  const lowerSport = sport.toLowerCase();
  switch (lowerSport) {
    case "football":
      return Sports.FOOTBALL;
    case "soccer":
      return Sports.SOCCER;
    case "basketball":
      return Sports.BASKETBALL;
    case "baseball":
      return Sports.BASEBALL;
    case "tennis":
      return Sports.TENNIS;
    case "pickleball":
      return Sports.PICKLEBALL;
    case "softball":
      return Sports.SOFTBALL;
    case "racquetball":
      return Sports.RACQUETBALL;
    case "frisbee":
      return Sports.FRISBEE;
    case "volleyball":
      return Sports.VOLLEYBALL;
    case "golf":
      return Sports.GOLF;
    case "hockey":
      return Sports.HOCKEY;
    default:
      return Sports.NONE;
  }
};

module.exports = { mapSports };
