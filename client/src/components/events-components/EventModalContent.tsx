import type { DisplayEvent, Comment } from "@/utils/interfaces";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, type FormEvent } from "react";
import { createComment } from "@/utils/eventService";
import CommentBox from "./CommentBox";

interface EventModalContentType {
  event: DisplayEvent;
}

const EventModalContent = ({ event }: EventModalContentType) => {
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState<Comment[]>(event.comments);
  const handleCommentSubmission = async (e: FormEvent) => {
    e.preventDefault();
    const createdComment = await createComment(event.id, comment);
    setCommentList([createdComment, ...commentList]);
    setComment("");
  };
  return (
    <div className="flex flex-col md:flex-row w-9/10 h-9/10 grow-1 overflow-auto">
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
        <div className="w-1/1 h-1/1 flex flex-col">
          {commentList.map((commentInstance) => {
            return (
              <CommentBox key={commentInstance.id} comment={commentInstance} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventModalContent;
