import React from "react";
import { MoreOptions } from "../common";

const WIPCommentOptions = (props) => {
  const { commentActions, onMentionUser, onQuote, dictionary, scrollRef, comment, user } = props;
  const handleEditComment = () => {
    commentActions.editComment(comment);
  };
  const handleRemoveComment = () => {
    commentActions.removeComment(comment);
  };
  const handleImportantComment = () => {
    commentActions.important(comment);
  };
  return (
    <MoreOptions scrollRef={scrollRef} moreButton={"more-horizontal"}>
      {/* {comment.todo_reminder === null && <div onClick={() => commentActions.remind(comment, post)}>{dictionary.remindMeAboutThis}</div>} */}
      {user.id === comment.author.id && <div onClick={handleEditComment}>{dictionary.editReply}</div>}
      <div onClick={onQuote}>{dictionary.quote}</div>
      {user.id !== comment.author.id && <div onClick={onMentionUser}>{dictionary.mentionUser}</div>}
      {user.id === comment.author.id && <div onClick={handleRemoveComment}>{dictionary.removeReply}</div>}
      {user.id === comment.author.id && <div onClick={handleImportantComment}>{comment.is_important ? dictionary.unMarkImportant : dictionary.markImportant}</div>}
    </MoreOptions>
  );
};

export default WIPCommentOptions;
