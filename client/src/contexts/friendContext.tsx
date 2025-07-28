import { createContext, useContext, useState, type ReactNode } from "react";
import { getFriends } from "@/utils/friendService";
import type {
  FriendshipDisplay,
  FriendshipListResponse,
} from "@/utils/interfaces";

interface FriendContextType {
  displayFriends: FriendshipDisplay[];
  areFriendsLoading: boolean;
  onMount: () => void;
}

const FriendContext = createContext<FriendContextType | undefined>(undefined);

const FriendProvider = ({ children }: { children: ReactNode }) => {
  const [friendshipList, setFriendshipList] = useState<
    FriendshipListResponse | undefined
  >(undefined);
  const [displayFriends, setDisplayFriends] = useState<FriendshipDisplay[]>([]);
  const [areFriendsLoading, setAreFriendsLoading] = useState<boolean>(true);

  const onMount = async () => {
    const friends = await getFriends();
    setFriendshipList(friends);
    setDisplayFriends(friends.friends);
    setAreFriendsLoading(false);
  };

  const addFriend = async () => {
    // Implement later
  };

  const removeFriend = async () => {
    // Implement later
  };

  const searchFriends = async () => {
    // Implement later
  };

  const changeView = () => {
    // Implement later
  };

  return (
    <FriendContext.Provider
      value={{ displayFriends, areFriendsLoading, onMount }}
    >
      {children}
    </FriendContext.Provider>
  );
};

const useFriendContext = () => {
  const context = useContext(FriendContext);
  if (!context) {
    throw new Error("Friend Context Failed");
  }
  return context;
};

export { useFriendContext, FriendProvider };
