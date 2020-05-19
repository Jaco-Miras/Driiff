import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Avatar } from "../../common";

const ChatMembersContainer = styled.div`
`;

const StyledAvatar = styled(Avatar)`
    height: 2.5rem!important;
    width: 2.5rem!important;
    margin-left: ${props => props.firstUser ? "0" : "-1.5rem"};
`;

const ChatMembers = props => {

    const chatChannel = useSelector(state => state.chat.selectedChannel);
    const user = useSelector(state => state.session.user);

    return (
        <ChatMembersContainer className={`pr-3`}>
            {
                chatChannel.members.filter(m => m.id !== user.id).map((m,i) => {
                    return (
                        <StyledAvatar 
                            userId={m.id}
                            firstUser={i === 0}
                            className="chat-members" 
                            key={m.name} 
                            name={m.name} 
                            imageLink={m.profile_image_link}
                        />
                    )
                })
            }
        </ChatMembersContainer>
    )
};

export default ChatMembers;