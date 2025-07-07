import type { Profile } from "./interfaces";
import { BASE_URL } from "./service";
import { fetchData } from "./service";

const createProfile = async (profile: Profile): Promise<Profile> => {
  const path = `${BASE_URL}/users`;
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
