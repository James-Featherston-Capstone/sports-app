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
              id={friendship.id}
              type="friendship"
              userId={friendship.friend.id}
              friendshipId={friendship.id}
              isFollowing={friendship.isFollowing}
              profile_image_url={friendship.friend.profile_image_url}
              username={friendship.friend.username}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default FriendList;
