import React from "react";
import {useDispatch} from "react-redux";
import {useHistory, useRouteMatch} from "react-router-dom";
import {Badge} from "reactstrap";
import styled from "styled-components";
import {addToChannels, getChannel, setSelectedChannel} from "../../redux/actions/chatActions";
import {setActiveTopic} from "../../redux/actions/workspaceActions";
import {SvgIconFeather} from "../common";

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

    const dispatch = useDispatch();
    const history = useHistory();
    const route = useRouteMatch();

    const handleSelectTopic = () => {
        if (topic.selected) return;
        if (topic.is_external === 1) {

        } else {
            if (topic.workspace_id !== undefined) {
                dispatch(setActiveTopic(topic));

                if (topic.channel.channel_loaded === undefined) {
                    dispatch(
                        getChannel({channel_id: topic.channel.id}, (err, res) => {
                            if (err) return;
                            let channel = {
                                ...res.data,
                                hasMore: true,
                                skip: 0,
                                replies: [],
                                selected: true,
                            };
                            dispatch(addToChannels(channel));
                            dispatch(setSelectedChannel(channel));
                        }),
                    );
                }

                if (typeof topic.workspace_name === "undefined") {
                    history.push(`/workspace/${route.params.page}/${topic.id}/${topic.name}`);
                } else {
                    history.push(`/workspace/${route.params.page}/${topic.workspace_id}/${topic.workspace_name}/${topic.id}/${topic.name}`);
                }
            }
        }
    };

    const unread_count = topic.unread_chats + topic.unread_posts;

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

export default TopicList;