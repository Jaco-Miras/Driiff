import React from "react";
import styled from "styled-components";
import { useTimeFormat } from "../../../hooks";

const Wrapper = styled.li`
  cursor: pointer;

  .done {
    text-decoration: line-through;
    color: #00c851;
  }
  .avatar {
    cursor: pointer;
  }
  .user-name {
    cursor: pointer;
  }
  .feather-message-circle {
    cursor: pointer;
  }
  .recent-post-timestamp {
    color: #8b8b8b;
    @media only screen and (max-width: 480px) {
      display: none !important;
    }
  }
`;

const RecentPostListItem = (props) => {
  const { className = "", post, onOpenPost } = props;

  const { localizeChatDate } = useTimeFormat();

  // const toggleCheck = (e) => {
  //   e.stopPropagation();
  //   if (disableOptions) return;
  //   postActions.markPost(post);
  // };

  const handleOpenPost = (e) => {
    onOpenPost(post);
  };

  return (
    <Wrapper className={`recent-post-list-item list-group-item d-flex align-items-center p-l-r-0 ${className}`} onClick={handleOpenPost}>
      <div className="flex-grow-1 min-width-0" onClick={handleOpenPost}>
        <div className="d-flex align-items-center justify-content-between">
          <div className={"app-list-title text-truncate"}>{post.title}</div>
          <div className={"pl-3 d-flex recent-post-timestamp align-items-center"}>{localizeChatDate(post.created_at.timestamp)}</div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(RecentPostListItem);
