import React from "react";
import styled from "styled-components";
import {ChatContentPanel, ChatSidebarPanel} from "../chat";

const Wrapper = styled.div`
`;

const CompanyChatPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row no-gutters chat-block">
                <ChatSidebarPanel className={`col-lg-4 border-right`}/>
                <ChatContentPanel className={`col-lg-8`}/>
            </div>
        </Wrapper>
    );
};

export default React.memo(CompanyChatPanel);