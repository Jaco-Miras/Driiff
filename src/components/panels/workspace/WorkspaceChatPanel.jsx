import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { ChatContentPanel } from "../chat";

const Wrapper = styled.div``;

const WorkspaceChatPanel = (props) => {
  const { className = "" } = props;
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);

  return (
    <Wrapper className={`workspace-chat container-fluid ${className}`}>
      <div className="row no-gutters chat-block">
        <ChatContentPanel className={"col-lg-12"} selectedChannel={selectedChannel} />
      </div>
    </Wrapper>
  );
};

export default React.memo(WorkspaceChatPanel);
