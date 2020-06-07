import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useChannel} from "../../hooks";
import {ChatContentPanel, ChatSidebarPanel} from "../chat";

const Wrapper = styled.div`
`;

const CompanyChatPanel = (props) => {

    const {className = ""} = props;

    const {selectChannel, lastVisitedChannel, loadSelectedChannel} = useChannel();
    const [useLastVisitedChannel, setUseLastVisitedChannel] = useState(false);
    const [activeTabPill, setActiveTabPill] = useState("home");

    useEffect(() => {
        if (typeof props.match.params.code === "undefined") {
            setUseLastVisitedChannel(true);
        } else {
            setUseLastVisitedChannel(false);
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (useLastVisitedChannel && lastVisitedChannel !== null) {
            selectChannel(lastVisitedChannel, () => {
                setActiveTabPill(lastVisitedChannel.type === "DIRECT" ? "contact" : "home");
                props.history.push(`/chat/${lastVisitedChannel.code}`);
            });
        } else {
            const code = props.match.params.code;
            if (typeof code !== "undefined") {
                loadSelectedChannel(code, (err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    if (res) {
                        selectChannel(res.data);
                        setActiveTabPill(res.data.type === "DIRECT" ? "contact" : "home");
                    }
                });
            }
        }
    }, [lastVisitedChannel]);

    return (
        <Wrapper className={`company-chat-panel container-fluid h-100 ${className}`}>
            <div className="row no-gutters chat-block">
                <ChatSidebarPanel className={`col-lg-4 border-right`} activeTabPill={`pills-${activeTabPill}`}/>
                <ChatContentPanel className={`col-lg-8`}/>
            </div>
        </Wrapper>
    );
};

export default React.memo(CompanyChatPanel);