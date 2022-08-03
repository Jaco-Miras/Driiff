import React, { useState } from "react";
import styled from "styled-components";
import { UserListPopUp } from "../../common";

const SeenIndicatorContainer = styled.div`
  text-align: ${(props) => (props.isAuthor ? "right" : "left")};
  color: #a7abc3;
  z-index: 2;
  font-size: 11px;
  position: absolute;
  bottom: -18px;
  white-space: nowrap;
  ${(props) => (props.isAuthor ? "right: 0px" : "left: 0px")};
  span {
    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme.colors.primary};
      transition: color 0.3s;
    }
  }
`;
const StyledUserListPopUp = styled(UserListPopUp)`
  position: absolute;
  bottom: 100%;
  max-width: 250px;
  left: ${(props) => (props.isAuthor ? "unset" : "5px")};
  right: ${(props) => (props.isAuthor ? "5px" : "unset")};
  z-index: 999;
  ul {
    max-height: 250px;

    li {
      display: flex;
      text-align: left;

      > span {
        margin-left: 10px;
      }
    }
  }
`;

const SeenIndicator = (props) => {
  const { isPersonal, seenMembers, isAuthor, channel } = props;
  const [showUsersPopUp, setShowUsersPopUp] = useState(false);

  const handleShowSeenUsers = () => setShowUsersPopUp(!showUsersPopUp);

  return (
    <SeenIndicatorContainer {...props}>
      {isPersonal && "seen"}
      {!isPersonal &&
        seenMembers.length === 1 &&
        `seen by ${seenMembers
          .map((m) => m.first_name)
          .slice(0, 1)
          .toString()}`}
      {!isPersonal && seenMembers.length > 1 && (
        <React.Fragment>
          seen by{" "}
          {seenMembers
            .map((m) => m.first_name)
            .slice(0, 1)
            .toString()}{" "}
          and
          <span onClick={handleShowSeenUsers}> more</span>
        </React.Fragment>
      )}
      {!isPersonal && seenMembers.length > 1 && showUsersPopUp && <StyledUserListPopUp className={"chat-seen-list"} users={seenMembers} isAuthor={isAuthor} onShowList={handleShowSeenUsers} sharedUsers={channel.slug ? true : false} />}
    </SeenIndicatorContainer>
  );
};

export default SeenIndicator;
