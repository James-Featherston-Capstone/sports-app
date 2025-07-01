import type { ProfileType } from "./interfaces";
import { BASE_URL } from "./service";
import { fetchData } from "./service";

const createProfile = async <T = any>(profile: ProfileType): Promise<T> => {
  const path = `${BASE_URL}/user`;
  const req = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
    credentials: "include",
  };
  return await fetchData(path, req);
};

export { createProfile };
