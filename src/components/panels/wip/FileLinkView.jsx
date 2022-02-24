import React from "react";
import styled from "styled-components";
import { SvgEmptyState } from "../../common";

const Wrapper = styled.div`
  background: #f1f2f7;
`;
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

const FileLinkView = (props) => {
  const { file } = props;
  const handleOpenLink = () => {};
  return (
    <Wrapper className="card card-body app-content-body mb-4">
      <EmptyState>
        <SvgEmptyState icon={3} height={252} />

        <button className="btn btn-outline-primary btn-block" onClick={handleOpenLink}>
          Open link
        </button>
      </EmptyState>
    </Wrapper>
  );
};

export default FileLinkView;
