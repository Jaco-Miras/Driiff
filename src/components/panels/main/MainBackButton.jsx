import React from "react";
import styled from "styled-components";

import { SvgIconFeather } from "../../common";
import { useHistory } from "react-router-dom";

const BackWrapper = styled.span`
  cursor: pointer;
  svg {
    color: #8b8b8b;
    width: 20px;
    height: 20px;
    :hover {
      color: #7a1b8b;
    }
  }
`;

const MainBackButton = (props) => {
  const history = useHistory();

  const handleBackClick = () => {
    history.goBack();
  };

  return (
    <BackWrapper className="mr-1">
      <SvgIconFeather icon="chevron-left" onClick={handleBackClick} />
    </BackWrapper>
  );
};

export default MainBackButton;
