import React, {useRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import styled from "styled-components";
import crossIcon from "../../../assets/icon/close/l/active.svg";
import convoIcon from "../../../assets/icon/conversations/r/inactive.svg";
import pencilIcon from "../../../assets/icon/icon/edit/edit-secundary.svg";
import forwardIcon from "../../../assets/icon/Icons_notification/Reply/l/active.svg";
import reminderIcon from "../../../assets/icon/recent/r/secundary.svg";
import shareIcon from "../../../assets/icon/share/r/secundary.svg";
import moreIcon from "../../../assets/img/more-menu-icons/secundary.svg";
import {copyTextToClipboard} from "../../../helpers/commonFunctions";
import {getBaseUrl} from "../../../helpers/slugHelper";
// import {addChatBox, deleteChatMessageV2} from "../../../redux/actions";
import useOutsideClick from "../../hooks/useOutsideClick";
import {
    useTooltipHorizontalOrientation,
    useTooltipOrientation,
    useTooltipPosition,
} from "../../hooks/useTooltipOrientation";
import {setEditChatMessage} from '../../../redux/actions/chatActions';

const ChatMoreButtonDiv = styled.div`
  display: inline-flex;
  position: relative;
//   margin: 10px 5px;
`;
const MoreButton = styled.button`
  width: 16px;
  height: 16px;
  padding: 0;
  cursor: pointer;
  border: none;
  background: transparent;
  :before {
    content: "";
    mask-image: url(${moreIcon});
    background-color: ${props =>
    props.showMoreOptions ? "#972c86" : "#676767"};
    mask-repeat: no-repeat;
    mask-size: 100%;
    mask-position: center;
    width: 100%;
    height: 100%;
    display: inline-block;
  }
  :hover:before {
    background-color: #972c86;
  }
`;
const MoreTooltip = styled.div`
    z-index: 30;
    width: 230px;
    height: auto;
    display: inline-flex;
    flex-flow: column;
    background-color: #FAFAFA;
    color: #4d4d4d;
    border: 1px solid #FAFAFA;
    border-radius: 6px;
    position: absolute;
    bottom: 150%;
    //left: ${props => (props.isAuthor ? "-82px" : "-60px")};
    left: -108px;
    padding: 10px;
    cursor: pointer;
    box-shadow: 0 0 3px 0 rgba(26, 26, 26, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.1);    
    :before{
        content: "";
        position: absolute;
        top: 100%;
        //left: ${props => (props.isAuthor ? "51%" : "39%")};
        left: 50%;
        margin-left: -8px;
        border-width: 13px;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.1) transparent transparent transparent;
    }
    :after{
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        //left: ${props => (props.isAuthor ? "53%" : "41%")};
        margin-left: -5px;
        border-width: 10px;
        border-style: solid;
        border-color: #FAFAFA transparent transparent transparent;
    }
    @media only screen and (max-width: 575.99px) {
        top: -12px;
        position: relative;
        right: ${props => (props.isAuthor ? "auto" : "270px")};
        left: ${props => (props.isAuthor ? "0" : "auto")};
        :after {
            top: 11px;
            right: ${props => (props.isAuthor ? "auto" : "-23px")};
            left: ${props => (props.isAuthor ? "-23px" : "auto")};            
            transform: ${props => (props.isAuthor ? "rotate(90deg)" : "rotate(-90deg)")};        
        }
        :before {
            top: 8px;
            right: ${props => (props.isAuthor ? "auto" : "-28px")};
            left: ${props => (props.isAuthor ? "-28px" : "auto")};
            transform: ${props => (props.isAuthor ? "rotate(90deg)" : "rotate(-90deg)")};        
        }
    }
    button:hover{
        color: #972c86;
    }
    > div {
        display: inline-flex;
        align-items: center;
        padding: 10px 0;
        width: 100%;
        border-bottom: 1px solid #c3c3c3;
        :before {
            content: "";
            background-color: #4d4d4d;
            mask-repeat: no-repeat;
            mask-size: 100%;
            mask-position: center;
            width: 16px;
            height: 16px;
            display: inline-block;
            margin-right: 10px;
        }
        :hover:before {
            background-color: #972c86;
        }
        :hover {
            color: #972c86;
        }
    }
    >div:last-child{
        border-bottom: none;
    }
`;
const EditReplyButton = styled.div`
  :before {
    mask-image: url(${pencilIcon});
  }
`;
const RemoveReplyButton = styled.div`
    :before {
        mask-image: url(${crossIcon});
    }
`;

const Reminder = styled.div`
    :before {
        mask-image: url(${reminderIcon});
    }
`;
const QuoteButton = styled.div`
    :before {
        mask-image: url(${convoIcon});
    }
`;
const SharePostButton = styled.div`
    :before{
        mask-image: url(${shareIcon});
    }
`;
const ForwardButton = styled.div`
    :before{
        mask-image: url(${forwardIcon});
        transform: rotateY(180deg);
    }
`;

const ChatMessageOptions = props => {
    const {isAuthor, replyData, className = "", selectedChannel} = props;
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const dispatch = useDispatch()
    const tooltipRef = useRef();
    const moreRef = useRef();
    const slugs = useSelector(state => state.global.slugs);
    const scrollEl = document.getElementById("infinite-scroll-chat-replies");
    const [orientation] = useTooltipOrientation(moreRef, tooltipRef, scrollEl, showMoreOptions);
    const [hOrientation] = useTooltipHorizontalOrientation(moreRef, tooltipRef, scrollEl, showMoreOptions);
    const [toolTipPosition] = useTooltipPosition(moreRef, tooltipRef, scrollEl, showMoreOptions);

    const handleButtonClick = () => {
        setShowMoreOptions(!showMoreOptions);
        //props.handleShowOptions(!showMoreOptions)
    };

    // const handleDeleteReply = (e, modalData) => {
    //     props.deleteChatMessageV2Action({
    //         message_id: replyData.id,
    //         topic_id: selectedChannel.is_shared ? selectedChannel.entity_id : null,
    //         is_shared: selectedChannel.is_shared ? true : false,
    //         slug: selectedChannel.slug_owner,
    //         token: props.slugs.length && props.slugs.filter(s => s.slug_name === props.selectedChannel.slug_owner).length ?
    //             props.slugs.length && props.slugs.filter(s => s.slug_name === props.selectedChannel.slug_owner)[0].access_token : null,
    //     });
    // };
    const handleRemoveReply = () => {
        // let date = new Date();
        // let timestamp = date.getTime();
        // let cb = {
        //     id: timestamp,
        //     type: "modal",
        //     modal: "modal_dialog_yes_no",
        //     expand: true,
        //     minimize: false,
        //     title: "Delete reply",
        //     reply: replyData,
        //     channel: selectedChannel,
        //     callback: {
        //         handleYes: handleDeleteReply,
        //     },
        // };
        // props.addChatBoxAction(cb);
    };
    const handleEditReply = () => {
        dispatch(setEditChatMessage(replyData))
        // props.onEditReply(replyData);
    };
    const handleQuoteReply = () => {
        props.onQuoteReply(replyData);
    };
    const handleSetReminder = () => {
        props.cbSetReminderPopUp(replyData);
    };
    const handleTooltipMouseLeave = () => {
        console.log("mouseLeave");
        setTimeout(() => {
            setShowMoreOptions(false);
        }, 1000);
    };
    const handleCopyLink = e => {
        e.stopPropagation();
        let link = `${getBaseUrl()}/chat/${selectedChannel.code}/${replyData.code}`;
        copyTextToClipboard(link);
        setShowMoreOptions(!showMoreOptions);
    };

    // useEffect(() => {
    //     if (showMoreOptions) {
    //         const handleEscapeKey = e => {
    //             //console.log('escape');
    //             if (e.keyCode === 27) {
    //                 setShowMoreOptions(false);
    //             }
    //         };
    //         const handleOutsideClick = e => {
    //             e.preventDefault();
    //             //e.stopPropagation();
    //             //console.log('click');
    //             if (moreRef && moreRef.contains) {
    //                 if (!moreRef.contains(e.target)) {
    //                     setShowMoreOptions(false);
    //                     //document.removeEventListener('touchstart', handleOutsideClick, false)
    //                     document.removeEventListener('click', handleOutsideClick, false)
    //                 }
    //             }
    //         };
    //         document.addEventListener('keydown', handleEscapeKey, false);
    //         document.addEventListener('click', handleOutsideClick, false);
    //         return () => {
    //             document.removeEventListener('keydown', handleEscapeKey, false);
    //             document.removeEventListener('click', handleOutsideClick, false);
    //         }
    //     }

    // }, [showMoreOptions]);

    useOutsideClick(tooltipRef, handleButtonClick, showMoreOptions);

    const handleForwardMessage = () => {
        props.onForwardMessage(replyData);
    };

    return <ChatMoreButtonDiv
        className={`chat-more-button ${className}`}
        onClick={() => handleButtonClick()}
        ref={moreRef}>
        <MoreButton
            showMoreOptions={showMoreOptions}
            data-event="touchstart focus mouseover" data-event-off="mouseout" data-tip="Message options"
        >
        </MoreButton>
        {
            showMoreOptions &&
            <MoreTooltip
                ref={tooltipRef}
                isAuthor={isAuthor}
                //className={`more-options-tooltip orientation-top hOrientation-left`}
                className={`more-options-tooltip orientation-${orientation} hOrientation-${hOrientation}`}
                position={toolTipPosition}
                orientation={orientation}
                horizontalOrientation={hOrientation}
                onMouseLeave={() => handleTooltipMouseLeave()}
            >
                <Reminder onClick={e => handleSetReminder()}>
                    Remind me about this
                </Reminder>
                {isAuthor && !replyData.is_transferred &&
                <EditReplyButton onClick={() => handleEditReply()}>Edit</EditReplyButton>}
                <QuoteButton onClick={() => handleQuoteReply()}>Quote</QuoteButton>
                {isAuthor && <RemoveReplyButton onClick={handleRemoveReply}>Remove</RemoveReplyButton>}
                <SharePostButton onClick={e => handleCopyLink(e)}>
                    Copy message link
                </SharePostButton>
                <ForwardButton onClick={handleForwardMessage}>
                    Forward
                </ForwardButton>
            </MoreTooltip>

        }
    </ChatMoreButtonDiv>;
};

export default React.memo(ChatMessageOptions);