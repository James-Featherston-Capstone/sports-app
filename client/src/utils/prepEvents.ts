import type { Event } from "./interfaces";
const prepEvents = (events: Event[]): Event[] => {
  const formatted = events.map((event: Event) => ({
    ...event,
    isRsvpCurrentUser: event.rsvps !== undefined && event.rsvps?.length > 0,
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
