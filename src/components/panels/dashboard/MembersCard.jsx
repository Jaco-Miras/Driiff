import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import TeamListItem from "../../list/people/item/TeamListItem";
import { useWorkspaceActions, useToaster, useTranslationActions } from "../../hooks";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  height: 100%;
  > span {
    display: flex;
    align-items: center;
    font-weight: 600;
  }
  .feather {
    width: 1rem;
    height: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(100% - 20px);
    ::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 7px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.5);
      -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    }
    &.list-group li.list-group-item {
      padding: 0.5rem;
      position: static;
    }
    .more-options {
      position: static;
    }
    .more-options-tooltip {
      right: 50px;
    }
  }
`;

const MembersCard = (props) => {
  const { workspace } = props;
  const { _t } = useTranslationActions();
  const dictionary = {
    team: _t("TEAM", "Team"),
    timeline: _t("TIMELINE", "Timeline"),
    peopleExternal: _t("PEOPLE.EXTERNAL", "External"),
    peopleInvited: _t("PEOPLE.INVITED", "Invited"),
    emptyTeam: _t("DASHBOARD.EMPTY_TEAM", "There are no team members for this workspace."),
    showMore: _t("DASHBOARD.SHOW_MORE", "Show more"),
    showLess: _t("DASHBOARD.SHOW_LESS", "Show less"),
    remove: _t("TEAM.REMOVE", "Remove"),
    leave: _t("TEAM.LEAVE", "Leave"),
    leaveWorkspace: _t("TOASTER.LEAVE_WORKSPACE", "You have left #"),
    archived: _t("TIMELINE.ARCHIVED", "archived"),
    unarchived: _t("TIMELINE.UNARCHIVED", "unarchived"),
    workspace: _t("TIMELINE.WORKSPACE", "workspace"),
    created: _t("TIMELINE.CREATED", "created"),
    resend: _t("TEAM.RESEND", "Resend"),
    cancel: _t("MODAL.CANCEL", "Cancel"),
    resendInvite: _t("MODAL.RESEND_INVITE", "Resend invite"),
    resendInviteConfirmation: _t("MODAL.RESEND_INVITE_CONFIRMATION", "Are you sure you want to resend invite to this email:"),
    invitationSent: _t("TOASTER.INVITE_SENT", "Invitation sent"),
    assignAsAdvisor: _t("TEAM.ASSIGN_ADVISOR", "Assign as advisor"),
    assignAsApprover: _t("TEAM.ASSIGN_APPROVER", "Assign as approver"),
    assignAsClient: _t("TEAM.ASSIGN_CLIENT", "Assign as client"),
    assignAsCommunicationLead: _t("TEAM.ASSIGN_COMMUNICATION_LEAD", "Assign as communication lead"),
    assignAsDesigner: _t("TEAM.ASSIGN_DESIGNER", "Assign as designer"),
    assignAsDeveloper: _t("TEAM.ASSIGN_DEVELOPER", "Assign as developer"),
    assignAsFreelancer: _t("TEAM.ASSIGN_FREELANCER", "Assign as freelancer"),
    assignAsSupervisor: _t("TEAM.ASSIGN_SUPERVISOR", "Assign as supervisor"),
    assignAsTeamLead: _t("TEAM.ASSIGN_TEAM_LEAD", "Assign as team lead"),
    assignAsTechnicalAdvisor: _t("TEAM.ASSIGN_TECHNICAL_ADVISOR", "Assign as technical advisor"),
    assignAsTechnicalLead: _t("TEAM.ASSIGN_TECHNICAL_LEAD", "Assign as technical lead"),
    assignAsWatcher: _t("TEAM.ASSIGN_WATCHER", "Assign as watcher"),
    revokeAsAdvisor: _t("TEAM.REVOKE_ADVISOR", "Revoke as advisor"),
    revokeAsApprover: _t("TEAM.REVOKE_APPROVER", "Revoke as approver"),
    revokeAsClient: _t("TEAM.REVOKE_CLIENT", "Revoke as client"),
    revokeAsCommunicationLead: _t("TEAM.REVOKE_COMMUNICATION_LEAD", "Revoke as communication lead"),
    revokeAsDesigner: _t("TEAM.REVOKE_DESIGNER", "Revoke as designer"),
    revokeAsDeveloper: _t("TEAM.REVOKE_DEVELOPER", "Revoke as developer"),
    revokeAsFreelancer: _t("TEAM.REVOKE_FREELANCER", "Revoke as freelancer"),
    revokeAsSupervisor: _t("TEAM.REVOKE_SUPERVISOR", "Revoke as supervisor"),
    revokeAsTeamLead: _t("TEAM.REVOKE_TEAM_LEAD", "Revoke as team lead"),
    revokeAsTechnicalAdvisor: _t("TEAM.REVOKE_TECHNICAL_ADVISOR", "Revoke as technical advisor"),
    revokeAsTechnicalLead: _t("TEAM.REVOKE_TECHNICAL_LEAD", "Revoke as technical lead"),
    revokeAsWatcher: _t("TEAM.REVOKE_WATCHER", "Revoke as watcher"),
    roleAdvisor: _t("ROLE.ADVISOR", "Advisor"),
    roleApprover: _t("ROLE.APPROVER", "Approver"),
    roleClient: _t("ROLE.CLIENT", "Client"),
    roleCommunicationLead: _t("ROLE.COMMUNICATION_LEAD", "Communication lead"),
    roleDesigner: _t("ROLE.DESIGNER", "Designer"),
    roleDeveloper: _t("ROLE.DEVELOPER", "Developer"),
    roleFreelancer: _t("ROLE.FREELANCER", "Freelancer"),
    roleSupervisor: _t("ROLE.SUPERVISOR", "Supervisor"),
    roleTeamLead: _t("ROLE.TEAM_LEAD", "Team lead"),
    roleTechnicalAdvisor: _t("ROLE.TECHNICAL_ADVISOR", "Technical advisor"),
    roleTechnicalLead: _t("ROLE.TECHNICAL_LEAD", "Technical lead"),
    roleWatcher: _t("ROLE.WATCHER", "Watcher"),
    sendInviteManually: _t("TEAM.SEND_INVITE_MANUALLY", "Send invite manually"),
    openPost: _t("SYSTEM.OPEN_POST", "Open post"),
  };
  const toaster = useToaster();
  const loggedUser = useSelector((state) => state.session.user);
  const actions = useWorkspaceActions();

  const onLeaveWorkspace = (workspace, member) => {
    let callback = (err, res) => {
      if (err) return;
      toaster.success(
        <>
          {dictionary.leaveWorkspace}
          <b>{workspace.name}</b>
        </>
      );
    };
    actions.leave(workspace, member, callback);
  };

  const onAddRole = (member, role) => {
    let payload = {
      topic_id: workspace.id,
      user_id: member.id,
      role,
    };
    actions.addRole(payload);
  };

  if (!workspace) return null;
  return (
    <Wrapper>
      <span>
        <SvgIconFeather icon="user" className="mr-2" /> <h5 className="card-title mb-0">{dictionary.team}</h5>{" "}
      </span>
      <ul className="list-group list-group-flush mt-2">
        {workspace.members.map((member, i) => {
          return (
            <TeamListItem
              key={member.id}
              member={member}
              onLeaveWorkspace={onLeaveWorkspace}
              onAddRole={onAddRole}
              hideOptions={false}
              actions={actions}
              workspace_id={workspace.id}
              dictionary={dictionary}
              showMoreButton={false}
              showLessButton={false}
              loggedUser={loggedUser}
              workspace={workspace}
            />
          );
        })}
      </ul>
    </Wrapper>
  );
};

export default MembersCard;
