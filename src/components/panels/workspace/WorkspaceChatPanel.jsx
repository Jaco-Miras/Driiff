import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { ChatContentPanel } from "../chat";

const Wrapper = styled.div``;

const Chatblock = styled.div`
  padding: 15px 15px 0 15px;
  @media (max-width: 991.99px) {
    padding: 15px;
  }
`;

const WorkspaceChatPanel = (props) => {
  const { className = "" } = props;
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);

  return (
    <Wrapper className={`workspace-chat container-fluid ${className}`}>
      <Chatblock className="row no-gutters chat-block">
        <ChatContentPanel className={"col-lg-12"} selectedChannel={selectedChannel} />
      </Chatblock>
    </Wrapper>
  );
};

export default React.memo(WorkspaceChatPanel);
