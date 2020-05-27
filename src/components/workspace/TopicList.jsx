import React from "react";
import styled from "styled-components";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {setActiveTopic} from "../../redux/actions/workspaceActions";

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
        
        if (topic.is_external === 1) {

        } else {
            if (topic.workspace_id !== undefined) {
                dispatch(setActiveTopic(topic));
                history.push(`/workspace/internal/${topic.workspace_name}/${topic.workspace_id}/${topic.name}/${topic.id}/dashboard`);
            } else {
                //direct workspace
                dispatch(setActiveTopic(topic));
                history.push(`/workspace/internal/${topic.name}/${topic.id}/dashboard`);
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