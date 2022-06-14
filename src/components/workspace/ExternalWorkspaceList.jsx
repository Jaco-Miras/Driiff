import React, { useRef } from "react";
import { Badge } from "reactstrap";
import styled from "styled-components";
import { SvgIconFeather } from "../common";

const Wrapper = styled.li`
  ${(props) => !props.show && "display: none;"}
  cursor: pointer;
  cursor: hand;
  position: relative;
  transition: all 0.3s ease;
  background: ${(props) => (props.selected ? "#ffffff14" : "transparent")};
  border-radius: 8px;
  a.archived-folder {
    ${"" /* color: #bebebe !important; */}
  }
  > a {
    position: relative;
    font-weight: ${(props) => (props.selected ? "600" : "400")};

    div {
      position: relative;
      height: 40px;
      display: inline-flex;
      align-items: center;
      .badge {
        position: absolute;
        width: 6px;
        height: 6px;
        top: 7px;
        right: -12px;
        border-radius: 50%;
        background: #28a745;
        font-size: 0;
        overflow: hidden;
        transition: all 0.3s ease;
        opacity: 1;
        &.enter-active {
          transform: translate(0, 0);
        }

        &.leave-active {
          opacity: 0;
          transform: translate(0, 100%);
        }
      }
    }
  }

  ul {
    li {
      .badge {
        position: absolute;
        width: 6px;
        height: 6px;
        top: 7px;
        right: -12px;
        border-radius: 50%;
        background: #28a745;
        font-size: 0;
      }
    }
  }
  .nav-action {
    ${"" /* background-color: #fff3; */}
    background-color: #ffffff14;
    height: 40px;
    display: flex;
    align-items: center;
    color: #cbd4db;
    padding: 0 10px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    svg {
      margin-right: 4px;
      width: 13px;
      height: 13px;
    }
  }
`;

const Icon = styled(SvgIconFeather)`
  height: 12px !important;
  width: 12px !important;
  cursor: pointer;
  margin-left: 4px;
  color: #fff8;
`;

const ExternalWorkspaceList = (props) => {
  const { className = "", actions, show = true, workspace, activeTopic } = props;

  const ref = {
    container: useRef(null),
  };

  const handleSelectWorkspace = () => {
    //set the selected topic
    actions.redirectTo(workspace);
    if (activeTopic && activeTopic.id === workspace.id) return;
    actions.selectWorkspace(workspace);
    //history.push(`/hub/chat/${workspace.id}/${replaceChar(workspace.name)}`);
  };

  let unread_count = workspace.unread_chats + workspace.unread_posts + workspace.team_unread_chats;

  return (
    <Wrapper ref={ref.container} className={`workspace-list workspace-list-external fadeIn ${className}`} selected={activeTopic && activeTopic.id === workspace.id} show={show}>
      <a onClick={handleSelectWorkspace}>
        <div>
          {workspace.name}

          {workspace.is_lock !== 0 && <Icon icon="lock" strokeWidth="2" />}
          {workspace.is_active === 0 && <Icon icon="archive" />}
          {/* {workspace.is_shared && <Icon icon={"eye"} strokeWidth="3" />} */}

          {unread_count > 0 && <Badge color="danger">{unread_count}</Badge>}
        </div>
      </a>
    </Wrapper>
  );
};

export default ExternalWorkspaceList;
