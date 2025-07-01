import { BASE_URL } from "./service";
import { fetchData } from "./service";
import type { ProfileType } from "./interfaces";

const register = async <T = any>(
  data: ProfileType,
  password: string
): Promise<T> => {
  const path = `${BASE_URL}/auth/register`;
  console.log({ ...data, password: password });
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

const checkStatus = async () => {
  const status = await loginStatus();
  if (status) {
    return true;
  }
  return false;
};

export { register, login, loginStatus, checkStatus };
