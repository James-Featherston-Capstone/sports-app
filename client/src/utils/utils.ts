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

export { getDateTime };
