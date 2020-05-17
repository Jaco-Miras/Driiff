import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
`;

const WorkspaceChatPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row no-gutters chat-block">
                Workspace Chat
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspaceChatPanel);