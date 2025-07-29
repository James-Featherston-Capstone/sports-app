import { BASE_URL } from "./service";
import { fetchData } from "./service";
import type {
  FriendshipListResponse,
  FriendshipDisplay,
  Profile,
} from "./interfaces";

const getFriends = async (): Promise<FriendshipListResponse> => {
  const path = `${BASE_URL}/friends`;
  const req = {
    method: "GET",
    credentials: "include",
  };
  return await fetchData(path, req);
};

const createFriendship = async (
  friendId: number
): Promise<FriendshipDisplay> => {
  const path = `${BASE_URL}/friends`;
  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ friendId }),
    credentials: "include",
  };
  return await fetchData(path, req);
};

const deleteFriendship = async (
  friendshipId: number
): Promise<FriendshipDisplay> => {
  const path = `${BASE_URL}/friends/${friendshipId}`;
  const req = {
    method: "DELETE",
    credentials: "include",
  };
  return await fetchData(path, req);
};

const fetchSearchFriends = async (query: string): Promise<Profile[]> => {
  const urlParams = new URLSearchParams({ query });
  const path = `${BASE_URL}/friends/search?${urlParams.toString()}`;
  const req = {
    method: "GET",
    credentials: "include",
  };
  return await fetchData(path, req);
};

export { getFriends, createFriendship, deleteFriendship, fetchSearchFriends };
