import { BASE_URL } from "./service";
import { fetchData } from "./service";
import type { Event } from "./interfaces";

const getAllEvents = async <T = any>(filters: object): Promise<T> => {
  const urlParams = new URLSearchParams(Object.entries(filters));
  const path = `${BASE_URL}/events?${urlParams.toString()}`;
  const req = {
    method: "GET",
    credentials: "include",
  };
  return await fetchData(path, req);
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

export { getAllEvents, createEvent, editEvent };
