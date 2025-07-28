import { useState } from "react";
import { Button } from "../ui/button";
import { useFriendContext } from "@/contexts/friendContext";
const FriendViews = () => {
  const { changeView, areFriendsLoading } = useFriendContext();
  const [viewType, setViewType] = useState<string>("friends");

  const onViewChange = (newViewType: string) => {
    changeView(newViewType);
    setViewType(newViewType);
  };
  return (
    <nav className="flex p-3">
      <Button
        onClick={() => onViewChange("friends")}
        className="grow-1"
        variant={viewType === "friends" ? "outlineChecked" : "outline"}
        disabled={areFriendsLoading}
      >
        Following
      </Button>
      <Button
        onClick={() => onViewChange("friendsOf")}
        className="grow-1"
        variant={viewType === "friendsOf" ? "outlineChecked" : "outline"}
        disabled={areFriendsLoading}
      >
        Followers
      </Button>
      <Button
        onClick={() => onViewChange("search")}
        className="grow-1"
        variant={viewType === "search" ? "outlineChecked" : "outline"}
        disabled={areFriendsLoading}
      >
        Find Friends
      </Button>
    </nav>
  );
};

export default FriendViews;
