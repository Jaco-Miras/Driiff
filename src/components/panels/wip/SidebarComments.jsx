import React, { useRef } from "react";
import styled from "styled-components";
import { useWIPFileComments } from "../../hooks";
import SidebarComment from "./SidebarComment";

const Wrapper = styled.div`
  &.card-body {
    padding: 15px;
    overflow-y: auto;
    overflow-x: hidden;
    .file-comment-body {
      border-radius: 6px;
      padding: 0.5rem;
      background: #f0f0f0;
      display: inline-block;
    }
  }
  .file-comments-thread {
    width: 100%;
  }
  .avatar.avatar-sm {
    height: 2rem;
    width: 2rem;
  }
  .file-comment {
    position: relative;
  }
`;

const SidebarComments = (props) => {
  const { annotations, isClosed } = props;

  const scrollRef = useRef();
  const { comments } = useWIPFileComments(scrollRef);
  return (
    <Wrapper className="card-body d-flex" ref={scrollRef}>
      <div className="file-comments-thread">
        {comments.length > 0 &&
          comments.map((c) => {
            const annotation = annotations.find((a) => a.comment_id === c.id && a.annotation !== null);
            return <SidebarComment key={c.id} comment={c} annotation={annotation} isClosed={isClosed} />;
          })}
      </div>
    </Wrapper>
  );
};

export default SidebarComments;
