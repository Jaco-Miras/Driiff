import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
`;

const WorkspaceSettingsPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row no-gutters chat-block">
                Workspace Settings
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspaceSettingsPanel);