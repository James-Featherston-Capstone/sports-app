import type { FriendshipDisplay } from "@/utils/interfaces";

type FriendCardType = {
  friend: FriendshipDisplay;
};
const FriendCard = ({ friend }: FriendCardType) => {
  return <div>{friend.id}</div>;
};

export default FriendCard;
