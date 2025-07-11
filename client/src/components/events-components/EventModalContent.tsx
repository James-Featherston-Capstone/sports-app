import type { DisplayEvent } from "@/utils/interfaces";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, type FormEvent } from "react";

interface EventModalContentType {
  event: DisplayEvent;
}

const EventModalContent = ({ event }: EventModalContentType) => {
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState<string[]>([]);
  const handleCommentSubmission = (event: FormEvent) => {
    event.preventDefault();
    setCommentList([...commentList, comment]);
    setComment("");
  };
  return (
    <div className="flex flex-col md:flex-row w-9/10 h-9/10 grow-1 overflow-auto bg-amber-600">
      <div className="grow-0 md:grow-1">
        <h4>{event.description}</h4>
        <h3>Sport: {event.sport}</h3>
        <div className="flex">
          <h3>Rsvps:</h3>
          {event.rsvps &&
            event.rsvps.slice(0, 10).map((rsvp, index) => (
              <h3 className="mx-1" key={index}>
                {rsvp.user?.username},
              </h3>
            ))}
          ...
        </div>
      </div>
      <div className="grow-1 mt-2 flex flex-col">
        <form className="flex" onSubmit={handleCommentSubmission}>
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            type="text"
            placeholder="Enter a comment"
            className=""
          />
          <Button type="submit">Comment</Button>
        </form>
        <div className="w-1/1 h-1/1">
          {commentList.map((comment) => {
            return <div>{comment}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default EventModalContent;
