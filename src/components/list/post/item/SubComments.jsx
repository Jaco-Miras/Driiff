import React from "react";
import styled from "styled-components";
import { Comment } from "./index";

const Wrapper = styled.ul`
  width: 95%;
`;

const SubComments = (props) => {
  const { className = "", comments, post, commentActions, parentId, user, onShowFileDialog, dropAction, 
          parentShowInput, workspace, isMember, dictionary, disableOptions } = props;

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
              workspace={workspace} isMember={isMember}
              dictionary={dictionary}
              disableOptions={disableOptions}
            />
          );
        })}
      </Wrapper>
    )
  );
};

export default React.memo(SubComments);
