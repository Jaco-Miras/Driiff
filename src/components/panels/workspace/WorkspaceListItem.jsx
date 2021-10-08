import React from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../common";
import { useIsMember } from "../../hooks";
import { useSelector } from "react-redux";
import WorkspaceListItemDetails from "./WorkspaceListItemDetails";
import WorkspaceListItemButtons from "./WorkspaceListItemButtons";

const Wrapper = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  list-style: none;
  border-right: none;
  border-left: none;

  .workspace-icon {
    position: relative;
  }
  .workspace-list-buttons {
    display: none;
  }
  .workspace-title {
    font-size: 1rem;
  }
  .title-labels,
  .labels {
    display: flex;
  }
  .title-labels {
    align-items: center;
    .feather-lock {
      margin: 0 5px;
    }
    .feather-eye {
      width: 0.8rem;
      height: 0.8rem;
    }
  }
  :hover {
    button {
      display: inline-flex;
    }
    .workspace-list-buttons {
      display: block;
    }
  }
`;

const StarIcon = styled(SvgIconFeather)`
  position: absolute;
  z-index: 2;
  width: 1rem;
  height: 1rem;
  top: 0;
  right: 0;
  color: rgb(255, 193, 7);
  fill: rgb(255, 193, 7);
`;

const WorkspaceListItem = (props) => {
  const { actions, dictionary, item } = props;
  const workspaceMembers = item.members
    .map((m) => {
      if (m.member_ids) {
        return m.member_ids;
      } else return m.id;
    })
    .flat();

  const isMember = useIsMember([...new Set(workspaceMembers)]);
  const user = useSelector((state) => state.session.user);
  const isExternal = user.type === "external";
  const handleRedirect = (e, item) => {
    let payload = {
      id: item.topic.id,
      name: item.topic.name,
      folder_id: item.workspace ? item.workspace.id : null,
      folder_name: item.workspace ? item.workspace.name : null,
    };
    actions.toWorkspace(payload);
  };
  return (
    <Wrapper className="list-group-item">
      <div className="workspace-icon mr-3">
        {item.topic.is_favourite && <StarIcon icon="star" />}
        <Avatar forceThumbnail={false} type={"TOPIC"} imageLink={item.topic.icon_link} id={item.topic.id} name={item.topic.name} onClick={(e) => handleRedirect(e, item)} showSlider={false} />
      </div>
      <WorkspaceListItemDetails dictionary={dictionary} isExternal={isExternal} isMember={isMember} item={item} onRedirect={handleRedirect} />
      <WorkspaceListItemButtons actions={actions} dictionary={dictionary} isExternal={isExternal} isMember={isMember} item={item} />
    </Wrapper>
  );
};

export default WorkspaceListItem;
