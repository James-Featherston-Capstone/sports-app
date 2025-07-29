import { useFriendContext } from "@/contexts/friendContext";
import UserCard from "./UserCard";

const SearchUsersList = () => {
  const { userSearchResults } = useFriendContext();

  return (
    <ul>
      {userSearchResults.map((user) => {
        return (
          <li key={user.id}>
            <UserCard
              id={user.id}
              type="user"
              userId={user.id}
              isFollowing={false}
              profile_image_url={user.profile_image_url}
              username={user.username}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default SearchUsersList;
