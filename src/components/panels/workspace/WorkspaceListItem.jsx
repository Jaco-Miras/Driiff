import React from "react";
import styled from "styled-components";
import { SvgIconFeather, Avatar } from "../../common";
import { useIsMember } from "../../hooks";

const Wrapper = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  list-style: none;
  border-right: none;
  border-left: none;
  :hover {
    button {
      display: inline-flex;
    }
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
`;

const Icon = styled(SvgIconFeather)`
  width: 1rem;
  height: 1rem;
  margin-right: 3px;
`;

const WorkspaceListItem = (props) => {
  const { dictionary, item } = props;
  const { topic, workspace } = item;
  const isMember = useIsMember(item.members.map((m) => m.id));

  return (
    <Wrapper className="list-group-item">
      <div className="workspace-icon mr-3">
        <Avatar forceThumbnail={false} type={"TOPIC"} imageLink={null} id={topic.id} name={topic.name} noDefaultClick={true} showSlider={false} />
      </div>
      <div className="workspace-details">
        <div className="title-labels">
          <span className="workspace-title">{topic.name}</span>
          {topic.is_locked && <Icon icon="lock" />}
          {topic.is_shared && (
            <span className={"badge badge-warning ml-1 d-flex align-items-center"} style={{ backgroundColor: "#FFDB92" }}>
              <Icon icon="eye" /> {dictionary.withClient}
            </span>
          )}
        </div>
        <div className="labels">
          {isMember && (
            <span className="text-success">
              <Icon icon="check" />
              {dictionary.labelJoined}
            </span>
          )}
          <span>
            <Icon icon="user" />
            {item.members.length}
          </span>
          <span>
            <Icon icon="folder" />
            {workspace ? workspace.name : "Workspaces"}
          </span>
        </div>
      </div>
      <div className="workspace-buttons"></div>
    </Wrapper>
  );
};

export default WorkspaceListItem;
