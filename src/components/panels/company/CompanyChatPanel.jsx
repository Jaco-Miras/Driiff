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

    useEffect(() => {
        if (typeof props.match.params.code === "undefined") {
            setUseLastVisitedChannel(true);
        } else {
            setUseLastVisitedChannel(false);
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(useLastVisitedChannel && lastVisitedChannel !== null) {
            selectChannel(lastVisitedChannel, () => {
                props.history.push(`/chat/${lastVisitedChannel.code}`);
            });
        } else {
            const code = props.match.params.code;
            if(typeof code !== "undefined") {
                loadSelectedChannel(code, (err, res) => {
                    if (err) {
                        console.log(err);
                    }

                    if (res) {
                        selectChannel(res.data);
                    }
                });
            }
        }
    }, [lastVisitedChannel]);

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