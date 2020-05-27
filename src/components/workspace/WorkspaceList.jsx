import React, {useState} from "react";
import styled from "styled-components";
import TopicList from "./TopicList";

const WorkspaceListWrapper = styled.li`
    cursor: pointer;
    > a {
        color: ${props => props.selected ? "#7a1b8b!important" : "#000"};
    }
`;

const WorkspaceList = props => {

    const {className = "", workspace} = props;

    const [showTopics, setShowTopics] = useState(true);

    const handleShowTopics = () => {
        setShowTopics(!showTopics)
    };

    return (
        <WorkspaceListWrapper selected={workspace.selected}>
            <a onClick={handleShowTopics}>{workspace.name}
                {  Object.keys(workspace.topics).length > 0 && <i className="sub-menu-arrow ti-angle-up rotate-in ti-minus"></i> }
            </a>
            {
                Object.keys(workspace.topics).length > 0 && showTopics &&
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

export default WorkspaceList