import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {Avatar} from "../../common";
import {useIsUserTyping} from "../../hooks";
import Tooltip from "react-tooltip-lite";

const ChatMembersContainer = styled.div`
`;

const StyledAvatar = styled(Avatar)`
    height: 2.5rem!important;
    width: 2.5rem!important;
    margin-left: ${props => props.firstUser ? "0" : "-0.5rem"};
`;

const ChatMembers = props => {

    const {page = "chat"} = props;
    const chatChannel = useSelector(state => state.chat.selectedChannel);
    const [usersTyping] = useIsUserTyping();

    const toggleTooltip = () => {
        let tooltips = document.querySelectorAll('span.react-tooltip-lite');
        tooltips.forEach((tooltip) => {
            tooltip.parentElement.classList.toggle('tooltip-active');
        });
    };

    return (
        <ChatMembersContainer className={`pr-3 d-flex`}>

            {
                page === "chat" ?
                    chatChannel.members.map((m, i) => {
                        return (
                            <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={m.name}>
                                <StyledAvatar
                                    id={m.id}
                                    firstUser={i === 0}
                                    className="chat-members"
                                    key={m.name}
                                    name={m.name}
                                    imageLink={m.profile_image_link}
                                />
                            </Tooltip>
                        );
                    })
                : page === "workspace" && usersTyping.length ?
                    usersTyping.map((m, i) => {
                        return (
                            <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={m.name}>
                                <StyledAvatar
                                    userId={m.id}
                                    firstUser={i === 0}
                                    className="chat-members"
                                    key={m.name}
                                    name={m.name}
                                    imageLink={m.profile_image_link}
                                />
                            </Tooltip>
                        );
                    })
                : null
            }
        </ChatMembersContainer>
    );
};

export default ChatMembers;