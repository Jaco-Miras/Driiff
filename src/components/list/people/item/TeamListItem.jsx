import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Avatar, Badge, SvgIconFeather } from "../../../common";
import { MoreOptions } from "../../../panels/common";
import { replaceChar } from "../../../../helpers/stringFormatter";
import { addToModals } from "../../../../redux/actions/globalActions";
import { postResendInvite } from "../../../../redux/actions/workspaceActions";
import { useToaster, useTranslationActions } from "../../../hooks";
import { copyTextToClipboard } from "../../../../helpers/commonFunctions";
import { Viewers } from "../../post/item";

const Wrapper = styled.li`
  .card-title {
    position: relative;
    .feather-edit {
      right: 0;
      width: 16px;
      position: absolute;
    }
  }
  > div:first-child {
    max-width: calc(100% - 25px);
  }
  .more-options {
    display: none;
    min-width: 25px;
  }
  .avatar {
    cursor: pointer;
  }
  .profile-name {
    cursor: pointer;
    margin-bottom: 0;
  }
  .name-designation-badge {
    display: flex;
    flex-flow: column;
    max-width: calc(100% - 50px);
    .badge {
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
    }
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
    .more-options {
      display: block;
    }
    .more-options-tooltip {
      display: block;
      top: unset;
      bottom: 0;
    }
  }
  .user-reads-container {
    position: relative;
    display: inline-flex;
    margin-right: 0.5rem;

    .not-read-users-container,
    .read-users-container {
      transition: all 0.5s ease;
      position: absolute;
      right: 0;
      top: 30px;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      background-color: #fff;
      overflow: auto;
      opacity: 0;
      max-height: 0;
      z-index: 2;

      &:hover {
        opacity: 1;
        max-height: 175px;
      }

      .dark & {
        background-color: #25282c;
        border: 1px solid #25282c;
      }

      .avatar {
        min-width: 2.7rem;
        min-height: 2.7rem;
      }

      > span {
        padding: 0.5rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .name {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }
      }
    }
  }

  .user-reads-container {
    span.not-readers:hover ~ span.not-read-users-container,
    .no-readers:hover ~ span.read-users-container {
      opacity: 1;
      max-height: 175px;
      z-index: 2;
    }
  }
`;

const ShowMoreBtn = styled.div`
  text-align: center;
  position: absolute;
  bottom: -30px;
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

const StyledBadge = styled(Badge)`
  .badge {
    background: ${(props) => {
      switch (props.role) {
        case "APPROVER": {
          return "#00CDAC";
        }
        case "CLIENT": {
          return "#4DD091";
        }
        case "COMMUNICATION_LEAD": {
          return "#00B0BA";
        }
        case "DEVELOPER": {
          return "#0065A2";
        }
        case "DESIGNER": {
          return "#FF60A8";
        }
        case "FREELANCER": {
          return "#C05780";
        }
        case "SUPERVISOR": {
          return "#FC6238";
        }
        case "TEAM_LEAD": {
          return "#CFF800";
        }
        case "TECHNICAL_ADVISOR": {
          return "#FFA23A";
        }
        case "TECHNICAL_LEAD": {
          return "#6C88C4";
        }
        case "WATCHER": {
          return "#FFEC59";
        }
        case "SHARED_TEAM_LEAD": {
          return "#33b5e5";
        }
        default:
          return "#fb3";
      }
    }};
  }
`;

const TeamListItem = (props) => {
  const {
    className = "",
    member,
    hideOptions,
    actions,
    workspace_id,
    dictionary,
    showMoreButton,
    showLessButton,
    toggleShow,
    loggedUser,
    onLeaveWorkspace = null,
    workspace = null,
    scrollRef,
    onAddRole = null,
    isSharedWorkspace = false,
  } = props;

  const history = useHistory();
  const dispatch = useDispatch();
  const toaster = useToaster();

  const [showViewer, setShowViewer] = useState(false);

  const { _t } = useTranslationActions();

  const handleClickName = () => {
    if (member.has_accepted && !isSharedWorkspace) {
      history.push(`/profile/${member.id}/${replaceChar(member.name)}`);
    }
  };

  const handleRemoveRole = () => {
    let payload = {
      topic_id: workspace_id,
      user_id: member.id,
    };
    actions.deleteRole(payload);
  };

  const handleResendEmail = () => {
    let payload = {
      topic_id: workspace_id,
      emails: [member.email],
    };
    dispatch(
      postResendInvite(payload, (err, res) => {
        if (err) return;
        toaster.success(dictionary.invitationSent);
      })
    );
  };

  const handleResendInvite = () => {
    let payload = {
      type: "confirmation",
      headerText: dictionary.resendInvite,
      submitText: dictionary.resend,
      cancelText: dictionary.cancel,
      bodyText: `${dictionary.resendInviteConfirmation} ${member.email}?`,
      actions: {
        onSubmit: handleResendEmail,
      },
    };

    dispatch(addToModals(payload));
  };

  const handleCopyInviteLink = () => {
    copyTextToClipboard(toaster, member.invite_link);
  };

  const roleDisplay = () => {
    switch (member.workspace_role) {
      case "ADVISOR": {
        return dictionary.roleAdvisor;
      }
      case "APPROVER": {
        return dictionary.roleApprover;
      }
      case "CLIENT": {
        return dictionary.roleClient;
      }
      case "COMMUNICATION_LEAD": {
        return dictionary.roleCommunicationLead;
      }
      case "DEVELOPER": {
        return dictionary.roleDeveloper;
      }
      case "DESIGNER": {
        return dictionary.roleDesigner;
      }
      case "FREELANCER": {
        return dictionary.roleFreelancer;
      }
      case "SUPERVISOR": {
        return dictionary.roleSupervisor;
      }
      case "TEAM_LEAD": {
        return dictionary.roleTeamLead;
      }
      case "TECHNICAL_ADVISOR": {
        return dictionary.roleTechnicalAdvisor;
      }
      case "TECHNICAL_LEAD": {
        return dictionary.roleTechnicalLead;
      }
      case "WATCHER": {
        return dictionary.roleWatcher;
      }
      default:
        return "";
    }
  };

  const isUser = member.type === "internal" || member.type === "external";

  const isNotSameDriff = workspace && workspace.slug && workspace.members && workspace.members.find((mem) => mem.id === member.id)?.slug !== workspace?.slug?.slice(0, -7);

  return (
    <Wrapper className={`team-list-item list-group-item d-flex align-items-center p-l-r-0 ${className} ${(showMoreButton || showLessButton) && "mb-3"}`}>
      <div className="d-flex align-items-center">
        <div className="pr-3">
          <Avatar
            id={member.id}
            name={member.name}
            imageLink={!isUser ? member.icon_link : member.profile_image_link}
            partialName={member.partial_name}
            noDefaultClick={!member.has_accepted || isSharedWorkspace}
            hasAccepted={member.has_accepted}
            showSlider={false}
            scrollRef={scrollRef}
            type={isUser ? "USER" : "TEAM"}
          />
        </div>
        <div className="name-designation-badge">
          {isUser && (
            <div className="d-flex">
              <h6 className="profile-name mr-2" onClick={handleClickName}>
                {!member.has_accepted && member.name === "" ? member.email : member.name}
              </h6>
              {isSharedWorkspace && isNotSameDriff && <SvgIconFeather icon="repeat" />}
            </div>
          )}
          {!isUser && (
            <div
              className="user-reads-container"
              role="button"
              onClick={() => {
                setShowViewer((prev) => !prev);
              }}
            >
              <h6 className="no-readers profile-name">
                {dictionary.team} {member.name} {!isUser && _t("PEOPLE.TEAM_MEMBERS_NUMBER", "(::number:: members)", { number: member.members.length })}
              </h6>
              <Viewers users={member.members} close={() => setShowViewer(false)} show={showViewer} />
            </div>
          )}
          {member.type === "internal" && member.designation && <small className="text-muted">{member.designation}</small>}
          {member.type === "external" && member.external_company_name && <small className="text-muted">{member.external_company_name}</small>}
          <div className="badge-container">
            {member.workspace_role}
            {isSharedWorkspace && member.is_creator && <StyledBadge role={"SHARED_TEAM_LEAD"} badgeClassName={"text-white"} label={dictionary.roleTeamLead} />}
            {member.workspace_role && member.workspace_role !== "" && (
              <StyledBadge role={member.workspace_role} badgeClassName={member.workspace_role === "WATCHER" || member.workspace_role === "TEAM_LEAD" ? "text-dark" : "text-white"} label={roleDisplay()} />
            )}
            {member.type === "external" && loggedUser.type !== "external" && member.has_accepted && <Badge badgeClassName="badge-warning text-white" label={dictionary.peopleExternal} />}
            {member.type === "external" && !member.has_accepted && <Badge badgeClassName="badge-warning text-white" label={dictionary.peopleInvited} />}
            {member.type === "external" && loggedUser.type !== "external" && !member.has_accepted && <Badge badgeClassName="badge-warning text-white" label={dictionary.peopleExternal} />}
          </div>
        </div>
      </div>

      {showMoreButton && (
        <ShowMoreBtn className="btn-toggle-show">
          <button className="btn btn-primary cursor-pointer" onClick={toggleShow}>
            {dictionary.showMore}
          </button>
        </ShowMoreBtn>
      )}
      {showLessButton && (
        <ShowMoreBtn className="btn-toggle-show">
          <button className="btn btn-primary cursor-pointer" onClick={toggleShow}>
            {dictionary.showLess}
          </button>
        </ShowMoreBtn>
      )}
      {!hideOptions && isUser && (
        <MoreOptions moreButton="more-horizontal" width={250} className="ml-auto">
          {/* {member.workspace_role !== "ADVISOR" && <div onClick={() => onAddRole(member, "advisor")}>{dictionary.assignAsAdvisor}</div>}
          {member.workspace_role === "ADVISOR" && <div onClick={handleRemoveRole}>{dictionary.revokeAsAdvisor}</div>} */}
          {member.workspace_role !== "APPROVER" && <div onClick={() => onAddRole(member, "approver")}>{dictionary.assignAsApprover}</div>}
          {member.workspace_role === "APPROVER" && <div onClick={handleRemoveRole}>{dictionary.revokeAsApprover}</div>}
          {member.workspace_role !== "CLIENT" && <div onClick={() => onAddRole(member, "client")}>{dictionary.assignAsClient}</div>}
          {member.workspace_role === "CLIENT" && <div onClick={handleRemoveRole}>{dictionary.revokeAsClient}</div>}
          {member.workspace_role !== "COMMUNICATION_LEAD" && <div onClick={() => onAddRole(member, "communication_lead")}>{dictionary.assignAsCommunicationLead}</div>}
          {member.workspace_role === "COMMUNICATION_LEAD" && <div onClick={handleRemoveRole}>{dictionary.revokeAsCommunicationLead}</div>}
          {member.workspace_role !== "DESIGNER" && <div onClick={() => onAddRole(member, "designer")}>{dictionary.assignAsDesigner}</div>}
          {member.workspace_role === "DESIGNER" && <div onClick={handleRemoveRole}>{dictionary.revokeAsDesigner}</div>}
          {member.workspace_role !== "DEVELOPER" && <div onClick={() => onAddRole(member, "developer")}>{dictionary.assignAsDeveloper}</div>}
          {member.workspace_role === "DEVELOPER" && <div onClick={handleRemoveRole}>{dictionary.revokeAsDeveloper}</div>}
          {member.workspace_role !== "FREELANCER" && <div onClick={() => onAddRole(member, "freelancer")}>{dictionary.assignAsFreelancer}</div>}
          {member.workspace_role === "FREELANCER" && <div onClick={handleRemoveRole}>{dictionary.revokeAsFreelancer}</div>}
          {member.workspace_role !== "SUPERVISOR" && <div onClick={() => onAddRole(member, "supervisor")}>{dictionary.assignAsSupervisor}</div>}
          {member.workspace_role === "SUPERVISOR" && <div onClick={handleRemoveRole}>{dictionary.revokeAsSupervisor}</div>}
          {member.workspace_role !== "TEAM_LEAD" && <div onClick={() => onAddRole(member, "team_lead")}>{dictionary.assignAsTeamLead}</div>}
          {member.workspace_role === "TEAM_LEAD" && <div onClick={handleRemoveRole}>{dictionary.revokeAsTeamLead}</div>}
          {member.workspace_role !== "TECHNICAL_ADVISOR" && <div onClick={() => onAddRole(member, "technical_advisor")}>{dictionary.assignAsTechnicalAdvisor}</div>}
          {member.workspace_role === "TECHNICAL_ADVISOR" && <div onClick={handleRemoveRole}>{dictionary.revokeAsTechnicalAdvisor}</div>}
          {member.workspace_role !== "TECHNICAL_LEAD" && <div onClick={() => onAddRole(member, "technical_lead")}>{dictionary.assignAsTechnicalLead}</div>}
          {member.workspace_role === "TECHNICAL_LEAD" && <div onClick={handleRemoveRole}>{dictionary.revokeAsTechnicalLead}</div>}
          {member.workspace_role !== "WATCHER" && <div onClick={() => onAddRole(member, "watcher")}>{dictionary.assignAsWatcher}</div>}
          {member.workspace_role === "WATCHER" && <div onClick={handleRemoveRole}>{dictionary.revokeAsWatcher}</div>}
          {member.id === loggedUser.id && <div onClick={() => onLeaveWorkspace(workspace, member)}>{dictionary.leave}</div>}
          {member.id !== loggedUser.id && loggedUser.type === "internal" && <div onClick={() => onLeaveWorkspace(workspace, member)}>{dictionary.remove}</div>}
          {!member.has_accepted && member.type === "external" && <div onClick={handleResendInvite}>{dictionary.resendInvite}</div>}
          {!member.has_accepted && member.type === "external" && member.invite_link && <div onClick={handleCopyInviteLink}>{dictionary.sendInviteManually}</div>}
        </MoreOptions>
      )}
      {!hideOptions && !isUser && (
        <MoreOptions moreButton="more-horizontal" width={250}>
          <div onClick={() => onLeaveWorkspace(workspace, member)}>{dictionary.remove}</div>
        </MoreOptions>
      )}
    </Wrapper>
  );
};

export default React.memo(TeamListItem);
