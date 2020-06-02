import React from "react";
import styled from "styled-components";
import {ChatContentPanel} from "../chat";

const Wrapper = styled.div`
`;

const WorkspaceChatPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row no-gutters chat-block">
                <ChatContentPanel className={`col-lg-12`}/>
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspaceChatPanel);