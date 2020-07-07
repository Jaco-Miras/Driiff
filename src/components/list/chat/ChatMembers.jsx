import React from "react";
import styled from "styled-components";
import {Avatar} from "../../common";
import {useIsUserTyping} from "../../hooks";

const ChatMembersContainer = styled.div`
`;

const StyledAvatar = styled(Avatar)`
    height: 2.5rem!important;
    width: 2.5rem!important;
    margin-left: ${props => props.firstUser ? "0" : "-0.5rem"};
`;

const ChatMembers = props => {

    const {page = "chat", members} = props;
    const [usersTyping] = useIsUserTyping();
    console.log(page, members)
    return (
        <ChatMembersContainer className={`pr-3 d-flex`}>

            {
                page === "chat" ?
                    members.map((m, i) => {
                        return (
                            <StyledAvatar
                                id={m.id}
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