import React from "react";
import styled from "styled-components";
import { Comment } from "../../list/post/item";

const Wrapper = styled.div`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-left: auto;
  }
  > ul {
    width: 100%;
  }
`;

const PostComments = (props) => {
  const { className = "", comments, post, user, commentActions, onShowFileDialog, dropAction, workspace, isMember, dictionary, disableOptions, postActions, userId } = props;

  return (
    <Wrapper className={`post-comments card-body ${className}`}>
      {comments && (
        <ul>
          {Object.values(comments).map((c) => {
            return (
              <Comment
                key={c.id}
                comment={c}
                post={post}
                user={user}
                commentActions={commentActions}
                onShowFileDialog={onShowFileDialog}
                dropAction={dropAction}
                workspace={workspace}
                isMember={isMember}
                dictionary={dictionary}
                disableOptions={disableOptions}
                postActions={postActions}
                userId={userId}
              />
            );
          })}
        </ul>
      )}
    </Wrapper>
  );
};

export default React.memo(PostComments);
