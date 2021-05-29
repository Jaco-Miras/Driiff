import React from "react";
import styled from "styled-components";

const EmptyState = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 5rem;

  svg {
    display: block;
    margin: 0 auto;
  }

  h3 {
    font-size: 16px;
  }
  h5 {
    margin-bottom: 0;
    font-size: 14px;
  }

  button {
    width: auto !important;
    margin: 2rem auto;
  }
`;

const ListEmptyState = (props) => {
  const { dictionary } = props;
  return (
    <EmptyState>
      <h3>{dictionary.noItemsFoundHeader}</h3>
      <h5>{dictionary.noItemsFoundText} </h5>
    </EmptyState>
  );
};

export default ListEmptyState;
