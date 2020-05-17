import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
`;

const WorkspaceDashboardPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row no-gutters chat-block">
                Workspace Dashboard
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspaceDashboardPanel);