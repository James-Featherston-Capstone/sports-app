import { BASE_URL } from "./service";
import { fetchData } from "./service";
import type { Profile } from "./interfaces";

const register = async (data: Profile, password: string): Promise<Profile> => {
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

const checkEmailAndUsername = async (
  email: string,
  username: string
): Promise<{ emailInUse: boolean; usernameInUse: boolean }> => {
  const path = `${BASE_URL}/auth/register/email`;
  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username }),
    credentials: "include",
  };
  const res = await fetchData(path, req);
  return res;
};

const login = async (data: Object): Promise<Profile> => {
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

const logout = async (): Promise<Profile> => {
  const path = `${BASE_URL}/auth/logout`;
  const req = {
    method: "POST",
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

export { register, login, loginStatus, logout, checkEmailAndUsername };
