import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { setEditFileComment } from "../../../redux/actions/wipActions";

const Wrapper = styled.div`
  .text-muted {
    font-size: 0.7rem;
    cursor: pointer;
    :hover {
      color: ${(props) => props.theme.colors.primary} !important;
      text-decoration: underline;
    }
  }
  > div {
    margin-right: 0.5rem;
  }
`;
const FileCommentOptions = (props) => {
  const { comment, toggleCommentInput } = props;
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session.user);
  const isAuthor = user.id === comment.author.id;
  const handleEditComment = () => {
    dispatch(setEditFileComment(comment));
  };
  return (
    <Wrapper className="d-flex ml-1 file-comment-options">
      {isAuthor && (
        <div className="text-muted" onClick={handleEditComment}>
          Edit
        </div>
      )}
      <div className="text-muted" onClick={toggleCommentInput}>
        Comment
      </div>
    </Wrapper>
  );
};

export default FileCommentOptions;
