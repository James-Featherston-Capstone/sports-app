import UserCard from "./UserCard";
import { useFriendContext } from "@/contexts/friendContext";

const FriendList = () => {
  const { displayFriends } = useFriendContext();
  return (
    <ul>
      {displayFriends.map((friendship) => {
        return (
          <li key={friendship.id}>
            <UserCard
              user={friendship.friend}
              isFollowing={friendship.followingUser}
              friendshipId={friendship.id}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default FriendList;
