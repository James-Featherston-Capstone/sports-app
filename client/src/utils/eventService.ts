import { BASE_URL } from "./service";
import { fetchData } from "./service";
import type { Event, EventFilters } from "./interfaces";

const getAllEvents = async <T = any>(filters: EventFilters): Promise<T> => {
  console.log(filters);
  const urlParams = new URLSearchParams(JSON.stringify(filters));
  console.log(urlParams.toString());
  const path = `${BASE_URL}/events?${urlParams.toString()}`;
  console.log(path);
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

export { getAllEvents, createEvent };
