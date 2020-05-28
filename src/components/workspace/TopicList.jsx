import React from "react";
import styled from "styled-components";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {setActiveTopic} from "../../redux/actions/workspaceActions";
import {getChannel, setSelectedChannel, addToChannels} from "../../redux/actions/chatActions";

const TopicListWrapper = styled.li`
    cursor: pointer;
    color: ${props => props.selected ? "#7a1b8b" : "#000"};
`;

const TopicList = props => {

    const {className = "", topic} = props;

    const dispatch = useDispatch();
    let history = useHistory();

    const handleSelectTopic = () => {
        //set the selected topic
        if (topic.selected) return;
        if (topic.is_external === 1) {

        } else {
            if (topic.workspace_id !== undefined) {
                dispatch(setActiveTopic(topic));
                if (topic.channel.channel_loaded === undefined) {
                    dispatch(
                        getChannel({channel_id: topic.channel.id}, (err,res) => {
                            if (err) return;
                            let channel = {
                                ...res.data,
                                hasMore: true,
                                skip: 0,
                                replies: [],
                                selected: true,
                            }
                            dispatch(addToChannels(channel));
                            dispatch(setSelectedChannel(channel));
                        })
                    );
                }
                history.push(`/workspace/internal/${topic.workspace_name}/${topic.workspace_id}/${topic.name}/${topic.id}/dashboard`);
            }
        }
    }
    
    return (
        <TopicListWrapper onClick={handleSelectTopic} selected={topic.selected}>
            {topic.name}
        </TopicListWrapper>
    )
}

export default TopicList