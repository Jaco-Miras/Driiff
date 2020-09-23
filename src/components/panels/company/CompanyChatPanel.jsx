import React from "react";
import styled from "styled-components";
import { useUserChannels, useLoadChannel } from "../../hooks";
import { ChatContentPanel, ChatSidebarPanel } from "../chat";

const Wrapper = styled.div`
  .chat-sidebar-panel {
    max-width: 540px;
  }
  .chat-content-panel {
    padding-right: 1.5rem;
    flex-grow: 1;
    @media (min-width: 1920px) {
      max-width: calc(100% - 540px);
    }
  }
  @media (max-width: 1450px) {
    .chat-sidebar-panel {
      flex: 0 0 40%;
      max-width: 40%;
    }
    .chat-content-panel {
      flex: 0 0 60%;
      max-width: 60%;
    }
  }
  @media (max-width: 1280px) {
    .chat-sidebar-panel {
      flex: 0 0 45%;
      max-width: 45%;
    }
    .chat-content-panel {
      flex: 0 0 55%;
      max-width: 55%;
    }
  }
  @media (max-width: 991.99px) {
    .chat-sidebar-panel {
      flex: unset;
      max-width: 100%;
      padding: 0 !important;
    }
    .chat-content-panel {
      padding: 0;
      flex: auto;
      max-width: 100%;
    }
  }
`;

const CompanyChatPanel = (props) => {
  const { className = "" } = props;

  const { channels, userChannels, selectedChannel } = useUserChannels();

  useLoadChannel();

  return (
    <Wrapper className={`company-chat ${className}`}>
      <div className="row no-gutters chat-block">
        <ChatSidebarPanel className={"col-lg-4 chat-sidebar-panel"} channels={channels} userChannels={userChannels} selectedChannel={selectedChannel} />
        <ChatContentPanel className={"col-lg-8 chat-content-panel"} selectedChannel={selectedChannel} />
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyChatPanel);
