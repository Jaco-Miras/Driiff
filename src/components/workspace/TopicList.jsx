import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Badge } from "reactstrap";
import styled from "styled-components";
import { SvgIconFeather } from "../common";
import { replaceChar } from "../../helpers/stringFormatter";
import { setChannelHistoricalPosition } from "../../redux/actions/chatActions";

const TopicListWrapper = styled.li`
  cursor: pointer;
  background: ${(props) => (props.selected ? "#fff3" : "#ffffff14")};
  height: 40px;
  width: 100%;
  padding: 0 10px;
  font-weight: ${(props) => (props.selected ? "600" : "400")};
  color: ${(props) => (props.selected ? "#ffffffEB" : "#cbd4db")};
  a {
    position: relative !important;
    height: 40px !important;
    display: inline-flex !important;
    align-items: center !important;
    padding: 0 !important;
    svg {
      margin-left: 6px;
    }
  }
  @media (max-width: 620px) {
    color: #ffffff;
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 12px !important;
`;

const TopicList = (props) => {
  const { className = "", actions, onResetFocus, onShowTopics, selected, showTopics, topic, triggerFocus } = props;

  const dispatch = useDispatch();
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const channels = useSelector((state) => state.chat.channels);
  const workspaceRef = useRef();
  const history = useHistory();
  const route = useRouteMatch();
  const { params } = route;
  const onWorkspace = route.url.startsWith("/workspace");
  const { virtualization } = useSelector((state) => state.settings.user.CHAT_SETTINGS);

  const handleSelectTopic = () => {
    document.body.classList.remove("navigation-show");

    if (selectedChannel && !virtualization) {
      const scrollComponent = document.getElementById("component-chat-thread");
      if (scrollComponent) {
        //console.log(scrollComponent.scrollHeight - scrollComponent.scrollTop, "save this scroll");
        dispatch(
          setChannelHistoricalPosition({
            channel_id: selectedChannel.id,
            scrollPosition: scrollComponent.scrollHeight - scrollComponent.scrollTop,
          })
        );
      }
    }
    if (selected && onWorkspace) return;
    if (selectedChannel && selectedChannel.id !== topic.channel.id && channels[topic.channel.id]) {
      actions.selectChannel(channels[topic.channel.id]);
    }
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

  let unread_count = topic.unread_chats + topic.unread_posts + topic.team_unread_chats;
  let ws_type = topic.sharedSlug ? "shared-workspace" : "workspace";
  return (
    <TopicListWrapper ref={workspaceRef} className={`topic-list ${className}`} onClick={handleSelectTopic} selected={selected && onWorkspace && params.page !== "search"}>
      <div className={"topic-text-container"}>
        <a href={topic.folder_id ? `/${ws_type}/chat/${topic.folder_id}/${replaceChar(topic.folder_name)}/${topic.id}/${replaceChar(topic.name)}` : `/${ws_type}/${topic.id}/${replaceChar(topic.name)}`} onClick={(e) => e.preventDefault(e)}>
          <span className={"topic-text"}>{topic.name}</span>
          {topic.is_lock === 1 && <Icon icon={"lock"} strokeWidth="2" />}
          {topic.is_shared && <Icon icon={"eye"} strokeWidth="3" />}
          {unread_count > 0 && <Badge color="danger">{unread_count}</Badge>}
        </a>
      </div>
    </TopicListWrapper>
  );
};

export default TopicList;
