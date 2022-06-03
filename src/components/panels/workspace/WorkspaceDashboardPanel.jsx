import React from "react";
import styled from "styled-components";
import { useTranslationActions, useFetchWsCount } from "../../hooks";
import TimelinePanel from "../common/TimelinePanel";
import { DashboardAboutWorkspace, DashboardTeam, RecentPosts } from "../dashboard";

const Wrapper = styled.div`
  overflow-x: auto;
  min-height: calc(100vh - 100px);
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  .container-inner {
    overflow-x: scroll;
  }
  h5 {
    text-align: left;
  }
`;

const WorkspaceDashboardPanel = (props) => {
  const { className = "", isExternal, isMember, match, actions, workspaceTimeline, workspace } = props;

  const { params } = match;
  const { _t } = useTranslationActions();
  const width = window.innerWidth;

  const handleEditClick = () => {
    actions.showModal(workspace, "edit", "workspace");
  };

  useFetchWsCount();

  const dictionary = {
    aboutThisWorkspace: _t("DASHBOARD.ABOUT_THIS_WORKSPACE", "About this workspace"),
    team: _t("TEAM", "Team"),
    timeline: _t("TIMELINE", "Timeline"),
    noRecentPosts: _t("DASHBOARD.NO_RECENT_POSTS", "No recent posts."),
    recentPosts: _t("DASHBOARD.RECENT_POSTS", "Recent posts"),
    fileAttachments: _t("FILE_ATTACHMENTS", "File attachments"),
    peopleExternal: _t("PEOPLE.EXTERNAL", "External"),
    peopleInvited: _t("PEOPLE.INVITED", "Invited"),
    emptyTeam: _t("DASHBOARD.EMPTY_TEAM", "There are no team members for this workspace."),
    showMore: _t("DASHBOARD.SHOW_MORE", "Show more"),
    showLess: _t("DASHBOARD.SHOW_LESS", "Show less"),
    attachedFile: _t("ATTACHED_A_FILE", "attached a file"),
    sharedThePost: _t("SHARED_THE_POST", "shared the post"),
    hasJoined: _t("TIMELINE.HAS_JOINED", "has joined"),
    hasLeft: _t("TIMELINE.HAS_LEFT", "has left"),
    youJoined: _t("TIMELINE.YOU_JOINED", "You joined"),
    youLeft: _t("TIMELINE.YOU_LEFT", "You left"),
    isAdded: _t("TIMELINE.IS_ADDED", "is added"),
    isRemoved: _t("TIMELINE.IS_REMOVED", "is removed"),
    createdThePost: _t("TIMELINE.CREATED_POST", "created the post"),
    updatedWorkspaceTo: _t("TIMELINE.UPDATED_WORKSPACE_TO", "Updated workspace to"),
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

  let disableOptions = false;
  if (workspace && workspace.active === 0) {
    disableOptions = true;
  }

  return (
    <Wrapper className={`container-fluid container-inner fadeIn ${className}`} style={{ border: "3px solid red" }}>
      <div className={"row"}>
        {workspace === null ? (
          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
        ) : (
          <>
            {width > 620 ? (
              <>
                <div className={"col-md-6"}>
                  <DashboardAboutWorkspace isMember={isMember} workspace={workspace} onEditClick={handleEditClick} isExternal={isExternal} dictionary={dictionary} />
                  <TimelinePanel workspaceTimeline={workspaceTimeline} actions={actions} workspace={workspace} dictionary={dictionary} />
                </div>

                <div className={"col-md-6"}>
                  <DashboardTeam workspace={workspace} actions={actions} onEditClick={handleEditClick} isMember={isMember} isExternal={isExternal} dictionary={dictionary} />
                  {/* <RecentPosts posts={recentPosts} dictionary={dictionary} disableOptions={disableOptions} /> */}
                </div>
              </>
            ) : (
              <>
                <div className={"col-md-12"}>
                  <DashboardAboutWorkspace isMember={isMember} workspace={workspace} onEditClick={handleEditClick} isExternal={isExternal} dictionary={dictionary} />
                  <DashboardTeam workspace={workspace} onEditClick={handleEditClick} isMember={isMember} isExternal={isExternal} dictionary={dictionary} />
                  {/* <RecentPosts posts={recentPosts} dictionary={dictionary} disableOptions={disableOptions} /> */}
                  <TimelinePanel workspaceTimeline={workspaceTimeline} actions={actions} params={params} dictionary={dictionary} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default React.memo(WorkspaceDashboardPanel);
