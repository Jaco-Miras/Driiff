import React from "react";
import styled from "styled-components";

const Wrapper = styled.div``;

const Blank = (props) => {
  const { className = "" } = props;

  return <Wrapper className={`${className}`}></Wrapper>;
};

export default React.memo(Blank);
