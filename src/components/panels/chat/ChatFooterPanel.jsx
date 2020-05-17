import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {SvgIconFeather} from "../../common/SvgIcon";
import ChatInput from "../../forms/ChatInput";

const Wrapper = styled.div`
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

const ChatFooterPanel = (props) => {

    const {className = ""} = props;

    const selectedChannel = useSelector(state => state.chat.selectedChannel);

    const handleSend = (e) => {
    };

    return (
        <Wrapper className={`chat-footer border-top ${className}`}>
            <div className="d-flex">
                {
                    selectedChannel && selectedChannel.is_archived === 1 ?
                        <ArchivedDiv>
                            <h4>Channel archived</h4>
                        </ArchivedDiv>
                        :
                        <React.Fragment>
                            <IconButton icon="smile"/>
                            <ChatInputContainer className="flex-grow-1">
                                <ChatInput/>
                            </ChatInputContainer>
                            <div className="chat-footer-buttons d-flex">
                                <IconButton onClick={handleSend} icon="send"/>
                                <IconButton icon="paperclip"/>
                            </div>
                        </React.Fragment>
                }
            </div>
        </Wrapper>
    );
};

export default React.memo(ChatFooterPanel);