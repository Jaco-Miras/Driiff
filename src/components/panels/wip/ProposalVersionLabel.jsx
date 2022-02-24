import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  //position: absolute;
  right: 42px;
  top: 10px;
  display: inline-block;
  -webkit-box-align: center;
  align-items: center;
  border-radius: 6px;
  padding: 2px 5px;
  background-color: hsl(0, 0%, 90%);
  font-size: 11px;
`;

const ProposalVersionLabel = (props) => {
  return <Wrapper className="mr-2">Version 1</Wrapper>;
};

export default ProposalVersionLabel;
