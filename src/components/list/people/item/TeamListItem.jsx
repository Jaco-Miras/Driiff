import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Avatar, Badge } from "../../../common";
import { MoreOptions } from "../../../panels/common";
import { replaceChar } from "../../../../helpers/stringFormatter";

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

const ShowMoreBtn = styled.div`
  text-align: center;
  position: absolute;
  bottom: -10px;
  z-index: 2;
  width: 100%;
  > span {
    background: #fff;
    padding: 10px;
    .dark & {
      background: #191c20;
    }
  }
`;

const TeamListItem = (props) => {
  const { className = "", member, parentRef, hideOptions, actions, workspace_id, dictionary, showMoreButton, showLessButton, toggleShow, loggedUser, onLeaveWorkspace = null, workspace = null } = props;

  const history = useHistory();

  const handleClickName = () => {
    if (member.has_accepted) {
      history.push(`/profile/${member.id}/${replaceChar(member.name)}`);
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
          <Avatar
            id={member.id}
            name={member.name}
            imageLink={member.profile_image_thumbnail_link ? member.profile_image_thumbnail_link : member.profile_image_link}
            partialName={member.partial_name}
            noDefaultClick={!member.has_accepted}
            hasAccepted={member.has_accepted}
          />
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
        {member.type === "external" && loggedUser.type !== "external" && <Badge badgeClassName="badge-info text-white" label={member.has_accepted ? dictionary.peopleExternal : dictionary.peopleInvited} />}
      </div>
      {showMoreButton && (
        <ShowMoreBtn className="btn-toggle-show">
          <span className="cursor-pointer" onClick={toggleShow}>
            {dictionary.showMore}
          </span>
        </ShowMoreBtn>
      )}
      {showLessButton && (
        <ShowMoreBtn className="btn-toggle-show">
          <span className="cursor-pointer" onClick={toggleShow}>
            {dictionary.showLess}
          </span>
        </ShowMoreBtn>
      )}
      {!hideOptions && (
        <MoreOptions moreButton="more-horizontal" scrollRef={parentRef}>
          {member.workspace_role !== "" && member.workspace_role === "TEAM_LEAD" && <div onClick={handleRemoveRole}>{dictionary.revokeAsTeamLead}</div>}
          {member.workspace_role !== "TEAM_LEAD" && <div onClick={() => handleAddRole("team_lead")}>{dictionary.assignAsTeamLead}</div>}
          {member.workspace_role !== "APPROVER" && <div onClick={() => handleAddRole("approver")}>{dictionary.assignAsApprover}</div>}
          {member.workspace_role !== "" && member.workspace_role === "APPROVER" && <div onClick={handleRemoveRole}>{dictionary.revokeAsApprover}</div>}
          <div onClick={() => onLeaveWorkspace(workspace, member)}>{member.id === loggedUser.id ? dictionary.leave : dictionary.remove}</div>
        </MoreOptions>
      )}
    </Wrapper>
  );
};

export default React.memo(TeamListItem);
