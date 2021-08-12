import React from "react";
import styled from "styled-components";

const Wrapper = styled.div``;

const InputFeedback = (props) => {
  const { className = "", valid, children } = props;

  return <Wrapper className={`input-feedback ${valid ? "valid" : "invalid"}-feedback ${className}`}>{children}</Wrapper>;
};

export default InputFeedback;
