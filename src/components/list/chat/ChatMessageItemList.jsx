import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    &.them {    
        &:before {
            left: 25px !important;
        }
    }
`;

const MessageItemContent = styled.div`
    ${props => props.isAuthor === false && `
    margin-left: 35px;`
}
    
`;

const Avatar = styled.div`
    position: absolute;
    top: 0;
    left: -45px;
    
    img {
        max-width: 100% !important;
    }
`;

const ChatMessageItem = (props) => {

    const {className = "", reply} = props;

    return (
        <Wrapper className={`message-item ${className} ${reply.author === true ? "me" : "them"}`}>
            <MessageItemContent className="message-item-content" isAuthor={reply.author}>
                {
                    reply.author === false &&
                    <>
                        <Avatar className="avatar avatar-sm"><img
                            src="https://24.driff.online/user-profile/38?timestamp=1589155257"
                            className="rounded-circle"
                            alt="fpo-placeholder"/></Avatar>
                    </>
                }

                {reply.message}

                {/*
                 <i className="ti-file mr-2 font-size-20 mt-2"></i>
                 <div>
                 <div>important_documents.pdf <i className="text-muted small">(50KB)</i>
                 </div>
                 <ul className="list-inline small">
                 <li className="list-inline-item"><a href="/">Download</a></li>
                 <li className="list-inline-item"><a href="/">View</a></li>
                 </ul>
                 </div>*/}

                {/*<img src="https://via.placeholder.com/600X600" alt="fpo-placeholder"/>
                 Lorem ipsum dolor sit amet, consectetur
                 adipisicing elit.
                 Exercitationem fuga iure iusto libero, possimus quasi quis repellat sint tempora
                 ullam!*/}
            </MessageItemContent>
            <span className="time small text-muted font-italic">Yesterday</span>
        </Wrapper>
    );
};

export default React.memo(ChatMessageItem);