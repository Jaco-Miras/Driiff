import React from "react";
import styled from "styled-components";

const TopicListWrapper = styled.li`
`

const TopicList = props => {

    const {className = "", topic} = props;

    const handleSelectTopic = () => {
        
    }
    
    return (
        <TopicListWrapper onClick={handleSelectTopic}>
            {topic.name}
        </TopicListWrapper>
    )
}

export default TopicList