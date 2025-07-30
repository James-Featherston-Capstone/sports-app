import { useFriendContext } from "@/contexts/friendContext";
import UserCard from "./UserCard";
import { motion } from "motion/react";

const SearchUsersList = () => {
  const { userSearchResults } = useFriendContext();
  if (userSearchResults.length === 0) {
    return <div>Search friends to see results.</div>;
  }
  return (
    <ul>
      {userSearchResults.map((user) => {
        return (
          <motion.li
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            key={user.id}
          >
            <UserCard user={user} isFollowing={false} />
          </motion.li>
        );
      })}
    </ul>
  );
};

export default SearchUsersList;
