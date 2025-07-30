import type { FriendshipDisplay } from "@/utils/interfaces";

const InviteFriends = ({ friendList }: { friendList: FriendshipDisplay[] }) => {
  return (
    <div>
      {friendList.map((friend) => {
        return <div>{friend.friend.username}</div>;
      })}
    </div>
  );
};

export default InviteFriends;
