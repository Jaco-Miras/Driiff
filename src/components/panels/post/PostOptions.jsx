import React, {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import styled from "styled-components";
import toaster from "toasted-notes";
import moreIcon from "../../../assets/img/more-menu-icons/secundary.svg";
import {copyTextToClipboard} from "../../../helpers/commonFunctions";
import {getBaseUrl} from "../../../helpers/slugHelper";
import {addToModals} from "../../../redux/actions/globalActions";
import {postToggleRead, followPost, unFollowPost} from "../../../redux/actions/postActions";
import {useOutsideClick, useTooltipOrientation, useTooltipPosition} from "../../hooks";

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
    props.showMoreOptions ? "#972c86" : "#a7abc3"};
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
    height: auto;
    position: absolute;
    bottom: calc(100% + 12px);
    left: -108px;
    cursor: pointer;
    width: 200px;
    height: auto;
    background-color: #ffffff;
    color: #4d4d4d;
    border-radius: 8px;
    padding: 8px 0px;
    cursor: pointer;
    box-shadow: 0 5px 10px -1px rgba(0,0,0,.15);
    border-top: 1px solid #eeeeee !important;
    button:hover{
        color: #972c86;
    }
    > div {
        text-align: left;
        padding: 4px 24px;
        cursor: pointer;
        &:hover {
            background-color: #F0F0F0;
            color: #7A1B8B;
        }
    }
    >div:last-child{
        border-bottom: none;
    }
`;


const PostOptions = props => {

    const {className = "", post} = props;

    const location = useLocation();
    const dispatch = useDispatch();
    const tooltipRef = useRef();
    const moreRef = useRef();
    const slugs = useSelector(state => state.global.slugs);
    const user = useSelector(state => state.session.user);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const scrollEl = document.getElementById("infinite-scroll-chat-replies");
    const orientation = useTooltipOrientation(moreRef, tooltipRef, null, showMoreOptions, "bottom", 0);
    const [toolTipPosition] = useTooltipPosition(moreRef, tooltipRef, null, showMoreOptions);

    const handleButtonClick = () => {
        setShowMoreOptions(!showMoreOptions);
        //props.handleShowOptions(!showMoreOptions)
    };

    const handleTooltipMouseLeave = () => {
        setTimeout(() => {
            setShowMoreOptions(false);
        }, 1000);
    };

    const handleCopyLink = e => {
        e.stopPropagation();
        let link = `${getBaseUrl()}${location.pathname}/post/${post.id}`;
        copyTextToClipboard(link);
        setShowMoreOptions(!showMoreOptions);
    };

    const handleMarkReadUnread = (value) => {
        dispatch(
            postToggleRead({
                post_id: post.id,
                unread: value
            })
        )
    };

    const handlePostFollow = () => {
        if (post.is_followed) {
            //When: The user is following/recipient of the post - and not the creator.
            dispatch(
                unFollowPost({post_id: post.id}, (err,res) => {
                    if (err) return;
                    let notification = `You’ve stopped to follow ${post.title}`;
                    toaster.notify(notification, {position: "bottom-left"});
                })
            );
        } else {
            //When: The user not following the post and the post is in an open topic.
            dispatch(
                followPost({post_id: post.id}, (err,res) => {
                    if (err) return;
                    let notification = `You’ve started to follow ${post.title}`;
                    toaster.notify(notification, {position: "bottom-left"});
                })
            );
        }
    };

    const handleShowSnoozeModal = () => {

    }

    useOutsideClick(tooltipRef, handleButtonClick, showMoreOptions);

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
                //isAuthor={isAuthor}
                className={`more-options-tooltip orientation-${orientation.vertical} hOrientation-${orientation.horizontal}`}
                position={toolTipPosition}
                orientation={orientation.vertical}
                horizontalOrientation={orientation.vertical}
                onMouseLeave={handleTooltipMouseLeave}
            >
                <div onClick={() => handleMarkReadUnread(0)}>
                    Mark as read
                </div>
                <div onClick={() => handleMarkReadUnread(1)}>
                    Mark as unread
                </div>
                <div onClick={handleCopyLink}>
                    Share post
                </div>
                <div onClick={handleShowSnoozeModal}>
                    Snooze post
                </div>
                {
                    post.author.id !== user.id && 
                    <div onClick={handlePostFollow}>
                        {post.is_followed ? "Unfollow" : "Follow"}
                    </div>
                }
            </MoreTooltip>

        }
    </ChatMoreButtonDiv>;
};

export default React.memo(PostOptions);