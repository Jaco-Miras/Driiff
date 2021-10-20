import React from "react";
import styled from "styled-components";
import { Avatar, PlusRecipients } from "../../common";
import { useWindowSize } from "../../hooks";

const MembersListContainer = styled.div`
  .people-list {
    right: 0;
  }
  .company.TEAM > div:first-child {
    background-color: #7a1b8b;
    .feather-home {
      color: #fff;
    }
  }
`;

const StyledAvatar = styled(Avatar)`
  height: 2.7rem !important;
  width: 2.7rem !important;
  margin-left: ${(props) => (props.firstUser ? "0" : "-0.5rem")};
`;

const MembersLists = (props) => {
  const { members, classNames = "" } = props;

  const winSize = useWindowSize();

  let memberSize = 5;
  if (winSize.width <= 575) {
    memberSize = 5;
  }

  const firstMembers = members ? members.slice(0, memberSize) : [];
  const afterMembers = members ? members.slice(memberSize) : [];

  return (
    <MembersListContainer className={`d-flex ${classNames}`}>
      {firstMembers.map((m, i) => {
        return (
          <StyledAvatar
            id={m.id}
            firstUser={i === 0}
            key={m.id}
            name={m.name ? m.name : m.email}
            imageLink={m.hasOwnProperty("members") ? m.icon_link : m.profile_image_thumbnail_link ? m.profile_image_thumbnail_link : m.profile_image_link}
            hasAccepted={m.has_accepted}
            type={m.hasOwnProperty("members") ? "TEAM" : "USER"}
            showSlider={m.hasOwnProperty("members") ? false : true}
            icon={m.icon ? m.icon : null}
            className={m.icon ? "chat-members company" : "chat-members"}
          />
        );
      })}
      {afterMembers.length > 0 && <PlusRecipients recipients={afterMembers}></PlusRecipients>}
    </MembersListContainer>
  );
};

export default MembersLists;
