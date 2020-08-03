import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Avatar } from "../../../common";
import { MoreOptions } from "../../../panels/common";

const Wrapper = styled.li`
  padding: 16px 0 !important;
  .card-title {
    position: relative;
    .feather-edit {
      right: 0;
      width: 16px;
      position: absolute;
    }
  }
  .more-options {
    display: none;
  }
  .avatar {
    cursor: pointer;
    cursor: hand;
    height: 2.5rem;
    width: 2.5rem;
  }
  .profile-name {
    cursor: pointer;
    cursor: hand;
    margin-bottom: 4px;
  }
  > .more-options svg {
    width: auto;
  }
  .more-options-tooltip {
    display: none;
    &:hover {
      display: block;
    }
  }
`;

const TeamListItem = (props) => {
  const { className = "", member, parentRef, onEditClick, hideOptions } = props;

  const history = useHistory();

  const handleClickName = () => {
    if (member.has_accepted) {
      history.push(`/profile/${member.id}/${member.name}`);
    }
  };

  return (
    <Wrapper className={`team-list-item list-group-item d-flex align-items-center p-l-r-0 justify-content-between ${className}`}>
      <div className="d-flex align-items-center ">
        <div className="pr-3">
          <Avatar id={member.id} name={member.name} imageLink={member.profile_image_link} partialName={member.partial_name} noDefaultClick={!member.has_accepted}/>
        </div>
        <div>
          <h6 className="profile-name" onClick={handleClickName}>
            {member.has_accepted ? member.name : member.email}
          </h6>
          {member.designation && <small className="text-muted">{member.designation}</small>}
        </div>
      </div>
      {
        !hideOptions &&
        <MoreOptions moreButton="more-vertical" scrollRef={parentRef}>
          <div>Role</div>
          <div onClick={onEditClick}>Remove</div>
        </MoreOptions>
      }
    </Wrapper>
  );
};

export default React.memo(TeamListItem);
