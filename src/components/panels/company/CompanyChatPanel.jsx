import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ChatContentPanel, ChatSidebarPanel } from "../chat";
import Snowfall from "react-snowfall";

const Wrapper = styled.div`
  .chat-sidebar-panel {
    //max-width: 540px;
  }
  .chat-content-panel {
    padding-right: 1.5rem;
    flex-grow: 1;
    flex: 1 1 auto;
    // @media (min-width: 1920px) {
    //   max-width: calc(100% - 540px);
    // }
  }
  @media (max-width: 1550px) {
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
      flex: 0 0 40%;
      max-width: 40%;
    }
    .chat-content-panel {
      flex: 0 0 60%;
      max-width: 60%;
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
  .row {
    flex-wrap: unset;
  }
`;

const CompanyChatPanel = (props) => {
  const { className = "" } = props;
  if (localStorage.getItem("chat_translate_change") !== null) {
    localStorage.removeItem("chat_translate_change");
    window.location.reload();
  }
  const [active, setActive] = useState(true);

  //christmas
  useEffect(() => {
    setTimeout(() => {
      setActive(false);
    }, 7000);
  });
  return (
    <Wrapper className={`company-chat ${className}`}>
      <div className="row no-gutters chat-block">
        <ChatSidebarPanel className={"col-lg-4 chat-sidebar-panel"} />
        <ChatContentPanel className={"col-lg-8 chat-content-panel"} />
        {active ? <Snowfall /> : ""}
      </div>
    </Wrapper>
  );
};

export default CompanyChatPanel;
