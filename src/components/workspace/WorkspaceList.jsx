import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {addToChannels, getChannel, setSelectedChannel} from "../../redux/actions/chatActions";
import {addToModals} from "../../redux/actions/globalActions";
import {setActiveTopic} from "../../redux/actions/workspaceActions";
import {SvgIconFeather} from "../common";
import TopicList from "./TopicList";

const Wrapper = styled.li`
    cursor: pointer;
    
    > a {
        font-weight: bold;
        color: ${props => props.selected ? "#7a1b8b !important" : "#000"};
    }
    
    ul {
        li {
            &.nav-action {
                list-style-type: none !important;
                margin-left: 26px !important;
                color: #a7abc3 !important;
                font-size 12px !important;
                
                svg {
                    width: 16px;
                    height: 16px;
                }
            }
        }
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
                    getChannel({channel_id: workspace.topic_detail.channel.id}, (err, res) => {
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
        }
    };

    const handleShowTopics = () => {
        if (workspace.type === "FOLDER") {
            setShowTopics(!showTopics);
        } else {
            handleSelectWorkpace();
        }
    };

    const handleShowWorkspaceModal = () => {
        let payload = {
            type: "workspace_create_edit",
            mode: "create",
            item: workspace
        }

        dispatch(
            addToModals(payload)
        );
    }

    return (
        <Wrapper className={`worskpace-list ${className}`} selected={workspace.selected}>
            <a onClick={handleShowTopics}>{workspace.name}
                {
                    workspace.type === "FOLDER" &&
                    <i className={`sub-menu-arrow ti-angle-${showTopics ? "up" : "down"} rotate-in ti-minus`}></i>
                }
            </a>
            {
                workspace.type === "FOLDER" && showTopics &&
                <ul style={{display: "block"}}>
                    {
                        Object.keys(workspace.topics).length > 0 && Object.values(workspace.topics).map(topic => {
                            return <TopicList key={topic.id} topic={topic}/>;
                        })
                    }
                    <li className="nav-action" onClick={handleShowWorkspaceModal}>
                        <SvgIconFeather icon="plus"/> New workspace
                    </li>
                </ul>
            }
        </Wrapper>
    );
};

export default WorkspaceList;