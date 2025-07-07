import { BASE_URL } from "./service";
import { fetchData } from "./service";
import type { Event, EventFilters } from "./interfaces";
import { prepEvents, prepRsvpEvents } from "./prepEvents";

const getAllEvents = async (filters: EventFilters): Promise<Event[]> => {
  const urlParams = new URLSearchParams(Object.entries(filters));
  const path = `${BASE_URL}/events?${urlParams.toString()}`;
  const req = {
    method: "GET",
    credentials: "include",
  };
  let events = await fetchData(path, req);
  if (filters.filter === "rsvp") {
    events = prepRsvpEvents(events);
  } else {
    events = prepEvents(events);
  }
  return events;
};

const createEvent = async <T = any>(event: Event): Promise<T> => {
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

const eventRsvp = async <T = any>(eventId: number): Promise<T> => {
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

const deleteEventRsvp = async <T = any>(eventId: number): Promise<T> => {
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

export { getAllEvents, createEvent, eventRsvp, deleteEventRsvp };
