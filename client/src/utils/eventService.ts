import { BASE_URL } from "./service";
import { fetchData } from "./service";

const getAllEvents = async <T = any>(): Promise<T> => {
  const path = `${BASE_URL}/events`;
  const req = {
    method: "GET",
    credentials: "include",
  };
  return await fetchData(path, req);
};

export { getAllEvents };
