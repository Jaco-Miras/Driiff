import React from "react";
import styled from "styled-components";

const ChatUnreadMessageLineDiv = styled.div`
  &.hide {
    visibility: hidden;
    opacity: 0;
  }
`;
const ChatUnreadMessageLine = styled.div`
  .sepline {
    font-weight: 600;
    font-size: 0.85em;
    color: ${(props) => props.theme.colors.primary};
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 100%;
    margin: 10px auto 8px;
    &::before,
    &::after {
      content: "";
      position: absolute;
      background-color: ${(props) => props.theme.colors.primary};
      width: 100%;
      height: 1px;
      display: block;
      clear: both;

      @media only screen and (min-width: 1800px) {
        max-width: 44%;
      }

      @media only screen and (max-width: 1799px) {
        max-width: 42%;
      }

      @media only screen and (max-width: 1650px) {
        max-width: 40%;
      }

      @media only screen and (max-width: 1440px) {
        max-width: 38%;
      }

      @media only screen and (max-width: 1360px) {
        max-width: 36%;
      }

      @media only screen and (max-width: 1280px) {
        max-width: 40%;
      }

      @media only screen and (max-width: 1136px) {
        max-width: 32%;
      }

      @media only screen and (max-width: 1080px) {
        max-width: 30%;
      }

      @media only screen and (max-width: 1024px) {
        max-width: 26%;
      }

      @media only screen and (max-width: 1000px) {
        max-width: 24%;
      }

      @media only screen and (max-width: 996px) {
        max-width: 20%;
      }

      @media only screen and (max-width: 640px) {
        max-width: 45%;
      }
    }
    &::before {
      left: 0;
    }
    &::after {
      right: 0;
    }
  }
`;

const ChatUnreadLine = (props) => {
  return (
    <ChatUnreadMessageLineDiv className={"unread-message-sepline"}>
      {
        <ChatUnreadMessageLine>
          <span className="sepline">Unread Message/s</span>
        </ChatUnreadMessageLine>
      }
    </ChatUnreadMessageLineDiv>
  );
};
export default ChatUnreadLine;
