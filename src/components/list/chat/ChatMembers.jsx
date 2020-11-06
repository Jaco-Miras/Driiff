import React from "react";
import styled from "styled-components";
import { Avatar, PlusRecipients } from "../../common";
import { useIsUserTyping } from "../../hooks";

const ChatMembersContainer = styled.div``;

const StyledAvatar = styled(Avatar)`
  margin-left: ${(props) => (props.firstUser ? "0" : "-0.5rem")};
`;

const ChatMembers = (props) => {
  const { page = "chat", members } = props;
  const [usersTyping] = useIsUserTyping();

  const firstFiveMembers = members.slice(0, 5);
  const afterFiveMembers = members.slice(5);

  return (
    <ChatMembersContainer className={"pr-3 d-flex"}>
      {page === "chat"
        ? [
            firstFiveMembers.map((m, i) => {
              return <StyledAvatar id={m.id} firstUser={i === 0} className="chat-members" key={m.id}
                                   name={m.name ? m.name : m.email}
                                   imageLink={m.profile_image_thumbnail_link ? m.profile_image_thumbnail_link : m.profile_image_link}
                                   hasAccepted={m.has_accepted}/>;
            }),

            afterFiveMembers.length != null && afterFiveMembers[0] && <PlusRecipients recipients={afterFiveMembers}></PlusRecipients>,
          ]
        : page === "workspace" && usersTyping.length
        ? usersTyping.map((m, i) => {
            return <StyledAvatar userId={m.id} firstUser={i === 0} className="chat-members" key={m.id}
                                 name={m.name ? m.name : m.email}
                                 imageLink={m.profile_image_thumbnail_link ? m.profile_image_thumbnail_link : m.profile_image_link}
                                 hasAccepted={m.has_accepted}/>;
          })
        : null}
    </ChatMembersContainer>
  );
};

export default ChatMembers;
