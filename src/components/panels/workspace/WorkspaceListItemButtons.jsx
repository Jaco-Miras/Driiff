import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  margin-left: 10px;
`;

const Icon = styled(SvgIconFeather)`
  width: 1rem;
  height: 1rem;
  margin-right: 10px;
  &.favorite {
    color: rgb(255, 193, 7);
    fill: rgb(255, 193, 7);
  }
  :hover {
    color: #7a1b8b;
    cursor: pointer;
    &.favorite {
      color: rgb(255, 193, 7);
      fill: rgb(255, 193, 7);
    }
  }
`;

const StyledButton = styled.button`
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 500;
`;

const WorkspaceListItemButtons = (props) => {
  const { actions, dictionary, isExternal, isMember, item } = props;
  const handleButtonClick = () => {
    if (isMember) {
      actions.leave(item);
    } else {
      actions.join(item);
    }
  };
  const handleEdit = () => actions.edit(item);
  const handleFavorite = () => actions.favourite(item);
  const handleArchive = () => actions.showArchiveConfirmation(item);
  const handleWorkspaceNotification = () => {
    actions.toggleWorkspaceNotification(item);
  };
  return (
    <Wrapper className="workspace-list-buttons">
      {isMember && !isExternal && <Icon icon="pencil" onClick={handleEdit} />}
      <Icon icon="star" className={`${item.topic.is_favourite && "favorite"}`} onClick={handleFavorite} />
      {isMember && <Icon icon="bell" onClick={handleWorkspaceNotification} />}
      {isMember && !isExternal && <Icon icon="trash" onClick={handleArchive} />}
      <StyledButton className={`btn ${isMember ? "btn-danger" : "btn-primary"}`} onClick={handleButtonClick}>
        {isMember ? dictionary.buttonLeave : dictionary.buttonJoin}
      </StyledButton>
    </Wrapper>
  );
};

export default WorkspaceListItemButtons;
