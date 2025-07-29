import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
type UserCardType = {
  id: number;
  type: string;
  userId: number;
  friendshipId?: number;
  isFollowing: boolean;
  profile_image_url: string;
  username: string;
};
const UserCard = (friend: UserCardType) => {
  return (
    <div className="w-full bg-white border-2 text-black my-2 rounded-sm">
      <Avatar>
        <AvatarImage src={friend.profile_image_url} alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {friend.id}
      <Button></Button>
    </div>
  );
};

export default UserCard;
