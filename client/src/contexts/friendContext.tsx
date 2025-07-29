import { createContext, useContext, useState, type ReactNode } from "react";
import { fetchSearchFriends, getFriends } from "@/utils/friendService";
import type {
  FriendshipDisplay,
  FriendshipListResponse,
  Profile,
} from "@/utils/interfaces";

interface FriendContextType {
  displayFriends: FriendshipDisplay[];
  areFriendsLoading: boolean;
  onMount: () => void;
  searchFriends: (query: string) => void;
  changeView: (view: string) => void;
  userSearchResults: Profile[];
  viewType: string;
}

const FriendContext = createContext<FriendContextType | undefined>(undefined);

const FriendProvider = ({ children }: { children: ReactNode }) => {
  const [friendshipList, setFriendshipList] = useState<
    FriendshipListResponse | undefined
  >(undefined);
  const [displayFriends, setDisplayFriends] = useState<FriendshipDisplay[]>([]);
  const [userSearchResults, setUserSearchResults] = useState<Profile[]>([]);
  const [areFriendsLoading, setAreFriendsLoading] = useState<boolean>(true);
  const [viewType, setViewType] = useState<string>("friends");

  const onMount = async () => {
    const friends = await getFriends();
    setFriendshipList(friends);
    setDisplayFriends(friends.friends);
    setAreFriendsLoading(false);
  };

  const searchFriends = async (query: string) => {
    const lowerQuery = query.toLowerCase();
    if (viewType === "friends") {
      const filtered = friendshipList!.friends.filter((friend) => {
        const username = friend.friend.username.toLowerCase();
        return username.includes(lowerQuery);
      });
      setDisplayFriends(filtered);
    } else if (viewType === "friendsOf") {
      const filtered = friendshipList!.friendsOf.filter((friend) => {
        const username = friend.friend.username.toLowerCase();
        return username.includes(lowerQuery);
      });
      setDisplayFriends(filtered);
    } else if (viewType === "search") {
      const users = await fetchSearchFriends(query);
      setUserSearchResults(users);
    }
    setAreFriendsLoading(false);
  };

  const changeView = async (newView: string) => {
    setAreFriendsLoading(true);
    setViewType(newView);
    if (newView === "friends") {
      const friends = await getFriends();
      setFriendshipList(friends);
      setDisplayFriends(friends.friends);
    } else if (newView === "friendsOf") {
      const friends = await getFriends();
      setFriendshipList(friends);
      setDisplayFriends(friends.friendsOf);
    } else if (newView === "search") {
      setDisplayFriends([]);
    }
    setAreFriendsLoading(false);
  };

  return (
    <FriendContext.Provider
      value={{
        displayFriends,
        userSearchResults,
        areFriendsLoading,
        onMount,
        viewType,
        changeView,
        searchFriends,
      }}
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
