import type { Event } from "./interfaces";
const prepEvents = (events: Event[]): Event[] => {
  const formatted = events.map((event: Event) => ({
    ...event,
    isRsvpCurrentUser:
      event.rsvpList !== undefined && event.rsvpList?.length > 0,
  }));
  return formatted;
};

const prepRsvpEvents = (events: Event[]): Event[] => {
  const formatted = events.map((event: Event) => ({
    ...event,
    isRsvpCurrentUser: true,
  }));
  return formatted;
};

export { prepEvents, prepRsvpEvents };
