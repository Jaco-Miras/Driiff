import React from "react";
import styled from "styled-components";
import TopicList from "./TopicList";

const WorkspaceListWrapper = styled.li`
`

const WorkspaceList = props => {

    const {className = "", workspace} = props;

    const handleShowTopics = () => {

    }

    return (
        <WorkspaceListWrapper>
            <a onClick={handleShowTopics}>{workspace.name}
                {   workspace.topics.length > 0 && <i className="sub-menu-arrow ti-angle-up rotate-in ti-minus"></i> }
            </a>
            {
                workspace.topics.length > 0 &&
                <ul style={{display: "block"}}>
                    {
                    workspace.topics.map(topic => {
                        return <TopicList key={topic.id} topic={topic}/>
                    })
                    }
                </ul>
            }
        </WorkspaceListWrapper>
    )
}

export default WorkspaceList