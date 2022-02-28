import React from "react";
import styled from "styled-components";
import SidebarSubComment from "./SidebarSubComment";
import { useWIPFileSubComments } from "../../hooks";

const Wrapper = styled.div``;

const SidebarSubComments = (props) => {
  const { commentId, isClosed } = props;
  const { comments } = useWIPFileSubComments(commentId);
  if (comments.length === 0) return null;
  return (
    <Wrapper>
      {comments.map((c) => {
        return <SidebarSubComment key={c.id} comment={c} parentId={commentId} isClosed={isClosed} />;
      })}
    </Wrapper>
  );
};

export default SidebarSubComments;
