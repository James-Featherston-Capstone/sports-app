import UserCard from "./UserCard";
import type { FriendshipDisplay } from "@/utils/interfaces";
import { motion } from "motion/react";

const FriendList = ({
  displayFriends,
}: {
  displayFriends: FriendshipDisplay[];
}) => {
  return (
    <ul>
      {displayFriends.map((friendship) => {
        return (
          <motion.li
            initial={{ transform: "translateY(100%)", opacity: 0 }}
            animate={{ transform: "translateY(0px)", opacity: 1 }}
            transition={{ type: "tween", duration: 1 }}
            key={friendship.id}
          >
            <UserCard
              user={friendship.friend}
              isFollowing={friendship.followingUser}
              friendshipId={friendship.id}
            />
          </motion.li>
        );
      })}
    </ul>
  );
};

export default FriendList;
