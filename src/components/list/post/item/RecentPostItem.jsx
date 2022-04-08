import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar } from "../../../common";
import { useTranslationActions, useTimeFormat } from "../../../hooks";
import { PostBadge } from "../../../panels/post";
import { replaceChar } from "../../../../helpers/stringFormatter";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 2px solid #ebebeb;
  .post-badge {
    margin-left: auto;
  }
  .post-title {
    font-weight: 600;
    font-size: 1.1rem;
    cursor: pointer;
  }
  .post-date-comments {
    display: flex;
  }
`;

const RecentPostItem = (props) => {
  const { post, workspace, closeModal } = props;
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const { fromNow } = useTimeFormat();
  const { _t } = useTranslationActions();
  const dictionary = {
    replyRequired: _t("POST.REPLY_REQUIRED", "Reply required"),
    mustRead: _t("POST.MUST_READ", "Must read"),
    noReplies: _t("POST.NO_REPLIES", "No replies"),
    private: _t("POST.PRIVATE", "Private"),
    archived: _t("POST.ARCHIVED", "Archived"),
    draft: _t("POST.DRAFT", "Draft"),
    repliesClosed: _t("POST.REPLIES_CLOSED", "Replies closed"),
    noComment: _t("POST.NO_COMMENT", "no comment"),
    oneComment: _t("POST.ONE_COMMENT", "1 comment"),
    comments: _t("POST.NUMBER_COMMENTS", "::comment_count:: comments"),
  };
  const handleRedirectToPost = () => {
    if (workspace.folder_id) {
      history.push(`/workspace/posts/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}/post/${post.id}/${replaceChar(post.title)}`);
    } else {
      history.push(`/workspace/posts/${workspace.id}/${replaceChar(workspace.name)}/post/${post.id}/${replaceChar(post.title)}`);
    }
    closeModal();
  };
  return (
    <Wrapper>
      <Avatar title={`FROM: ${post.author.name}`} className="author-avatar mr-2" id={post.author.id} name={post.author.name} imageLink={post.author.profile_image_link} />
      <div>
        <div className="post-title" onClick={handleRedirectToPost}>
          {post.title}
        </div>
        <div className="post-date-comments">
          <div className="text-muted mr-2">{post.reply_count === 0 ? dictionary.noComment : post.reply_count === 1 ? dictionary.oneComment : dictionary.comments.replace("::comment_count::", post.reply_count)}</div>
          <span className="time-stamp text-muted">
            <span>{fromNow(post.created_at.timestamp)}</span>
          </span>
        </div>
      </div>
      <PostBadge post={post} dictionary={dictionary} user={user} />
    </Wrapper>
  );
};

export default RecentPostItem;
