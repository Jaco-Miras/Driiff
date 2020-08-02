import React from "react";
import {useHistory, useRouteMatch} from "react-router-dom";
import {Badge} from "reactstrap";
import styled from "styled-components";
import {SvgIconFeather} from "../common";
import {replaceChar} from "../../helpers/stringFormatter";

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
  margin-right: 10px;
  width: 10px;
`;

const TopicList = (props) => {
  const { className = "", actions, selected, topic } = props;

  const history = useHistory();
  const route = useRouteMatch();
  const onWorkspace = route.url.startsWith("/workspace");

  const handleSelectTopic = () => {
    document.body.classList.remove("navigation-show");


    if (selected && onWorkspace)
      return;

    actions.selectWorkspace(topic);
    actions.redirectTo(topic);
  };

  let unread_count = topic.unread_chats + topic.unread_posts;

  return (
      <TopicListWrapper className={`topic-list ${className}`} onClick={handleSelectTopic}
                        selected={selected && onWorkspace}>
        <div>
          {topic.name}
          {topic.private === 1 && <Icon icon={"lock"}/>}
          {unread_count > 0 && <Badge color="danger">{unread_count}</Badge>}
        </div>
      </TopicListWrapper>
  );
};

export default TopicList;
