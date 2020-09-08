import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Avatar, Badge } from "../../../common";
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
    height: 2.5rem;
    width: 2.5rem;
  }
  .profile-name {
    cursor: pointer;
    margin-bottom: 4px;
  }
  > .more-options svg {
    width: auto;
  }
  .more-options-tooltip {
    display: none;
    right: calc(100% + 5px);
    left: auto;
  }
  &:hover {
    .more-options-tooltip {
      display: block;
    }
  }
`;

const TeamListItem = (props) => {
  const { className = "", member, parentRef, onEditClick, hideOptions, actions, workspace_id, dictionary } = props;

  const history = useHistory();

  const handleClickName = () => {
    if (member.has_accepted) {
      history.push(`/profile/${member.id}/${member.name}`);
    }
  };

  const handleAddRole = (role) => {
    let payload = {
      topic_id: workspace_id,
      user_id: member.id,
      role,
    };
    actions.addRole(payload);
  };

  const handleRemoveRole = () => {
    let payload = {
      topic_id: workspace_id,
      user_id: member.id,
    };
    actions.deleteRole(payload);
  };

  return (
    <Wrapper className={`team-list-item list-group-item d-flex align-items-center p-l-r-0 ${className}`}>
      <div className="d-flex align-items-center ">
        <div className="pr-3">
          <Avatar id={member.id} name={member.name} imageLink={member.profile_image_link} partialName={member.partial_name} noDefaultClick={!member.has_accepted} hasAccepted={member.has_accepted} />
        </div>
        <div>
          <h6 className="profile-name" onClick={handleClickName}>
            {member.has_accepted ? member.name : member.email}
          </h6>
          {member.designation && <small className="text-muted">{member.designation}</small>}
        </div>
      </div>
      <div className="ml-auto">
        {member.workspace_role && member.workspace_role !== "" && (
          <Badge badgeClassName={member.workspace_role === "TEAM_LEAD" ? "badge-success text-white" : "badge-warning text-white"} label={member.workspace_role === "TEAM_LEAD" ? "Team lead" : "Approver"} />
        )}
        {member.type === "external" && <Badge badgeClassName="badge-info text-white" label={member.has_accepted ? dictionary.peopleExternal : dictionary.peopleInvited} />}
      </div>
      {!hideOptions && (
        <MoreOptions moreButton="more-vertical" scrollRef={parentRef}>
          {member.workspace_role !== "" && member.workspace_role === "TEAM_LEAD" && <div onClick={handleRemoveRole}>Revoke as team lead</div>}
          {member.workspace_role !== "TEAM_LEAD" && <div onClick={() => handleAddRole("team_lead")}>Assign as team lead</div>}
          {member.workspace_role !== "APPROVER" && <div onClick={() => handleAddRole("approver")}>Assign as approver</div>}
          {member.workspace_role !== "" && member.workspace_role === "APPROVER" && <div onClick={handleRemoveRole}>Revoke as approver</div>}
          <div onClick={onEditClick}>Remove</div>
        </MoreOptions>
      )}
    </Wrapper>
  );
};

export default React.memo(TeamListItem);
