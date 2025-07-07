import { BASE_URL } from "./service";
import { fetchData } from "./service";
import type { EventFilters, EventWithRsvp, Event } from "./interfaces";

const getAllEvents = async (
  filters?: EventFilters
): Promise<EventWithRsvp[]> => {
  let urlParams = {};
  if (filters) {
    urlParams = new URLSearchParams(Object.entries(filters));
  }
  const path = `${BASE_URL}/events?${urlParams.toString()}`;
  const req = {
    method: "GET",
    credentials: "include",
  };
  const events = await fetchData(path, req);
  return events.map((event: EventWithRsvp) => ({
    ...event,
    isRsvpCurrentUser: event.rsvps !== null && event.rsvps?.length > 0,
  }));
};

const createEvent = async (
  event: Omit<Event, "id" | "rsvps">
): Promise<Event> => {
  const path = `${BASE_URL}/events`;
  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
    credentials: "include",
  };
  return await fetchData(path, req);
};

const editEvent = async <T = any>(event: Event): Promise<T> => {
  const path = `${BASE_URL}/events/${event.id}`;
  const req = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
    credentials: "include",
  };
  return await fetchData(path, req);
};

const eventRsvp = async (eventId: number): Promise<Event> => {
  const path = `${BASE_URL}/events/${eventId}/rsvp`;
  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  return await fetchData(path, req);
};

const deleteEventRsvp = async (eventId: number): Promise<Event> => {
  const path = `${BASE_URL}/events/${eventId}/rsvp`;
  const req = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  return await fetchData(path, req);
};

export { getAllEvents, createEvent, editEvent, eventRsvp, deleteEventRsvp };
