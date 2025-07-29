import { useFriendContext } from "@/contexts/friendContext";
import UserCard from "./UserCard";

const SearchUsersList = () => {
  const { userSearchResults } = useFriendContext();
  if (userSearchResults.length === 0) {
    return <div>Search friends to see results.</div>;
  }
  return (
    <ul>
      {userSearchResults.map((user) => {
        return (
          <li key={user.id}>
            <UserCard user={user} isFollowing={false} />
          </li>
        );
      })}
    </ul>
  );
};

export default SearchUsersList;
