import { Button } from "../ui/button";
import type { Profile } from "@/utils/interfaces";
import UserAvatar from "../UserAvatar";
import { useState } from "react";
type InviteCardType = {
  user: Profile;
};
const InviteCard = ({ user }: InviteCardType) => {
  const [invited, setInvited] = useState<boolean>(false);
  const [handlingInvite, setHandlingInvite] = useState<boolean>(false);

  const handleInvite = () => {
    setHandlingInvite(true);
    console.log("User invited");
    setInvited(!invited);
    setHandlingInvite(false);
  };
  return (
    <div className="bg-white border-2 text-black my-2 mx-4 rounded-sm flex items-center">
      <UserAvatar user={user} diameter={10} />
      <h3 className="text-md overflow-hidden whitespace-nowrap text-ellipsis m-1">
        {user.username}
      </h3>
      <div className="grow-1" />
      <Button
        size="sm"
        className="w-20"
        onClick={handleInvite}
        variant={invited ? "checked" : "default"}
        disabled={handlingInvite}
      >
        Invite
      </Button>
    </div>
  );
};

export default InviteCard;
