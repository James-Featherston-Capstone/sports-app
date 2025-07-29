import type { Profile } from "@/utils/interfaces";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
const UserAvatar = ({
  user,
  diameter,
}: {
  user: Profile;
  diameter: number;
}) => {
  return (
    <Avatar className={`m-1 h-${diameter} w-${diameter}`}>
      <AvatarImage src={user.profile_image_url} alt="Profile picture" />
      <AvatarFallback>
        {user.username.substring(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
