import { Button } from "../ui/button";
const FriendViews = () => {
  return (
    <nav className="flex p-3">
      <Button className="grow-1" variant="outline">
        Following
      </Button>
      <Button className="grow-1" variant="outline">
        Followers
      </Button>
      <Button className="grow-1" variant="outline">
        Find Friends
      </Button>
    </nav>
  );
};

export default FriendViews;
