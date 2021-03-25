import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { ChatContentPanel } from "../chat";
import { useRouteMatch } from "react-router-dom";
import { SvgEmptyState } from "../../common";

const Wrapper = styled.div``;

const Chatblock = styled.div`
  padding: 24px 24px 0 24px;
  @media (max-width: 991.99px) {
    padding: 15px;
  }
`;
const EmptyState = styled.div`
  padding: 8rem 0;
  max-width: 375px;
  margin: auto;
  text-align: center;

  svg {
    display: block;
  }
  button {
    width: auto !important;
    margin: 2rem auto;
  }
`;

const WorkspaceChatPanel = (props) => {
  const { className = "", workspace } = props;
  const route = useRouteMatch();
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const [activating, setActivating] = useState(false);

  const handleActivateTeamChat = () => {
    if (!activating) {
      setActivating(true);
    }
  };

  return (
    <Wrapper className={`workspace-chat container-fluid ${className}`}>
      <Chatblock className="row no-gutters chat-block">
        {workspace && !workspace.team_channel.code && route.path.startsWith("/workspace/team-chat/") && (
          <EmptyState>
            <SvgEmptyState icon={3} height={252} />
            <button className="btn btn-outline-primary btn-block" disable={activating} onClick={handleActivateTeamChat}>
              {!activating ? "Activate chat" : "Activating..."}
            </button>
          </EmptyState>
        )}
        {(route.path.startsWith("/workspace/chat") || (workspace && workspace.team_channel.code)) && <ChatContentPanel className={"col-lg-12"} isWorkspace="true" selectedChannel={selectedChannel} />}
      </Chatblock>
    </Wrapper>
  );
};

export default React.memo(WorkspaceChatPanel);
