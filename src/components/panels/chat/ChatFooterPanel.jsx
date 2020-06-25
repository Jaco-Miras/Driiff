import React, {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {localizeChatTimestamp} from "../../../helpers/momentFormatJS";
import {onClickSendButton} from "../../../redux/actions/chatActions";
import {joinWorkspace, joinWorkspaceReducer} from "../../../redux/actions/workspaceActions";
import {CommonPicker, SvgIconFeather} from "../../common";
import ChatInput from "../../forms/ChatInput";
import {useIsMember} from "../../hooks";
import ChatQuote from "../../list/chat/ChatQuote";


const Wrapper = styled.div`
    position: relative;
    z-index: 1;
    > div > svg:first-child {
        margin-left: 0 !important;
    }
    .chat-footer-buttons svg:last-of-type {
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
`;

const ArchivedDiv = styled.div`
    width: 100%;
    text-align: center;
    padding: 15px 10px;
    h4 {
        margin: 0;
        display: flex;
        justify-content: center;
        alignt-items: center;
    }
`;

const ChatInputContainer = styled.div`
    position: relative;
    max-width: calc(100% - 165px);
`;

const Icon = styled(SvgIconFeather)`
    margin-right: 6px;
    width: 20px;
`;

const IconButton = styled(SvgIconFeather)`
    cursor: pointer;
    cursor: hand;
    border: 1px solid #afb8bd;
    height: 37px;
    margin: -1px 8px;
    width: 47px;
    min-width: 47px;
    padding: 10px 0;
    border-radius: 8px;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    &:hover {
        background: #afb8bd;
        color: #ffffff;
    }
    &.feather-send {
        border: 1px solid #7a1b8b;
        background-color: #7a1b8b;
        color: #fff;
        &:hover {
            background-color: #8C3B9B;
        }
    }
`;

const Dflex = styled.div`
    &.channel-viewing {
        display: flex;
        flex-wrap: wrap;
        background-color: #f8f8f8;
        text-align: center;
        align-items: center;
        justify-content: center;
        padding: 20px 0;

        > div {
            flex: 0 1 100%;
        }

        .channel-name{
            color: #64625C;
            font-size: 17px;
            font-weight: 600;
        }
        .channel-create {
            letter-spacing: 0;
            margin-bottom: 0;
            color: #B8B8B8;
            font-weight: normal;
            font-size: 19px;
            text-transform: lowercase;
            margin-bottom: 16px;
        }
        .channel-action {
            button {
                background: #7a1b8b;
                color: #fff;
                border: none;
                padding: 8px 15px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
            }
        }
    }
`;

const PickerContainer = styled(CommonPicker)`
    right: unset;
    bottom: 70px;
`;

const ChatFooterPanel = (props) => {

    const {className = "", onShowFileDialog, dropAction} = props;

    const dispatch = useDispatch();
    const ref = {
        picker: useRef(),
    };
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [selectedGif, setSelectedGif] = useState(null);

    const selectedChannel = useSelector(state => state.chat.selectedChannel);
    const user = useSelector(state => state.session.user);

    const handleSend = () => {
        dispatch(
            onClickSendButton(true),
        );
    };

    const handleShowEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const onSelectEmoji = (e) => {
        setSelectedEmoji(e);
    };

    const onSelectGif = (e) => {
        setSelectedGif(e);
    };

    const onClearEmoji = () => {
        setSelectedEmoji(null);
    };

    const onClearGif = () => {
        setSelectedGif(null);
        handleSend();
    };

    const handleJoinWorkspace = () => {
        dispatch(
            joinWorkspace({
                group_id: selectedChannel.entity_id,
                user_id: user.id,
            }, (err, res) => {
                if (err) return;
                dispatch(
                    joinWorkspaceReducer({
                        channel_id: selectedChannel.id,
                        topic_id: selectedChannel.entity_id,
                        user: user,
                    }),
                );
            }),
        );
    };

    const isMember = useIsMember(selectedChannel && selectedChannel.members.length ? selectedChannel.members.map(m => m.id) : []);

    return (
        <Wrapper className={`chat-footer border-top ${className}`}>
            {
                selectedChannel && selectedChannel.is_archived === 0 &&
                <Dflex className="d-flex pr-2 pl-2">
                    <ChatQuote/>
                </Dflex>
            }
            {
                isMember &&
                <Dflex className="d-flex align-items-center">
                    {
                        selectedChannel && selectedChannel.is_archived === 1 ?
                        <ArchivedDiv>
                            <h4><Icon icon="archive"/> This is an archived channel</h4>
                        </ArchivedDiv>
                                                                             :
                        <React.Fragment>
                            <IconButton onClick={handleShowEmojiPicker} icon="smile" title="Emoji" data-toggle="tooltip"/>
                            <ChatInputContainer className="flex-grow-1">
                                <ChatInput
                                    selectedGif={selectedGif} onClearGif={onClearGif}
                                    selectedEmoji={selectedEmoji} onClearEmoji={onClearEmoji}
                                    dropAction={dropAction}/>
                            </ChatInputContainer>
                            <div className="chat-footer-buttons d-flex">
                                <IconButton onClick={handleSend} icon="send"/>
                                <IconButton onClick={onShowFileDialog} icon="paperclip"/>
                            </div>
                        </React.Fragment>
                    }
                    {
                        showEmojiPicker === true &&
                        <PickerContainer
                            handleSend={handleSend}
                            handleShowEmojiPicker={handleShowEmojiPicker}
                            onSelectEmoji={onSelectEmoji}
                            onSelectGif={onSelectGif}
                            orientation={"top"}
                            ref={ref.picker}
                        />
                    }
                </Dflex>
            }
            {
                isMember === false && selectedChannel !== null &&
                <Dflex className="channel-viewing">
                    <div className="channel-name">You are viewing #{selectedChannel.title}</div>
                    <div className="channel-create">Created
                        by {selectedChannel.creator.name} on {localizeChatTimestamp(selectedChannel.created_at.timestamp)}</div>
                    <div className="channel-action">
                        <button onClick={handleJoinWorkspace}>Join workspace chat</button>
                    </div>
                </Dflex>
            }
        </Wrapper>
    );
};

export default React.memo(ChatFooterPanel);