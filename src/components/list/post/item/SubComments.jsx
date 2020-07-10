import React from "react";
import styled from "styled-components";
import { Comment } from "./index";

const Wrapper = styled.ul`
  width: 95%;
`;

const SubComments = (props) => {
  const { className = "", comments, post, commentActions, parentId, user, onShowFileDialog, dropAction, parentShowInput } = props;

  return (
    comments && (
      <Wrapper className={`sub-comments ${className}`}>
        {Object.values(comments).map((c) => {
          return (
            <Comment
              key={c.id}
              comment={c}
              type="sub"
              post={post}
              user={user}
              parentShowInput={() => {
                parentShowInput(c.id);
              }}
              commentActions={commentActions}
              parentId={parentId}
              onShowFileDialog={onShowFileDialog}
              dropAction={dropAction}
            />
          );
        })}
      </Wrapper>
    )
  );
};

export default React.memo(SubComments);
