import { Emoji } from "emoji-mart";
import React from "react";
import styled from "styled-components";
import { UserListPopUp } from "../../../common";
import useChatMessageActions from "../../../hooks/useChatMessageActions";

const EmojiContainer = styled.div`
  background: ${(props) => (props.isAuthor ? props.theme.colors.secondary : "rgba(240, 240, 240, 0.8)")};
  color: ${(props) => (props.isAuthor ? "#fff" : "#505050")};
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  margin: 0 2px;
  cursor: pointer;
  position: relative;
  .chat-emoji-users-list {
    position: absolute;
    bottom: 100%;
    max-width: 250px;
    left: ${(props) => (props.isAuthor ? "unset" : "5px")};
    right: ${(props) => (props.isAuthor ? "5px" : "unset")};
    visibility: hidden;
    ul {
      max-height: 250px;
    }
    .avatar-md {
      min-height: 2.7rem;
      min-width: 2.7rem;
    }
  }
  :hover {
    .chat-emoji-users-list {
      visibility: visible;
    }
  }
  @media (min-width: 768px) {
    margin-top: -1rem;
  }
`;

// const StyledUserListPopUp = styled(UserListPopUp)`
//   position: absolute;
//   bottom: 100%;
//   max-width: 250px;
//   left: ${(props) => (props.isAuthor ? "unset" : "5px")};
//   right: ${(props) => (props.isAuthor ? "5px" : "unset")};
//   visibility: hidden;
//   ul {
//     max-height: 250px;
//   }
// `;

const EmojiReaction = (props) => {
  const { type, count, reactions, isAuthor, reply } = props;

  const chatMessageAction = useChatMessageActions();

  const handleToggleReact = () => {
    chatMessageAction.react(reply.id, type);
  };

  return (
    <EmojiContainer onClick={handleToggleReact} isAuthor={isAuthor} className="chat-emoji">
      <Emoji emoji={type} size={20} />
      {count > 1 ? <span className={"emoji-counter"}> {count}</span> : null}
      <UserListPopUp
        className={"chat-emoji-users-list"}
        isAuthor={isAuthor}
        users={reactions.map((r) => {
          return {
            id: r.user_id,
            name: r.user_name,
            profile_image_link: r.profile_image_link,
            profile_image_thumbnail_link: r.profile_image_thumbnail_link ? r.profile_image_thumbnail_link : r.profile_image_link,
            partial_name: null,
          };
        })}
      />
    </EmojiContainer>
  );
};

export default React.memo(EmojiReaction);
