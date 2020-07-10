import React from "react";
import styled from "styled-components";
import ChatMessageItem from "../../list/chat/ChatMessageItemList";

const Wrapper = styled.div`
  overflow-y: hidden;
  outline: currentcolor none medium;
`;

const Blank = (props) => {
  const { className = "" } = props;

  return (
    <Wrapper className={`messages ${className}`} tabIndex="2">
      <ChatMessageItem reply={{ message: "Hi!", timestamp: Math.floor(Date.now() / 1000), author: false }} />

      <ChatMessageItem
        reply={{
          message:
            "Lorem ipsum dolor sit amet, consectetur\n" + "                    adipisicing elit.\n" + "                    Exercitationem fuga iure iusto libero, possimus quasi quis repellat sint tempora\n" + "                    ullam!",
          timestamp: Math.floor(Date.now() / 1000),
          author: true,
        }}
      />

      <ChatMessageItem
        reply={{
          message: "Hello! How are you today?",
          timestamp: Math.floor(Date.now() / 1000),
          author: false,
        }}
      />

      <div className="message-item me">
        <div className="message-item-content">Lorem ipsum dolor sit.</div>
        <span className="time small text-muted font-italic">02:30 PM</span>
      </div>
      <div className="message-item">
        <div className="message-item-content d-flex">
          <i className="ti-file mr-2 font-size-20 mt-2"></i>
          <div>
            <div>
              important_documents.pdf <i className="text-muted small">(50KB)</i>
            </div>
            <ul className="list-inline small">
              <li className="list-inline-item">
                <a href="/">Download</a>
              </li>
              <li className="list-inline-item">
                <a href="/">View</a>
              </li>
            </ul>
          </div>
        </div>
        <span className="small text-muted font-italic">02:30 PM</span>
      </div>
      <div className="message-item me">
        <div className="message-item-content">Lorem ipsum dolor sit.</div>
        <span className="time small text-muted font-italic">02:30 PM</span>
      </div>
      <div className="message-item">
        <div className="message-item-content">Lorem ipsum dolor sit.</div>
        <span className="time small text-muted font-italic">02:30 PM</span>
      </div>
      <div className="message-item me message-media">
        <img src="https://via.placeholder.com/600X600" alt="fpo-placeholder" />
        <span className="time small text-muted font-italic">02:30 PM</span>
      </div>
      <div className="message-item message-item-divider">
        <span>Today</span>
      </div>
      <div className="message-item">
        <div className="message-item-content">Lorem ipsum dolor sit.</div>
        <span className="time small text-muted font-italic">02:30 PM</span>
      </div>
    </Wrapper>
  );
};

export default React.memo(Blank);
