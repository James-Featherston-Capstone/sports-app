import { useFriendContext } from "@/contexts/friendContext";
import FriendCard from "./FriendCard";

const SearchUsersList = () => {
  const { userSearchResults } = useFriendContext();

  return (
    <ul>
      {userSearchResults.map((user) => {
        return (
          <li key={user.id}>
            <FriendCard friend={user} />
          </li>
        );
      })}
    </ul>
  );
};

export default SearchUsersList;
