import React from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";

const ChatJumpToDiv = styled.div`
  cursor: pointer;
  outline: none;
  padding: 10px;
  transition: all 0.3s ease;
  flex: ${isMobile ? "1 1 50%" : null};
  order: ${isMobile ? "3" : null};
  text-align: center;
  :hover {
    background-color: #7a1b8b;
  }
`;

const ChatJumpTo = (props) => {
  const handleJumpToButtonOnClick = () => {
    let scrollC = document.querySelector(".intersection-bottom-ref");
    if (scrollC) scrollC.scrollIntoView(false);
  };

  return (
    <ChatJumpToDiv className={"jump-to"} onClick={handleJumpToButtonOnClick}>
      Jump
    </ChatJumpToDiv>
  );
};

export default ChatJumpTo;
