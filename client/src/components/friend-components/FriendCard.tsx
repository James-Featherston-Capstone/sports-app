import type { FriendshipDisplay, Profile } from "@/utils/interfaces";

type FriendCardType = {
  friend: FriendshipDisplay | Profile;
};
const FriendCard = ({ friend }: FriendCardType) => {
  return <div>{friend.id}</div>;
};

export default FriendCard;
