import React, { useEffect, useRef } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Badge } from "reactstrap";
import styled from "styled-components";
import { SvgIconFeather } from "../common";
//import {replaceChar} from "../../helpers/stringFormatter";

const TopicListWrapper = styled.li`
  cursor: pointer;
  background: ${(props) => (props.selected ? "#fff3" : "#ffffff14")};
  height: 40px;
  width: 100%;
  padding: 0 10px;
  font-weight: ${(props) => (props.selected ? "600" : "400")};
  color: ${(props) => (props.selected ? "#ffffffEB" : "#cbd4db")};
  div {
    position: relative;
    height: 40px;
    display: inline-flex;
    align-items: center;
    svg {
      margin-left: 6px;
    }
  }
  @media (max-width: 620px) {
    color: #ffffff;
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 12px;
`;

const TopicList = (props) => {
  const { className = "", actions, onResetFocus, onShowTopics, selected, showTopics, topic, triggerFocus } = props;

  const workspaceRef = useRef();
  const history = useHistory();
  const route = useRouteMatch();
  const onWorkspace = route.url.startsWith("/workspace");

  const handleSelectTopic = () => {
    document.body.classList.remove("navigation-show");

    if (selected && onWorkspace) return;

    actions.selectWorkspace(topic);
    actions.redirectTo(topic);
  };

  useEffect(() => {
    if (typeof history.location.state === "object") {
      if (history.location.state && history.location.state.workspace_id === topic.id) {
        onShowTopics(topic.id);
        history.push(history.location.pathname, null);
      }
    }
  }, [history.location.state]);

  useEffect(() => {
    if (triggerFocus && triggerFocus === topic.id && workspaceRef.current && showTopics) {
      setTimeout(() => {
        workspaceRef.current.scrollIntoView(true);
      }, 1000);
      onResetFocus();
    }
  }, [workspaceRef, showTopics, triggerFocus, topic]);

  let unread_count = topic.unread_chats + topic.unread_posts;

  return (
    <TopicListWrapper ref={workspaceRef} className={`topic-list ${className}`} onClick={handleSelectTopic} selected={selected}>
      <div>
        {topic.name}
        {topic.is_lock === 1 && <Icon icon={"lock"} strokeWidth="2" />}
        {topic.is_shared === 1 && <Icon icon={"share"} strokeWidth="3" />}
        {unread_count > 0 && <Badge color="danger">{unread_count}</Badge>}
      </div>
    </TopicListWrapper>
  );
};

export default TopicList;
