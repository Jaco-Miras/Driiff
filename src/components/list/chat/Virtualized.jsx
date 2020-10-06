import React, { useRef } from "react";
//import styled from "styled-components";
import { Virtuoso } from 'react-virtuoso';
import VirtualizedChat from "./VirtualizedChat";

const ScrollContainer = ({
    style,
    reportScrollTop,
    scrollTo,
    children,
  }) => {
    const elRef = useRef(null)
  
    const onScroll = (e) => {
        console.log(e.target)
    }
    return (
      <div
        ref={elRef}
        onScroll={onScroll}
        style={{
          ...style,
          border: '5px dashed gray',
          borderRadius: '4px',
        }}
        className={"chat-scroll-container"}
      >
        {children}
      </div>
    )
};

const Virtualized = (props) => {

    const {selectedChannel, loadReplies, virtuosoRef} = props;

    const messages = [...selectedChannel.replies.sort((a, b) => a.created_at.timestamp - b.created_at.timestamp)]

    return (
        <Virtuoso
            //ScrollContainer={ScrollContainer}
            style={{ width: '100%', height: '100%', overflowX: "hidden"}}
            totalCount={messages.length}
            ref={virtuosoRef}
            startReached={loadReplies}
            defaultItemHeight={46}
            item={index => 
                <VirtualizedChat
                    index={index} 
                    messages={messages}
                    reply={messages[index]} 
                    {...props}
                />}
        />
    )
};

export default React.memo(Virtualized);