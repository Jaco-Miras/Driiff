import React from "react";
import styled from "styled-components";
import {usePosts, useTranslation} from "../../hooks";
import TimelinePanel from "../common/TimelinePanel";
import {DashboardAboutWorkspace, DashboardTeam, RecentPosts} from "../dashboard";

const Wrapper = styled.div`
  overflow: auto !important;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  h5 {
    text-align: left;
  }
`;

const WorkspaceDashboardPanel = (props) => {
  const { className = "", isExternal, isMember, match, actions, workspaceTimeline, workspace } = props;

  const { params } = match;
  const { _t } = useTranslation();
  const { recentPosts } = usePosts();
  const width = window.innerWidth;

  const handleEditClick = () => {
    actions.showModal(workspace, "edit", "workspace");
  };

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
    revokeAsTeamLead: _t("TEAM.REVOKE_TEAM_LEAD", "Revoke as team lead"),
    revokeAsApprover: _t("TEAM.REVOKE_APPROVER", "Revoke as approver"),
    assignAsTeamLead: _t("TEAM.REVOKE_TEAM_LEAD", "Assign as team lead"),
    assignAsApprover: _t("TEAM.REVOKE_APPROVER", "Assign as approver"),
    remove: _t("TEAM.REMOVE", "Remove")
  };

  let disableOptions = false;
  if (workspace && workspace.active === 0) {
    disableOptions = true;
  }

  return (
    <Wrapper className={`container-fluid fadeIn ${className}`}>
      <div className={"row"}>
        {
          workspace === null ?
            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"/>
            :
            <>{width > 620 ? (
              <>
                <div className={"col-md-6"}>
                  <DashboardAboutWorkspace isMember={isMember} workspace={workspace} onEditClick={handleEditClick}
                                           isExternal={isExternal} dictionary={dictionary}/>
                  <TimelinePanel workspaceTimeline={workspaceTimeline} actions={actions} workspace={workspace}
                                 dictionary={dictionary}/>
                </div>

                <div className={"col-md-6"}>
                  <DashboardTeam workspace={workspace} actions={actions} onEditClick={handleEditClick}
                                 isMember={isMember} isExternal={isExternal} dictionary={dictionary}/>
                  <RecentPosts posts={recentPosts} dictionary={dictionary} disableOptions={disableOptions}/>
                </div>
              </>
            ) : (
              <>
                <div className={"col-md-12"}>
                  <DashboardAboutWorkspace isMember={isMember} workspace={workspace} onEditClick={handleEditClick}
                                           isExternal={isExternal} dictionary={dictionary}/>
                  <DashboardTeam workspace={workspace} onEditClick={handleEditClick} isMember={isMember}
                                 isExternal={isExternal} dictionary={dictionary}/>
                  <RecentPosts posts={recentPosts} dictionary={dictionary} disableOptions={disableOptions}/>
                  <TimelinePanel workspaceTimeline={workspaceTimeline} actions={actions} params={params}
                                 dictionary={dictionary}/>
                </div>
              </>
            )}</>
        }
      </div>
    </Wrapper>
  );
};

export default React.memo(WorkspaceDashboardPanel);
