import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {useSetWorkspace} from "../../hooks";

const Wrapper = styled.div`
`;

const WorkspaceDashboardPanel = (props) => {

    const {className = ""} = props;

    useSetWorkspace();

    const topic = useSelector(state => state.workspaces.activeTopic);

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row no-gutters chat-block">
                {topic !== null ? `${topic.name}` : "Workspace Dashboard"}
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspaceDashboardPanel);