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

const getTimeOfDay = (ISOTime: string) => {
  const date = new Date(ISOTime);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formatHours = hours < 10 ? "0" + hours : hours;
  const formatMinutes = minutes < 10 ? "0" + minutes : minutes;
  const timeString = `${formatHours}:${formatMinutes}`;
  return timeString;
};

export { getDateTime, getTimeOfDay };
