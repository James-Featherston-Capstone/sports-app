import { BASE_URL } from "./service";
import { fetchData } from "./service";

const getUserProfile = async <T = any>(): Promise<T> => {
  const path = `${BASE_URL}/users`;
  const req = {
    method: "GET",
    credentials: "include",
  };
  return await fetchData(path, req);
};

export { getUserProfile };
