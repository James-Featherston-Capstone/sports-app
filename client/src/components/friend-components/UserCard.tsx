import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useState } from "react";
import type { Profile } from "@/utils/interfaces";
import { createFriendship, deleteFriendship } from "@/utils/friendService";
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
    <div className="w-full bg-white border-2 text-black my-2 rounded-sm">
      <Avatar>
        <AvatarImage src={user.profile_image_url} alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {user.id}
      <Button
        variant={isUserFollowing ? "checked" : "default"}
        disabled={isLoadingFollow}
        onClick={handleFollow}
      >
        {isUserFollowing ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
};

export default UserCard;
