import React from "react";
import styled from "styled-components";

const LoaderDiv = styled.div`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25em solid #7a1b8b;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  opacity: 0.8;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Loader = (props) => {
  const { className = "" } = props;

  return <LoaderDiv className={`loading ${className}`}></LoaderDiv>;
};

export default React.memo(Loader);
