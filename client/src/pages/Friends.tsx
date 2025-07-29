import { useFriendContext } from "@/contexts/friendContext";
import FriendList from "@/components/friend-components/FriendList";
import { useEffect } from "react";
import FriendViews from "@/components/friend-components/FriendViews";
import SearchFriends from "@/components/friend-components/SearchFriends";
import SearchUsersList from "@/components/friend-components/SearchUsersList";
import LoadingCircleSpinner from "@/components/Spinner";

const Friends = () => {
  const { areFriendsLoading, onMount, viewType } = useFriendContext();

  useEffect(() => {
    onMount();
  }, []);

  return (
    <section className="w-screen grow-1 overflow-auto p-2">
      <FriendViews />
      <SearchFriends />
      {areFriendsLoading ? (
        <LoadingCircleSpinner />
      ) : viewType === "search" ? (
        <SearchUsersList />
      ) : (
        <FriendList />
      )}
    </section>
  );
};

export default Friends;
