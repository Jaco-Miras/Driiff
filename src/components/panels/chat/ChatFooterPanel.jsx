import React, {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {onClickSendButton} from "../../../redux/actions/chatActions";
import {PickerEmoji, SvgIconFeather} from "../../common";
import ChatInput from "../../forms/ChatInput";
import ChatQuote from "../../list/chat/ChatQuote";

const Wrapper = styled.div`
    position: relative;
    z-index: 100;
`;

const ArchivedDiv = styled.div`
    width: 100%;
    text-align: center;
    background: #f1f2f7;
    padding: 15px 10px;
    h4 {
        margin: 0;
    }
`;

const ChatInputContainer = styled.div`
    position: relative;
`;

const IconButton = styled(SvgIconFeather)`
    cursor: pointer;
    cursor: hand;
    border: 1px solid #afb8bd;
    height: 38px;
    margin: -1px 5px;
    width: 40px;
    padding: 10px;
    border-radius: 8px;
    
    &.feather-send {
        border: 1px solid #7a1b8b;
        background-color: #7a1b8b;
        color: #fff;
    }
`;

const Dflex = styled.div`
`;

const StyledPickerEmoji = styled(PickerEmoji)`
    right: unset;
    bottom: 70px;
`;

const ChatFooterPanel = (props) => {

    const {className = "", onShowFileDialog, dropAction} = props;

    const dispatch = useDispatch();
    const pickerRef = useRef();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(null);

    const selectedChannel = useSelector(state => state.chat.selectedChannel);

    const handleSend = () => {
        dispatch(onClickSendButton(true));
    };

    const handleShowEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const onSelectEmoji = (e) => {
        setSelectedEmoji(e);
        //setShowEmojiPicker(false);
    };

    const onClearEmoji = () => {
        setSelectedEmoji(null);
    };

    return (
        <Wrapper className={`chat-footer border-top ${className}`}>
            {
                selectedChannel && selectedChannel.is_archived === 0 &&
                <Dflex className="d-flex pr-2 pl-2">
                    <ChatQuote/>
                </Dflex>
            }
            <Dflex className="d-flex">
                {
                    selectedChannel && selectedChannel.is_archived === 1 ?
                        <ArchivedDiv>
                            <h4>Channel archived</h4>
                        </ArchivedDiv>
                        :
                        <React.Fragment>
                            <IconButton onClick={handleShowEmojiPicker} icon="smile"/>
                            <ChatInputContainer className="flex-grow-1">
                                <ChatInput selectedEmoji={selectedEmoji} onClearEmoji={onClearEmoji}
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
                    <StyledPickerEmoji
                        handleShowEmojiPicker={handleShowEmojiPicker}
                        onSelectEmoji={onSelectEmoji}
                        orientation={"top"}
                        ref={pickerRef}
                    />
                }
            </Dflex>
        </Wrapper>
    );
};

export default React.memo(ChatFooterPanel);