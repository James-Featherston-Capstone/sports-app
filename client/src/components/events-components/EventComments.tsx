import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CommentBox from "./CommentBox";
import type { FormEvent } from "react";
import { useState } from "react";
import { createComment } from "@/utils/eventService";
import type { Comment } from "@/utils/interfaces";

interface EventCommentsProps {
  eventId: number;
  setCommentList: (comments: Comment[]) => void;
  commentList: Comment[];
}

const EventComments = ({
  eventId,
  commentList,
  setCommentList,
}: EventCommentsProps) => {
  const [comment, setComment] = useState("");
  const handleCommentSubmission = async (e: FormEvent) => {
    e.preventDefault();
    const createdComment = await createComment(eventId, comment);
    setCommentList([createdComment, ...commentList]);
    setComment("");
  };

  return (
    <>
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
      {commentList.length === 0 && (
        <h1 className="bg-white w-1/1 rounded-lg text-center p-1 my-2">
          Be the first to comment
        </h1>
      )}
      <div className="w-1/1 h-1/1 flex flex-col">
        {commentList.map((commentInstance) => {
          return (
            <CommentBox key={commentInstance.id} comment={commentInstance} />
          );
        })}
      </div>
    </>
  );
};

export default EventComments;
