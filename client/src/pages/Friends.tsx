import { useFriendContext } from "@/contexts/friendContext";
import FriendList from "@/components/friend-components/FriendList";
import { useEffect } from "react";
import FriendViews from "@/components/friend-components/FriendViews";

const Friends = () => {
  const { areFriendsLoading, onMount } = useFriendContext();

  useEffect(() => {
    onMount();
  }, []);

  return (
    <section className="w-screen grow-1 overflow-auto p-2">
      <FriendViews />
      {areFriendsLoading ? <h1>Loading...</h1> : <FriendList />}
    </section>
  );
};

export default Friends;
