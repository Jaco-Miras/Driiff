import React from "react";
import styled from "styled-components";
import { SvgEmptyState } from "../../common";

const EmptyState = styled.div`
  padding: 8rem 0;
  max-width: 375px;
  margin: auto;
  text-align: center;

  svg {
    display: block;
  }
  button {
    width: auto !important;
    margin: 2rem auto;
  }
`;

const PostsEmptyState = (props) => {
  const { actions, dictionary, disableOptions, isMember } = props;
  const handleShowPostModal = () => {
    actions.showModal("create");
  };
  return (
    <div className="card card-body app-content-body mb-4">
      <EmptyState>
        <SvgEmptyState icon={3} height={252} />
        {isMember && (
          <button className="btn btn-outline-primary btn-block" onClick={handleShowPostModal} disabled={disableOptions}>
            {dictionary.createNewPost}
          </button>
        )}
      </EmptyState>
    </div>
  );
};

export default PostsEmptyState;
