import FriendCard from "./FriendCard";
import { useFriendContext } from "@/contexts/friendContext";

const FriendList = () => {
  const { displayFriends } = useFriendContext();
  return (
    <div>
      {displayFriends.map((friend) => {
        return (
          <div key={friend.id}>
            <FriendCard friend={friend} />
          </div>
        );
      })}
    </div>
  );
};

export default FriendList;
