import React, { useRef, useEffect } from "react";
//import styled from "styled-components";
import { Virtuoso } from 'react-virtuoso';
import VirtualizedChat from "./VirtualizedChat";
import { usePreviousValue } from "../../hooks";
import { setChannelRange } from "../../../redux/actions/chatActions";
import { useDispatch, useSelector } from "react-redux";

// const ScrollContainer = ({
//     style,
//     reportScrollTop,
//     scrollTo,
//     children,
//   }) => {
//     const elRef = useRef(null)
  
//     const onScroll = (e) => {
//         //console.log(e.target.scrollHeight, e.target.scrollTop)
//     }
//     return (
//       <div
//         ref={elRef}
//         onScroll={e => {
//           reportScrollTop(e.target.scrollTop)
//           onScroll(e)
//           }
//         }
//         style={{
//           ...style,
//           //border: '2px dashed gray',
//           borderRadius: '4px',
//           overflowX: "hidden"
//         }}
//         className={"chat-scroll-container"}
//       >
//         {children}
//       </div>
//     )
// };

const Virtualized = (props) => {

    const {loadReplies, virtuosoRef, messages, selectedChannel} = props;
    const channelRange = useSelector((state) => state.chat.channelRange)
    const previousChannel = usePreviousValue(selectedChannel);
    const dispatch = useDispatch();
    useEffect(() => {
      console.log('trigger restore on mount', channelRange, selectedChannel.id)
      if (channelRange.hasOwnProperty(selectedChannel.id)) {
        virtuosoRef.current.scrollToIndex({index: channelRange[selectedChannel.id].startIndex, align: "start"})
      }
    }, [])

    const handleRangeChange = (range) => {
      console.log(range, selectedChannel.id)
      dispatch(
        setChannelRange({id: selectedChannel.id, range: range})
      );
    }
    
    useEffect(() => {
      if (virtuosoRef) {
        if (previousChannel && selectedChannel.id === previousChannel.id) {
          if (previousChannel && previousChannel.replies.length !== selectedChannel.replies.length && (selectedChannel.replies.length - previousChannel.replies.length) > 1) {
            console.log('trigger restore after loading more', channelRange)
            if (channelRange.hasOwnProperty(selectedChannel.id)) {
              virtuosoRef.current.scrollToIndex({index: channelRange[selectedChannel.id].startIndex + (selectedChannel.replies.length - previousChannel.replies.length), align: "start"})
            }
          }
        } else {
          console.log('trigger restore after changing channel', channelRange, selectedChannel.id)
          if (channelRange.hasOwnProperty(selectedChannel.id)) {
            virtuosoRef.current.scrollToIndex({index: channelRange[selectedChannel.id].startIndex, align: "start"})
          }
        }
      }
    }, [selectedChannel, previousChannel]);
    console.log(channelRange)
    return (
        <Virtuoso
            //ScrollContainer={ScrollContainer}
            style={{ width: '100%', height: '100%', overflowX: "hidden"}}
            totalCount={messages.length}
            ref={virtuosoRef}
            startReached={loadReplies}
            defaultItemHeight={46}
            computeItemKey={index => messages[index].id}
            overscan={10}
            rangeChanged={handleRangeChange}
            followOutput={true}
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