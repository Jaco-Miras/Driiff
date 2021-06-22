import { Emoji } from "emoji-mart";
import React, { useRef } from "react";
import styled from "styled-components";
import { UserListPopUp } from "../../../common";
import { useOutsideClick } from "../../../hooks";

const MoreEmojiListsContainer = styled.div`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
    z-index: 100;
  }
  li {
    position: relative;
    padding: 3px;
    border-bottom: 1px solid;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    :hover {
      .chat-emoji-users-list {
        visibility: visible;
      }
    }
  }
  li:last-child {
    border: none;
  }
`;
const StyledUserListPopUp = styled(UserListPopUp)`
  position: absolute;
  bottom: 100%;
  max-width: 250px;
  left: ${(props) => (props.isAuthor ? "unset" : "116%")};
  right: ${(props) => (props.isAuthor ? "116%" : "unset")};
  top: 1px;
  visibility: hidden;
  ul {
    max-height: 250px;
    padding: 5px 10px;
  }
  .profile-slider {
    display: none !important;
  }
`;

const MoreEmojiLists = (props) => {
  const { className, reactions, handleShowMoreEmojis, isAuthor, reply, chatReactionAction } = props;
  const emojiListRef = useRef();
  useOutsideClick(emojiListRef, handleShowMoreEmojis, true);

  const handleToggleReact = (type) => {
    let payload = {
      message_id: reply.id,
      react_type: type,
    };
    chatReactionAction(payload, (err, res) => {
      //console.log(res, "chat reaction response");
    });
  };

  return (
    <MoreEmojiListsContainer className={className} ref={emojiListRef}>
      <ul>
        {reactions.map((r) => {
          return (
            <li key={r.type} onClick={() => handleToggleReact(r.type)}>
              <Emoji emoji={r.type} size={16} />
              <span>{r.reactions.length}</span>
              <StyledUserListPopUp
                className={"chat-emoji-users-list"}
                isAuthor={isAuthor}
                users={r.reactions.map((r) => {
                  return {
                    id: r.user_id,
                    name: r.user_name,
                    profile_image_link: r.profile_image_link,
                    profile_image_thumbnail_link: r.profile_image_thumbnail_link ? r.profile_image_thumbnail_link : r.profile_image_link,
                    partial_name: null,
                  };
                })}
              />
            </li>
          );
        })}
      </ul>
    </MoreEmojiListsContainer>
  );
};

export default MoreEmojiLists;
