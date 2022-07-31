import React, { useState } from "react";
import styled from "styled-components";
import UserListPopUp from "./UserListPopUp";

const PlusRecipientsDiv = styled.div`
  display: inline-block;
  height: 2rem;
  width: 2rem;
  margin-left: -0.5rem;
  position: relative;
  @media all and (max-width: 920px) {
  }
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
  font-size: 11px;
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
    text-overflow: ellipsis;
    max-width: 80%;
    overflow: hidden;
  }
`;

const PlusRecipients = (props) => {
  const { className = "", recipients, sharedUsers = false } = props;
  const [showUsersPopUp, setShowUsersPopUp] = useState(false);
  const handleShowSeenUsers = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowUsersPopUp(!showUsersPopUp);
  };

  return (
    <PlusRecipientsDiv className={`plus-recipient-component ${className}`}>
      <TotalPeopleCircle onClick={handleShowSeenUsers} className={"total-people-circle"}>
        <span>+</span>
        {recipients.length}
      </TotalPeopleCircle>
      {showUsersPopUp && <StyledUserListPopUp className={"people-list"} sharedUsers={sharedUsers} users={recipients} onShowList={() => setShowUsersPopUp(!showUsersPopUp)} />}
    </PlusRecipientsDiv>
  );
};

export default React.memo(PlusRecipients);
