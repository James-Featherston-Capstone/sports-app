import { BASE_URL } from "./service";
import { fetchData } from "./service";

const register = async (data) => {
  const path = `${BASE_URL}/auth/register`;
  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  return await fetchData(path, req);
};

const login = async (data) => {
  const path = `${BASE_URL}/auth/login`;
  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  return await fetchData(path, req);
};

const loginStatus = async (data) => {
  const path = `${BASE_URL}/auth/me`;
  const req = {
    method: "GET",
  };
  return await fetchData(path, req);
};

export { register, login, loginStatus };
