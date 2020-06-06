import React, {useEffect} from "react";
import styled from "styled-components";
import {useChannel} from "../../hooks";
import {ChatContentPanel, ChatSidebarPanel} from "../chat";

const Wrapper = styled.div`
`;

const CompanyChatPanel = (props) => {

    const {className = ""} = props;

    const {selectChannel, lastVisitedChannel, loadSelectedChannel} = useChannel();

    useEffect(() => {
        let code = props.match.params.code;
        if (typeof code === "undefined" && lastVisitedChannel !== null) {
            selectChannel(lastVisitedChannel);
            props.history.push(`/chat/${lastVisitedChannel.code}`);
        } else if (code !== "undefined") {
            loadSelectedChannel(code, (err, res) => {
                selectChannel(res.data);
            });
        }
    }, []);

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