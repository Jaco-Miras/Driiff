import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
`;

const WorkspacePostsPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row no-gutters chat-block">
                Workspace Posts
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspacePostsPanel);