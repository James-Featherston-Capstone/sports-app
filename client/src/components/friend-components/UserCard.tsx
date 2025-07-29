import { Button } from "../ui/button";
import { useState } from "react";
import type { Profile } from "@/utils/interfaces";
import { createFriendship, deleteFriendship } from "@/utils/friendService";
import UserAvatar from "../UserAvatar";
type UserCardType = {
  user: Profile;
  isFollowing: boolean;
  friendshipId?: number;
};
const UserCard = ({ user, isFollowing, friendshipId }: UserCardType) => {
  const [isUserFollowing, setIsUserFollowing] = useState<boolean>(isFollowing);
  const [currentFriendshipId, setCurrentFriendshipId] = useState<
    number | undefined
  >(friendshipId);
  const [isLoadingFollow, setIsLoadingFollow] = useState<boolean>(false);

  const handleFollow = async () => {
    setIsLoadingFollow(true);
    if (isUserFollowing && currentFriendshipId) {
      await deleteFriendship(currentFriendshipId);
      setIsUserFollowing(false);
      setCurrentFriendshipId(undefined);
    } else {
      const newFriendship = await createFriendship(user.id);
      setCurrentFriendshipId(newFriendship.id);
      setIsUserFollowing(true);
    }
    setIsLoadingFollow(false);
  };
  return (
    <div className="bg-white border-2 text-black my-2 mx-4 rounded-sm flex items-center">
      <UserAvatar user={user} diameter={8} />
      <h3 className="text-xl">{user.username}</h3>
      <div className="grow-1" />
      <Button
        variant={isUserFollowing ? "checked" : "default"}
        disabled={isLoadingFollow}
        onClick={handleFollow}
        size="sm"
        className="w-20"
      >
        {isUserFollowing ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
};

export default UserCard;
