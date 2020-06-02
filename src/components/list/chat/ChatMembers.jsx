import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {Avatar} from "../../common";
import {useIsUserTyping} from "../../hooks";

const ChatMembersContainer = styled.div`
`;

const StyledAvatar = styled(Avatar)`
    height: 2.5rem!important;
    width: 2.5rem!important;
    margin-left: ${props => props.firstUser ? "0" : "-1.5rem"};
`;

const ChatMembers = props => {

    const {page = "chat"} = props;
    const chatChannel = useSelector(state => state.chat.selectedChannel);
    const user = useSelector(state => state.session.user);
    const [usersTyping] = useIsUserTyping();

    return (
        <ChatMembersContainer className={`pr-3`}>
            {
                page === "chat" ?
                    chatChannel.members.map((m, i) => {
                        return (
                            <StyledAvatar
                                userId={m.id}
                                firstUser={i === 0}
                                className="chat-members"
                                key={m.name}
                                name={m.name}
                                imageLink={m.profile_image_link}
                            />
                        );
                    })
                : page === "workspace" && usersTyping.length ?
                    usersTyping.map((m, i) => {
                        return (
                            <StyledAvatar
                                userId={m.id}
                                firstUser={i === 0}
                                className="chat-members"
                                key={m.name}
                                name={m.name}
                                imageLink={m.profile_image_link}
                            />
                        );
                    })
                : null
            }
        </ChatMembersContainer>
    );
};

export default ChatMembers;