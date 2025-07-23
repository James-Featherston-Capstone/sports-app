//Returns a date with the correct HH:MM
const getDateTime = (time: string, date: Date | undefined) => {
  let realDate = date;
  if (realDate === undefined) {
    realDate = new Date();
  }
  const arrTime = time.split(":");
  realDate.setHours(parseInt(arrTime[0]));
  realDate.setMinutes(parseInt(arrTime[1]));
  return realDate;
};

//Gets the time in the format HH:MM
const getTimeOfDay = (ISOTime: string) => {
  const date = new Date(ISOTime);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formatHours = hours < 10 ? "0" + hours : hours;
  const formatMinutes = minutes < 10 ? "0" + minutes : minutes;
  const timeString = `${formatHours}:${formatMinutes}`;
  return timeString;
};

//Gets a date string to display
const getDisplayDate = (ISOTime: string): string => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const date = new Date(ISOTime);
  const datePart = date.toLocaleDateString(undefined, dateOptions);
  const timePart = date.toLocaleTimeString(undefined, timeOptions);
  return `${datePart} at ${timePart}`;
};

export { getDateTime, getTimeOfDay, getDisplayDate };
