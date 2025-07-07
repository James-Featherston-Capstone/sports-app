import { BASE_URL } from "./service";
import { fetchData } from "./service";
import type { Profile } from "./interfaces";

const getUserProfile = async (): Promise<Profile> => {
  const path = `${BASE_URL}/users`;
  const req = {
    method: "GET",
    credentials: "include",
  };
  return await fetchData(path, req);
};

export { getUserProfile };
