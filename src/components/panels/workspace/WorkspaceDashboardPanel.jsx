import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {useSetWorkspace} from "../../hooks";

const Wrapper = styled.div`
`;

const WorkspaceDashboardPanel = (props) => {

    const {className = ""} = props;

    useSetWorkspace();

    const history = useHistory();
    const activeTopicSettings = useSelector(state => state.settings.user.ACTIVE_TOPIC);
    const topic = useSelector(state => state.workspaces.activeTopic);

    useEffect(() => {
        if (topic === null && activeTopicSettings !== null) {
            if (activeTopicSettings.workspace === null) {
                history.push(`/workspace/dashboard/${activeTopicSettings.topic.id}/${activeTopicSettings.topic.name}`);
            } else {
                history.push(`/workspace/dashboard/${activeTopicSettings.workspace.id}/${activeTopicSettings.workspace.name}/${activeTopicSettings.topic.id}/${activeTopicSettings.topic.name}`);
            }
        }

    }, [activeTopicSettings, topic]);

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row no-gutters chat-block">
                {topic !== null ? `${topic.name}` : "Workspace Dashboard"}
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspaceDashboardPanel);