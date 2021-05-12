import React from "react";
import styled from "styled-components";
import { SvgEmptyState } from "../../../common";

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

const CompanyPostsEmptyState = (props) => {
  const { actions, dictionary } = props;
  const handleShowPostModal = () => {
    actions.showModal("create_company");
  };
  return (
    <div className="card card-body app-content-body">
      <EmptyState>
        <SvgEmptyState icon={3} height={252} />
        <button className="btn btn-outline-primary btn-block" onClick={handleShowPostModal}>
          {dictionary.createNewPost}
        </button>
      </EmptyState>
    </div>
  );
};

export default CompanyPostsEmptyState;
