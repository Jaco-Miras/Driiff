import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import TopicList from "./TopicList";
import {setActiveTopic} from "../../redux/actions/workspaceActions";
import {getChannel, setSelectedChannel, addToChannels} from "../../redux/actions/chatActions";

const WorkspaceListWrapper = styled.li`
    cursor: pointer;
    > a {
        color: ${props => props.selected ? "#7a1b8b!important" : "#000"};
    }
`;

const WorkspaceList = props => {

    const {className = "", workspace} = props;

    const dispatch = useDispatch();
    let history = useHistory();

    const [showTopics, setShowTopics] = useState(true);

    const handleSelectWorkpace = () => {
        //set the selected topic
        if (workspace.selected) return;
        if (workspace.is_external === 1) {

        } else {
            dispatch(setActiveTopic(workspace));
            history.push(`/workspace/internal/${workspace.name}/${workspace.id}/dashboard`);
            if (workspace.channel_loaded === undefined) {
                dispatch(
                    getChannel({channel_id: workspace.topic_detail.channel.id}, (err,res) => {
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
        }
    }

    const handleShowTopics = () => {
        if (workspace.type === "FOLDER") {
            setShowTopics(!showTopics)
        } else {
            handleSelectWorkpace();
        }
    };

    return (
        <WorkspaceListWrapper selected={workspace.selected}>
            <a onClick={handleShowTopics}>{workspace.name}
                {  workspace.type === "FOLDER" && <i className="sub-menu-arrow ti-angle-up rotate-in ti-minus"></i> }
            </a>
            {
                workspace.type === "FOLDER" && showTopics &&
                <ul style={{display: "block"}}>
                    {
                    Object.keys(workspace.topics).length > 0 && Object.values(workspace.topics).map(topic => {
                        return <TopicList key={topic.id} topic={topic}/>
                    })
                    }
                </ul>
            }
        </WorkspaceListWrapper>
    )
}

export default WorkspaceList;