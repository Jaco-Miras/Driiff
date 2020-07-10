import React, { useState } from "react";
import styled from "styled-components";
import UserListPopUp from "./UserListPopUp";

const PlusRecipientsDiv = styled.div`
  display: inline-block;
  height: 2.5rem;
  width: 2.5rem;
  margin-left: -0.5rem;
  position: relative;
`;
const TotalPeopleCircle = styled.span`
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background: #ffffff;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
  cursor: pointer;
`;

const StyledUserListPopUp = styled(UserListPopUp)`
  position: absolute;
  top: 100%;
  padding-top: 8px;
  max-width: 250px;
  z-index: 999;
  ul li > span {
    padding-left: 8px;
  }
`;

const PlusRecipients = (props) => {
  const { className = "", recipients } = props;
  const [showUsersPopUp, setShowUsersPopUp] = useState(false);
  const handleShowSeenUsers = () => setShowUsersPopUp(!showUsersPopUp);

  return (
    <PlusRecipientsDiv className={`plus-recipient-component ${className}`}>
      <TotalPeopleCircle onClick={handleShowSeenUsers}>
        <span>+</span>
        {recipients.length}
      </TotalPeopleCircle>
      {showUsersPopUp && <StyledUserListPopUp className={"peopleee-list"} users={recipients} />}
    </PlusRecipientsDiv>
  );
};

export default React.memo(PlusRecipients);
