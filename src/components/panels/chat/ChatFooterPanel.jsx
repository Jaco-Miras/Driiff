import React, {useState} from "react";
import {SlateContent, SlateEditor} from "slate-editor";
import styled from "styled-components";
import ChatInput from '../../forms/ChatInput';
import {useSelector} from 'react-redux';

const Wrapper = styled.div`
`;

const ReplyInput = styled(SlateEditor)`
`;

const ArchivedDiv = styled.div`
    width: 100%;
    text-align: center;
    background: #f1f2f7;
    padding: 15px 10px;
    h4 {
        margin: 0;
    }
`

const ChatFooterPanel = (props) => {

    const {className = ""} = props;

    const selectedChannel = useSelector(state => state.chat.selectedChannel)
    const {reply, setReply} = useState("Test");

    const handleSubmit = (e) => {
        setReply("Test");
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
                        <button className="btn btn-outline-light mr-2" type="button" title="" data-toggle="tooltip"
                                data-original-title="Emoji">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                className="feather feather-smile width-15 height-15">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                <line x1="15" y1="9" x2="15.01" y2="9"></line>
                            </svg>
                        </button>
                        <div className="flex-grow-1">
                            <ChatInput/>
                            {/* test
                            <ReplyInput
                                className="form-control" placeholder="Write your message">
                                <SlateContent value={reply}/>
                            </ReplyInput> */}
                        </div>
                        <div className="chat-footer-buttons d-flex">
                            <button onClick={handleSubmit} className="btn btn-primary" type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                    className="feather feather-send width-15 height-15">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                            <button className="btn btn-outline-light" type="button" title="" data-toggle="tooltip"
                                    data-original-title="Attach files">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                    className="feather feather-paperclip width-15 height-15">
                                    <path
                                        d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                                </svg>
                            </button>
                        </div>
                    </React.Fragment>
            }
            </div>
        </Wrapper>
    );
};

export default React.memo(ChatFooterPanel);