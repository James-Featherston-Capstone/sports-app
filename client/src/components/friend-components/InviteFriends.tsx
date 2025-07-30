import type { FriendshipDisplay } from "@/utils/interfaces";
import InviteCard from "./InviteEventCard";

const InviteFriends = ({
  friendList,
  eventId,
}: {
  friendList: FriendshipDisplay[];
  eventId: number;
}) => {
  return (
    <div className="h-1/1 overflow-y-auto">
      {friendList.map((friend) => {
        return (
          <InviteCard
            key={friend.friendId}
            user={friend.friend}
            eventId={eventId}
          />
        );
      })}
    </div>
  );
};

export default InviteFriends;
