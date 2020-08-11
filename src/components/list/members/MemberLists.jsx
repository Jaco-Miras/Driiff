import React from "react";
import styled from "styled-components";
import {Avatar, PlusRecipients} from "../../common";

const MembersListContainer = styled.div`
  .people-list {
    right: 0;
  }
`;

const StyledAvatar = styled(Avatar)`
  height: 2rem !important;
  width: 2rem !important;
  margin-left: ${(props) => (props.firstUser ? "0" : "-0.5rem")};
`;

const MembersLists = (props) => {

  const { members } = props;

  const firstFiveMembers = members.slice(0, 5);
  const afterFiveMembers = members.slice(5);

  return (
    <MembersListContainer className={"d-flex"}>
      {
        firstFiveMembers.map((m, i) => {
            return <StyledAvatar id={m.id} firstUser={i === 0} className="chat-members" key={m.id}
                                name={m.name ? m.name : m.email} imageLink={m.profile_image_link} hasAccepted={m.has_accepted}/>
        })
      }
      {
        afterFiveMembers.length != null && afterFiveMembers[0] && <PlusRecipients recipients={afterFiveMembers}></PlusRecipients>
      }
    </MembersListContainer>
  );
};

export default React.memo(MembersLists);
