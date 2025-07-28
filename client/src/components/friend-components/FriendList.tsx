import FriendCard from "./FriendCard";
import { useFriendContext } from "@/contexts/friendContext";

const FriendList = () => {
  const { displayFriends } = useFriendContext();
  return (
    <ul>
      {displayFriends.map((friend) => {
        return (
          <li key={friend.id}>
            <FriendCard friend={friend} />
          </li>
        );
      })}
    </ul>
  );
};

export default FriendList;
