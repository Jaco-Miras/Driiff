import React from "react";
import styled from "styled-components";
import WIPComment from "./WIPComment";

const Wrapper = styled.ul`
  width: 95%;
`;

const WIPSubComments = (props) => {
  const { className = "", comments, wip, commentActions, parentId, user, onShowFileDialog, dropAction, parentShowInput, workspace, isMember, dictionary, disableOptions, postActions } = props;

  return (
    comments.length > 0 && (
      <Wrapper className={`sub-comments ${className}`}>
        {Object.values(comments).map((c) => {
          return (
            <WIPComment key={c.id} type="sub" comment={c} wip={wip} dictionary={dictionary} />
            // <Comment
            //   key={c.id}
            //   comment={c}
            //   type="sub"
            //   post={post}
            //   user={user}
            //   parentShowInput={() => {
            //     parentShowInput(c.id);
            //   }}
            //   commentActions={commentActions}
            //   parentId={parentId}
            //   onShowFileDialog={onShowFileDialog}
            //   dropAction={dropAction}
            //   workspace={workspace}
            //   isMember={isMember}
            //   dictionary={dictionary}
            //   disableOptions={disableOptions}
            //   postActions={postActions}
            // />
          );
        })}
      </Wrapper>
    )
  );
};

export default React.memo(WIPSubComments);
