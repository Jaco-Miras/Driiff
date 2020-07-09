import React from "react";
import {useHistory, useRouteMatch} from "react-router-dom";
import {Badge} from "reactstrap";
import styled from "styled-components";
import {SvgIconFeather} from "../common";
import {replaceChar} from "../../helpers/stringFormatter";

const TopicListWrapper = styled.li`    
    cursor: pointer;
    color: ${props => props.selected ? "#7a1b8b !important" : "#000"}; 
`;

const Icon = styled(SvgIconFeather)`
    margin-right: 10px;
    width: 10px;        
`;

const TopicList = props => {

    const {className = "", topic} = props;

    const history = useHistory();
    const route = useRouteMatch();

    const handleSelectTopic = () => {
        if (topic.selected) return;
        if (topic.is_external === 1) {

        } else {
            if (topic.workspace_id !== undefined) {

                if (typeof topic.workspace_name === "undefined") {
                    history.push(`/workspace/${route.params.page}/${topic.id}/${replaceChar(topic.name)}`);
                } else {
                    history.push(`/workspace/${route.params.page}/${topic.workspace_id}/${replaceChar(topic.workspace_name)}/${topic.id}/${replaceChar(topic.name)}`);
                }
            } else {
                if (topic.selected)
                    return;

                history.push(`/workspace/chat/${topic.id}/${replaceChar(topic.name)}`);
            }
        }
    };

    if (typeof topic.unread_chats === "undefined")
        topic.unread_chats = 0;

    if (typeof topic.unread_posts === "undefined")
        topic.unread_posts = 0;

    if (typeof topic.unread_count === "undefined")
        topic.unread_count = 0;

    const unread_count = topic.unread_chats + topic.unread_posts + topic.unread_count;

    return (
        <TopicListWrapper
            className={`topic-list ${className}`} onClick={handleSelectTopic} selected={topic.selected}>
            <Icon icon={topic.private === 1 ? "lock" : "circle"}/>
            {topic.name}
            {
                unread_count > 0 &&
                <Badge color="danger">
                    {
                        unread_count
                    }
                </Badge>
            }
        </TopicListWrapper>
    );
};

export default React.memo(TopicList);