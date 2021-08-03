import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { groupObjByProp } from "../../../../helpers/arrayHelper";
import EmojiReaction from "./EmojiReaction";
import MoreEmojiLists from "./MoreEmojiLists";

const ChatReactionsContainer = styled.div`
  // position: absolute;
  //bottom: -20px;
  margin-top: -8px;
  display: inline-flex;
  max-width: 90%;
  z-index: 1;
  flex-flow: ${(props) => (props.isAuthor ? "row-reverse" : "row")};
  align-self: ${(props) => (props.isAuthor ? "flex-end" : "flex-start")};
  .profile-slider {
    left: 60px !important;
    right: unset !important;
    bottom: 0px !important;
    top: unset !important;
  }
  .chat-right & {
    .profile-slider {
      left: unset !important;
      right: 0 !important;
      bottom: 100% !important;
      top: unset !important;
    }
  }
`;

const MoreEmojis = styled.div`
  background: #dedede;
  padding: 2px 5px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  margin: 0 2px;
  position: relative;
  cursor: pointer;
  // :hover {
  //     .chat-reactions-list {
  //         visibility: visible;
  //     }
  // }
`;

const StyledMoreEmojiLists = styled(MoreEmojiLists)`
  position: absolute;
  background: #dedede;
  border-radius: 8px;
  max-width: 100px;
  min-width: 60px;
  padding: 5px;
  top: 100%;
  right: ${(props) => (props.isAuthor ? "0" : "unset")};
  left: ${(props) => (props.isAuthor ? "unset" : "0")};
  margin-top: 5px;
  //visibility: hidden;
`;

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const ChatReactions = (props) => {
  const { reactions, isAuthor, chatReactionAction, reply } = props;
  const prevReactionsCount = usePrevious(reactions.length);
  const [showMoreEmojis, setShowMoreEmojis] = useState(false);

  const handleShowMoreEmojis = () => setShowMoreEmojis(!showMoreEmojis);

  const groupReactions = () => {
    return Object.entries(groupObjByProp(reactions, "react_type")).map((entries) => {
      return {
        type: entries[0],
        reactions: entries[1],
      };
    });
  };

  const [groupedReactions, setGroupedReactions] = useState(groupReactions());

  useEffect(() => {
    setGroupedReactions(groupReactions());
  }, []);

  useEffect(() => {
    const groupReactions = () => {
      return Object.entries(groupObjByProp(reactions, "react_type")).map((entries) => {
        return {
          type: entries[0],
          reactions: entries[1],
        };
      });
    };

    if (prevReactionsCount !== reactions.length) {
      setGroupedReactions(groupReactions());
    }
  }, [reactions, prevReactionsCount]);

  return (
    <ChatReactionsContainer isAuthor={isAuthor}>
      {groupedReactions.slice(0, 7).map((r) => {
        return <EmojiReaction userReacted={false} key={r.type} type={r.type} count={r.reactions.length} reactions={r.reactions} isAuthor={isAuthor} chatReactionAction={chatReactionAction} reply={reply} />;
      })}
      {groupedReactions.length > 7 && (
        <MoreEmojis>
          <span onClick={handleShowMoreEmojis}>...</span>
          {showMoreEmojis && (
            <StyledMoreEmojiLists isAuthor={isAuthor} reactions={groupedReactions.slice(7)} className={"chat-reactions-list"} handleShowMoreEmojis={handleShowMoreEmojis} chatReactionAction={chatReactionAction} reply={reply} />
          )}
        </MoreEmojis>
      )}
    </ChatReactionsContainer>
  );
};

export default React.memo(ChatReactions);
