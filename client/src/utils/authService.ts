import { BASE_URL } from "./service";
import { fetchData } from "./service";
import type { Profile } from "./interfaces";

const register = async <T = any>(
  data: Profile,
  password: string
): Promise<T> => {
  const path = `${BASE_URL}/auth/register`;
  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, password: password }),
    credentials: "include",
  };
  return await fetchData(path, req);
};

const login = async <T = any>(data: Object): Promise<T> => {
  const path = `${BASE_URL}/auth/login`;
  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  };
  return await fetchData(path, req);
};

const loginStatus = async () => {
  const path = `${BASE_URL}/auth/me`;
  const req = {
    method: "GET",
    credentials: "include",
  };
  return await fetchData(path, req);
};

export { register, login, loginStatus };
