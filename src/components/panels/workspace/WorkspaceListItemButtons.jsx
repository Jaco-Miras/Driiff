import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  margin-left: auto;
`;

const Icon = styled(SvgIconFeather)`
  width: 1rem;
  height: 1rem;
  margin-right: 10px;
  :hover {
    color: #7a1b8b;
    cursor: pointer;
  }
`;

const StyledButton = styled.button`
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 500;
`;

const WorkspaceListItemButtons = (props) => {
  const { dictionary, isExternal, isMember, item } = props;
  return (
    <Wrapper className="workspace-list-buttons">
      {isMember && !isExternal && <Icon icon="pencil" />}
      {isMember && !isExternal && <Icon icon="star" />}
      {isMember && !isExternal && <Icon icon="trash" />}
      <StyledButton className={`btn ${isMember ? "btn-danger" : "btn-primary"}`}>{isMember ? dictionary.buttonLeave : dictionary.buttonJoin}</StyledButton>
    </Wrapper>
  );
};

export default WorkspaceListItemButtons;
