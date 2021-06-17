import React, { useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import styled from "styled-components";
import { useSelector } from "react-redux";
//import { groupBy } from "lodash";
import { useChatMessageActions, useCountUnreadReplies } from "../../hooks";
import { SvgEmptyState } from "../../common";
import VirtualiazedChat from "./VirtualizedChat";

const Wrapper = styled.div`
  background: transparent;
  background-repeat: repeat;
  //   height: calc(100% - 181px);
  //   overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  z-index: 1;
  > ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .chat-message-options svg {
    fill: currentColor;
  }
  &.is-processed {
    opacity: 0;
  }
  > div:first-child {
    width: 100%;
    overflow-x: hidden;
  }
`;

const EmptyState = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  svg {
    max-width: 100%;
    width: 100%;
    max-height: 40%;
    margin: auto;
  }
`;

const VirtuosoContainer = (props) => {
  const { dictionary } = props;
  const chatMessageActions = useChatMessageActions();
  //const unreadCount = useCountUnreadReplies();
  //const timeFormat = useTimeFormat();
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  // const groupedMessages = groupBy(
  //   selectedChannel.replies.map((r) => {
  //     if (r.hasOwnProperty("g_date")) {
  //       return r;
  //     } else {
  //       return {
  //         ...r,
  //         g_date: timeFormat.localizeDate(r.created_at.timestamp, "YYYY-MM-DD"),
  //       };
  //     }
  //   }),
  //   "g_date"
  // );

  const loadReplies = () => {
    if (!selectedChannel.isFetching && selectedChannel.hasMore) {
      chatMessageActions.channelActions.fetchingMessages(selectedChannel, true);
      let payload = {
        skip: 0,
        limit: 20,
      };

      if (typeof selectedChannel.replies !== "undefined") {
        payload = {
          skip: selectedChannel.skip === 0 && selectedChannel.replies.length ? selectedChannel.replies.length : selectedChannel.skip,
          limit: 20,
        };
      }
      chatMessageActions.fetch(selectedChannel, payload, (err, res) => {
        if (err) {
          chatMessageActions.channelActions.fetchingMessages(selectedChannel, false);
          return;
        }
      });
    }
  };

  useEffect(() => {
    loadReplies();
  }, [selectedChannel.id]);

  // const handleReadChannel = () => {
  //   if (unreadCount > 0 || selectedChannel.total_unread > 0) {
  //     const {
  //       selectedChannel,
  //       chatMessageActions: { channelActions },
  //     } = this.props;

  //     channelActions.markAsRead(selectedChannel);
  //   }
  // };

  return (
    <Wrapper id={"component-chat-thread"} className={"component-chat-thread messages"} tabIndex="2" data-init={1} data-channel-id={selectedChannel.id}>
      {selectedChannel.replies && selectedChannel.replies.length > 0 && (
        <Virtuoso
          totalCount={1000}
          firstItemIndex={1000 - selectedChannel.replies.length}
          initialTopMostItemIndex={selectedChannel.replies.length - 1}
          data={selectedChannel.replies}
          startReached={loadReplies}
          itemContent={(index, message) => {
            return <VirtualiazedChat index={index} reply={message} lastReply={selectedChannel.replies[selectedChannel.replies.length - 1]} dictionary={dictionary} />;
          }}
        />
        // <GroupedVirtuoso
        //   firstItemIndex={1}
        //   initialTopMostItemIndex={selectedChannel.replies.length - 1}
        //   startReached={loadReplies}
        //   groupCounts={Object.values(groupedMessages).map((m) => m.length)}
        //   groupContent={(index) => {
        //     return <div style={{ backgroundColor: "var(--ifm-background-color)" }}>Group {Object.keys(groupedMessages)[index]}</div>;
        //   }}
        //   itemContent={(index, groupIndex) => {
        //     return (
        //       <div>
        //         {index} {selectedChannel.replies[index] && selectedChannel.replies[index].body}
        //       </div>
        //     );
        //   }}
        // />
      )}
      {selectedChannel.replies && selectedChannel.replies.length === 0 && !selectedChannel.hasMore && (
        <EmptyState className="no-reply-container">
          <SvgEmptyState icon={3} />
        </EmptyState>
      )}
    </Wrapper>
  );
};

export default VirtuosoContainer;
