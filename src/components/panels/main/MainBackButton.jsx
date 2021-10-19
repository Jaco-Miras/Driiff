import React from "react";
import styled from "styled-components";

import { SvgIconFeather } from "../../common";
import { useHistory } from "react-router-dom";

const BackWrapper = styled.span`
  cursor: pointer;
`;

const MainBackButton = (props) => {
  const history = useHistory();

  const handleBackClick = () => {
    history.goBack();
  };

  return (
    <BackWrapper>
      <SvgIconFeather icon="chevron-left" onClick={handleBackClick} />
    </BackWrapper>
  );
};

export default MainBackButton;
