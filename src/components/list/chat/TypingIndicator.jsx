import React from "react";
import styled from "styled-components";
import { Avatar } from "../../common";
import { useIsUserTyping } from "../../hooks";

const TypingContainer = styled.div`
  display: inline-flex;
  align-items: center;
  width: 100%;
  position: absolute;
  top: -64px;
  opacity: ${(props) => (props.users ? "1" : 0)};
  z-index: 999;
  > div:nth-child(2) {
    margin-left: ${(props) => (props.users === 2 ? "-8px" : props.users > 2 ? "-8px" : "10")};
  }
  .avatar.avatar-sm {
    height: 26px !important;
    width: 26px !important;
    margin-top: 30px;
  }
`;
const TypingDiv = styled.div`
  margin-left: 16px !important;
`;
const PlusUsersDiv = styled.div`
  border-radius: 50%;
  min-width: 26px;
  min-height: 26px;
  width: 26px;
  height: 26px;
  background: #fff;
  color: #972c86;
  box-shadow: 0 2px 3px 0 rgba(26, 26, 26, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  z-index: -3;
  text-align: center;
`;
const TypingIndicator = (props) => {
  const { className = "" } = props;
  const [usersTyping, userNames] = useIsUserTyping();

  return (
    <TypingContainer users={usersTyping.length} className={`component-chat-indicator ${className}`}>
      {usersTyping.length > 2 ? <PlusUsersDiv>{`${usersTyping.length - 2}+`}</PlusUsersDiv> : null}
      {usersTyping.map((u, k) => {
        if (k <= 1) {
          return <Avatar className="xs" imageLink={u.profile_image_link} name={u.name ? u.name : u.email} id={u.id} noDefaultClick={true} />;
        } else return null;
      })}
      <TypingDiv className={"typing-indicator"}>
        <span></span>
        <span></span>
        <span></span>
      </TypingDiv>
    </TypingContainer>
  );
};
export default React.memo(TypingIndicator);
