import React from "react";
import styled from "styled-components";
import { Avatar } from "../../common";
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
  .labels span {
    display: flex;
    align-items: center;
    margin-right: 10px;
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

const WorkspaceListItem = (props) => {
  const { dictionary, item } = props;
  const isMember = useIsMember(item.members.map((m) => m.id));
  const user = useSelector((state) => state.session.user);
  const isExternal = user.type === "external";
  return (
    <Wrapper className="list-group-item">
      <div className="workspace-icon mr-3">
        <Avatar forceThumbnail={false} type={"TOPIC"} imageLink={null} id={item.topic.id} name={item.topic.name} noDefaultClick={true} showSlider={false} />
      </div>
      <WorkspaceListItemDetails dictionary={dictionary} isExternal={isExternal} isMember={isMember} item={item} />
      <WorkspaceListItemButtons dictionary={dictionary} isExternal={isExternal} isMember={isMember} item={item} />
    </Wrapper>
  );
};

export default WorkspaceListItem;
