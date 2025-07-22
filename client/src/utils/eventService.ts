import { BASE_URL } from "./service";
import { fetchData } from "./service";
import type {
  EventFilters,
  DisplayEvent,
  EventModel,
  Comment,
  ParkPreference,
  ClickEvent,
  ParkRecommendation,
} from "./interfaces";

const getAllEvents = async (
  filters?: EventFilters
): Promise<DisplayEvent[]> => {
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
  return events.map((event: DisplayEvent) => ({
    ...event,
    isRsvpCurrentUser: event.rsvps !== null && event.rsvps?.length > 0,
  }));
};

const getEvent = async (eventId: number): Promise<DisplayEvent> => {
  const path = `${BASE_URL}/events/${eventId}`;
  const req = {
    method: "GET",
    credentials: "include",
  };
  const events = await fetchData(path, req);
  return events;
};

const createEvent = async (
  event: Omit<EventModel, "id" | "rsvps">
): Promise<DisplayEvent> => {
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

const editEvent = async (event: EventModel): Promise<EventModel> => {
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

const eventRsvp = async (eventId: number): Promise<EventModel> => {
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

const deleteEventRsvp = async (eventId: number): Promise<EventModel> => {
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

const createComment = async (
  eventId: number,
  comment: string
): Promise<Comment> => {
  const path = `${BASE_URL}/events/${eventId}/comments`;
  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment }),
    credentials: "include",
  };
  return await fetchData(path, req);
};

const getAllEventPreferences = async (
  eventId: number
): Promise<ParkPreference[]> => {
  const path = `${BASE_URL}/events/${eventId}/preferences`;
  const req = {
    method: "GET",
    credentials: "include",
  };
  return await fetchData(path, req);
};

const createEventPreference = async (
  eventId: number,
  location: string
): Promise<ParkPreference> => {
  const path = `${BASE_URL}/events/${eventId}/preferences`;
  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ location }),
    credentials: "include",
  };
  return await fetchData(path, req);
};

const upvotePreference = async (
  preferenceId: number
): Promise<ParkPreference> => {
  const path = `${BASE_URL}/events/preferences/${preferenceId}`;
  const req = {
    method: "PUT",
    credentials: "include",
  };
  return await fetchData(path, req);
};

const clickEvent = async (
  eventId: number,
  distance: number | undefined
): Promise<ClickEvent> => {
  const path = `${BASE_URL}/events/${eventId}/event-click`;
  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ eventDistance: distance }),
    credentials: "include",
  };
  return await fetchData(path, req);
};

const getEventLocationRecommendations = (
  eventId: number
): Promise<ParkRecommendation[]> => {
  const path = `${BASE_URL}/events/${eventId}/meeting-points`;
  const req = {
    method: "GET",
    credentials: "include",
  };
  return fetchData(path, req);
};

export {
  getAllEvents,
  getEvent,
  createEvent,
  editEvent,
  eventRsvp,
  deleteEventRsvp,
  createComment,
  getAllEventPreferences,
  createEventPreference,
  upvotePreference,
  clickEvent,
  getEventLocationRecommendations,
};
