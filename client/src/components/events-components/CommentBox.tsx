import type { Comment } from "@/utils/interfaces";

interface CommentBoxProps {
  comment: Comment;
}

const CommentBox = ({ comment }: CommentBoxProps) => {
  return (
    <div className="w-1/1 bg-white rounded-sm py-1 px-3 my-1 border-2">
      <div>
        <p className="text-[10px]">{comment.author.username}</p>
        <p className="text-[12px]">{comment.comment}</p>
      </div>
    </div>
  );
};

export default CommentBox;
