import React, {useEffect, useRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import styled from "styled-components";
import archiveIcon from "../../../assets/icon/archive/l/active.svg";
import crossIcon from "../../../assets/icon/close/r/secundary.svg";
import muteIcon from "../../../assets/icon/mute/r/mute_secundary.svg";
import eyeCloseIcon from "../../../assets/img/eye-close-active.png";
import moreIcon from "../../../assets/img/more-menu-icons/secundary.svg";
import pinIcon from "../../../assets/img/svgs/chat/pin_white.svg";
import useOutsideClick from "../../hooks/useOutsideClick";
import {useTooltipOrientation, useTooltipPosition} from "../../hooks/useTooltipOrientation";
import {updateChannel} from '../../../redux/actions/chatActions';
// import {updateChannel} from '../../../redux/actions/revampActions'

const MoreButtonContainer = styled.div`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  min-width: 30px;
  min-height: 30px;
  margin-left: auto;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  background: ${props => (props.show && !props.selected ? "#972c86" : "#fff")};
  opacity: ${props => (props.show && !props.selected ? "1 !important" : "0")};
  
  :before {
    content: "";
    mask-image: url(${moreIcon});
    background-color: ${props =>
    props.show && !props.selected ? "#fff" : "#972c86"};
    mask-repeat: no-repeat;
    mask-size: 60%;
    mask-position: center;
    width: 100%;
    height: 100%;
    display: inline-block;
  }
  
  > div {
    cursor: pointer;
  }
`;
const MoreTooltip = styled.div`
  z-index: 5;
  width: 240px;
  height: auto;
  background-color: #fafafa;
  color: #4d4d4d;
  border: 1px solid #fafafa;
  border-radius: 6px;
  position: absolute;  
  right: -10px;
  padding: 15px 15px;
  cursor: pointer;
  box-shadow: 0 0 3px 0 rgba(26, 26, 26, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  
  &.orientation-top {
    bottom: 45px;
    
    &:before {
        right 12px;
        bottom: -15px;
        content: "";
        position: absolute;     
        border-width: ${props => props.orientation === "bottom" ? "13px" : "unset"};
        border-style: ${props => props.orientation === "bottom" ? "solid" : "unset"};
        border-color: ${props => props.orientation === "bottom" ? "transparent transparent rgba(0, 0, 0, 0.1) transparent" : "unset"};
        border-left: ${props => props.orientation === "top" && "13px solid transparent"};
        border-right: ${props => props.orientation === "top" && "13px solid transparent"};
        border-top: ${props => props.orientation === "top" && "13px solid rgba(0,0,0,0.1)"};
    
        @media (max-width: 1199.99px) {
            right: auto;
            left: -21px;
            bottom: 11px;
            transform: rotate(90deg);
        }
            
        @media (max-width: 575.99px) {
            right: -21px;
            left: auto;
            transform: rotate(-90deg);
        }
  }
  
    &:after {
        right 12px;
        bottom: -13px;
        content: "";
        position: absolute; 
        border-width: ${props => props.orientation === "bottom" ? "10px" : "unset"};
        border-style: ${props => props.orientation === "bottom" ? "solid" : "unset"};
        border-color: ${props => props.orientation === "bottom" ? "transparent transparent #FAFAFA transparent" : "unset"};
        border-left: ${props => props.orientation === "top" && "13px solid transparent"};
        border-right: ${props => props.orientation === "top" && "13px solid transparent"};
        border-top: ${props => props.orientation === "top" && "13px solid #fafafa"};
        
        @media (max-width: 1199.99px) {        
            left: -19px;
            right: auto;
            bottom: 10px;
            transform: rotate(90deg);
        }
            
        @media (max-width: 575.99px) {
            right: -19px;
            left: auto;
            transform: rotate(-90deg);
        }
      }
    
        @media (max-width: 1199.99px) {
          position: fixed;
          bottom: ${props => props.position - 30}px;
          left: 465px;
        }
        
        @media (max-width: 991.99px) {
            left: 375px;
        }
        
        @media (max-width: 767.99px) {
            left: 200px;
        }
        
        @media (max-width: 575.99px) {
            right: 75px;
            left: auto;
        }
    }
    
    &.orientation-bottom {
        top: 160%;
        
        &:before {
            right 12px;
            bottom: 100%;
            content: "";
            position: absolute;     
            border-width: ${props => props.orientation === "bottom" ? "13px" : "unset"};
            border-style: ${props => props.orientation === "bottom" ? "solid" : "unset"};
            border-color: ${props => props.orientation === "bottom" ? "transparent transparent rgba(0, 0, 0, 0.1) transparent" : "unset"};
            border-left: ${props => props.orientation === "top" && "13px solid transparent"};
            border-right: ${props => props.orientation === "top" && "13px solid transparent"};
            border-top: ${props => props.orientation === "top" && "13px solid rgba(0,0,0,0.1)"};
            
            @media (max-width: 1199.99px) {
                right: auto;
                left: -25px;
                transform: rotate(-90deg);
                top: 8px;
            }            
            
            @media (max-width: 575.99px) {
                right: -25px;
                left: auto;
                transform: rotate(90deg);
            }
          }
          &:after {
            right 14px;
            bottom: 100%;
            content: "";
            position: absolute; 
            border-width: ${props => props.orientation === "bottom" ? "10px" : "unset"};
            border-style: ${props => props.orientation === "bottom" ? "solid" : "unset"};
            border-color: ${props => props.orientation === "bottom" ? "transparent transparent #FAFAFA transparent" : "unset"};
            border-left: ${props => props.orientation === "top" && "13px solid transparent"};
            border-right: ${props => props.orientation === "top" && "13px solid transparent"};
            border-top: ${props => props.orientation === "top" && "13px solid #fafafa"};
            
            @media (max-width: 1199.99px) {        
                left: -20px;
                right: auto;
                top: 10px;
                transform: rotate(-90deg);
            }
            
            @media (max-width: 575.99px) {
                right: -20px;
                left: auto;
                transform: rotate(90deg);
            }
          }
        
        @media (max-width: 1199.99px) {
          position: fixed;
          top: ${props => props.position - 10}px;
          bottom: auto;
          left: 465px;
        }
        
        @media (max-width: 991.99px) {
            left: 375px;
        }
        
        @media (max-width: 767.99px) {
            left: 200px;
        }
        
        @media (max-width: 575.99px) {
            right: 75px;
            left: auto;
        }
    }    
`;
const PinBtn = styled.div`
  display: inline-flex;
  align-items: center;
  font-weight: 200;
  font-size: 15px;
  padding: 10px 0;
  width: 100%;
  border-bottom: 1px solid #c3c3c3;
  cursor: pointer;
  cursor: hand;
  
  :before {
    content: "";
    mask-image: url(${pinIcon});
    background-color: #4d4d4d;
    mask-repeat: no-repeat;
    mask-size: 100%;
    mask-position: center;
    width: 24px;
    height: 24px;
    display: inline-block;
    margin-right: 20px;
  }
  :hover:before {
    background-color: #972c86;
  }
  :hover {
    color: #972c86;
  }
`;
const CloseBtn = styled.div`
  display: inline-flex;
  align-items: center;
  font-weight: 200;
  font-size: 15px;
  padding: 10px 0;
  width: 100%;  
  :before {
    content: "";
    mask-image: url(${archiveIcon});
    background-color: #4d4d4d;
    mask-repeat: no-repeat;
    mask-size: 100%;
    mask-position: center;
    width: 24px;
    height: 24px;
    display: inline-block;
    margin-right: 20px;
  }
  :hover:before {
    background-color: #972c86;
  }
  :hover {
    color: #972c86;
  }
`;
const HideBtn = styled.div`
  display: inline-flex;
  align-items: center;
  font-weight: 200;
  font-size: 15px;
  padding: 10px 0;
  width: 100%;  
  border-bottom: 1px solid #c3c3c3;
  :before {
    content: "";
    mask-image: url(${crossIcon});
    background-color: #4d4d4d;
    mask-repeat: no-repeat;
    mask-size: 100%;
    mask-position: center;
    width: 24px;
    height: 24px;
    display: inline-block;
    margin-right: 20px;
  }
  :hover:before {
    background-color: #972c86;
  }
  :hover {
    color: #972c86;
  }
`;
const MarkAsUnreadBtn = styled.div`
  display: inline-flex;
  align-items: center;
  font-weight: 200;
  font-size: 15px;
  padding: 10px 0;
  width: 100%;
  border-bottom: 1px solid #c3c3c3;
  :before {
    content: "";
    mask-image: url(${eyeCloseIcon});
    background-color: #4d4d4d;
    mask-repeat: no-repeat;
    mask-size: 100%;
    mask-position: center;
    width: 24px;
    height: 24px;
    display: inline-block;
    margin-right: 20px;
  }
  :hover:before {
    background-color: #972c86;
  }
  :hover {
    color: #972c86;
  }
`;
const MuteBtn = styled.div`
  display: inline-flex;
  align-items: center;
  font-weight: 200;
  font-size: 15px;
  padding: 10px 0;
  width: 100%;
  border-bottom: 1px solid #c3c3c3;
  :before {
    content: "";
    mask-image: url(${muteIcon});
    background-color: #4d4d4d;
    mask-repeat: no-repeat;
    mask-size: 100%;
    mask-position: center;
    width: 24px;
    height: 24px;
    display: inline-block;
    margin-right: 20px;
  }
  :hover:before {
    background-color: #972c86;
  }
  :hover {
    color: #972c86;
  }
`;

const ChannelOptions = props => {
    const { channel } = props;

    const dispatch = useDispatch();
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [tooltipAdjustment, setTooltipAdjustment] = useState(false);
    const tooltipRef = useRef();
    const moreRef = useRef();
    const scrollEl = document.getElementById("chat-channels");
    const [orientation] = useTooltipOrientation(moreRef, tooltipRef, scrollEl, showMoreOptions);
    const [toolTipPosition] = useTooltipPosition(moreRef, tooltipRef, scrollEl, showMoreOptions);
    const [sharedChannel, setSharedChannel] = useState(false);
    const sharedSlugs = useSelector(state => state.global.slugs);

    useEffect(() => {
        if (channel.is_shared) {
            setSharedChannel(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (tooltipRef.current) {
            let i = tooltipRef.current.querySelectorAll("div").length;

            if (i > 4) {
                tooltipRef.current.classList.remove("top");
                setTooltipAdjustment(true);
            } else {
                setTooltipAdjustment(false);
            }
        }
    }, [showMoreOptions]);

    const handlePinButton = () => {
        let payload = {
            id: channel.id,
            is_pinned: !channel.is_pinned,
            is_archived: channel.is_archived,
            is_muted: channel.is_muted,
            title: channel.title,
        };

        if (channel.type === "PERSONAL_BOT") {
            payload = {
                ...payload,
                pinned_personal_bot: 1,
            };
        }

        if (sharedChannel && sharedSlugs.length) {
            payload = {
                ...payload,
                is_shared: true,
                token: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].access_token,
                slug: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].slug_name,
            };
        }
        dispatch(updateChannel(payload, (err, res) => {
            if (err) return;
            // let updatedChannel = {
            //     ...channel,
            //     is_pinned: !channel.is_pinned,
            // };
            //updateChannel(updatedChannel);
        })
        )
    };

    const handleMuteChat = () => {
        let payload = {
            id: channel.id,
            is_pinned: channel.is_pinned,
            is_archived: channel.is_archived,
            is_muted: !channel.is_muted,
            title: channel.title,
        };
        if (sharedChannel && sharedSlugs.length) {
            payload = {
                ...payload,
                is_shared: true,
                token: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].access_token,
                slug: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].slug_name,
            };
        }
        props.updateChatChannelV2Action(payload, (err, res) => {
            if (err) return;
            let updatedChannel = {
                ...channel,
                is_muted: !channel.is_muted,
            };
            props.updateChannelAction(updatedChannel);
        });
    };
    const handleHideChat = () => {
        let payload = {
            id: channel.id,
            is_pinned: channel.is_pinned,
            is_archived: channel.is_archived,
            is_muted: channel.is_muted,
            title: channel.title,
            is_hide: !channel.is_hidden,
        };
        if (sharedChannel && sharedSlugs.length) {
            payload = {
                ...payload,
                is_shared: true,
                token: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].access_token,
                slug: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].slug_name,
            };
        }
        if (channel.total_unread > 0) {
            props.markReadChatChannelAction({channel_id: channel.id});
        }
        props.updateChatChannelV2Action(payload, (err, res) => {
            if (err) return;
            let updatedChannel = {
                ...channel,
                selected: false,
                is_hidden: channel.is_hidden === 0 ? 1 : 0,
                total_unread: 0,
            };
            props.updateChannelAction(updatedChannel);
            if (props.selectedChannel.id === channel.id) {
                props.setSelectedChannelAction(props.firstChannel);
            }
        });
    };

    const handleCloseArchiveChat = () => {
        props.handleShowArchiveConfirmation(channel);
        // if (isInviter) {
        //     props.handleShowArchiveConfirmation(channel)
        // } else {
        //     handleHideChat()
        // }
    };

    const handleMarkAsUnreadSelected = e => {
        e.stopPropagation();
        setShowMoreOptions(!showMoreOptions);
        props.handleShowOptions();
        let payload = {
            channel_id: channel.id,
        };
        if (sharedChannel && sharedSlugs.length) {
            payload = {
                ...payload,
                is_shared: true,
                token: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].access_token,
                slug: sharedSlugs.filter(s => s.slug_name === channel.slug_owner)[0].slug_name,
            };
        }
        console.log(channel)
        if (channel.total_unread === 0 && channel.is_read === 1) {
            props.markAsUnreadChatAction(payload, (err, res) => {
                if (err) return;
                let updatedChannel = {
                    ...channel,
                    mark_unread: !channel.mark_unread,
                    mark_new_messages_as_read: true,
                    is_read: 0,
                    total_unread: 0,
                    minus_count: channel.total_unread,
                };
                //props.updateChannelAction(updatedChannel);
                props.updateUnreadChatRepliesAction(updatedChannel);
            });
        } else {
            props.markReadChatChannelAction(payload, (err, res) => {
                if (err) return;
                let updatedChannel = {
                    ...channel,
                    mark_new_messages_as_read: false,
                    mark_unread: channel.mark_unread,
                    is_read: 1,
                    total_unread: 0,
                    minus_count: channel.total_unread,
                };
                //props.updateChannelAction(updatedChannel);
                props.updateUnreadChatRepliesAction(updatedChannel);
            });
        }
    };
    const handleShowMoreOptions = () => {
        setShowMoreOptions(!showMoreOptions);
    };
    useOutsideClick(tooltipRef, handleShowMoreOptions, showMoreOptions);

    if (showMoreOptions) {
        //console.log(channel.is_hidden, channel);
    }

    return <MoreButtonContainer
        className={`more-button-component ${showMoreOptions ? "active" : ""}`}
        windowState={props.windowState}
        selected={props.selected}
        show={showMoreOptions}
        ref={moreRef}
        /*onMouseEnter={e => {
         e.stopPropagation();
         setShowMoreOptions(true)
         }}
         onMouseLeave={e => {
         e.stopPropagation();
         setShowMoreOptions(false)
         }}*/
        onClick={e => {
            e.stopPropagation();
            // handleSetDetailOpen(!showMoreOptions);
            setShowMoreOptions(!showMoreOptions);
            props.handleShowOptions();
        }}
        data-event="touchstart focus mouseover"
        data-event-off="mouseout"
        data-tip="Options"
    >
        {
            showMoreOptions &&
            <MoreTooltip
                ref={tooltipRef}
                className={`more-options-tooltip ${tooltipAdjustment ? "adjust" : ""} orientation-${orientation}`}
                position={toolTipPosition}
                orientation={orientation}>
                <PinBtn onClick={e => handlePinButton()}>
                    {channel.is_pinned ? `Unpin` : `Pin`}
                </PinBtn>
                <MarkAsUnreadBtn onClick={e => handleMarkAsUnreadSelected(e)}>
                    {(channel.mark_unread || (!channel.mark_unread && channel.total_unread > 0)) ? `Mark as Read` : `Mark as Unread`}
                </MarkAsUnreadBtn>
                <MuteBtn onClick={e => handleMuteChat()}>
                    {channel.is_muted ? `Unmute` : `Mute`}
                </MuteBtn>
                {
                    channel.is_hidden === 0 && channel.type !== "PERSONAL_BOT" &&
                    <HideBtn onClick={e => handleHideChat(e)}>
                        Hide
                    </HideBtn>
                }
                {
                    (channel.type !== "PERSONAL_BOT" || channel.type !== "COMPANY") &&
                    <CloseBtn onClick={handleCloseArchiveChat}>
                        {channel.is_archived === 0 ? `Archive` : "Unacrhive"}
                    </CloseBtn>
                }
            </MoreTooltip>
        }
    </MoreButtonContainer>;
};

export default React.memo(ChannelOptions);
