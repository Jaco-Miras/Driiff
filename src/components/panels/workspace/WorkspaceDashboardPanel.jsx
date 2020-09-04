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
  const {_t} = useTranslation();
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
    fileAttachments: _t("FILE_ATTACHMENTS", "File attachments")
  };

  let disableOptions = false;
  if (workspace && workspace.active === 0) {
    disableOptions = true;
  }

  return (
    <Wrapper className={`container-fluid fadeIn ${className}`}>
      <div className={"row"}>
        {width > 620 ?
          <>
            <div className={"col-md-6"}>
              <DashboardAboutWorkspace isMember={isMember} workspace={workspace} onEditClick={handleEditClick}
                                       isExternal={isExternal} dictionary={dictionary}/>
              <TimelinePanel workspaceTimeline={workspaceTimeline} actions={actions} workspace={workspace} dictionary={dictionary}/>
            </div>

            <div className={"col-md-6"}>
              <DashboardTeam workspace={workspace} actions={actions} onEditClick={handleEditClick} isMember={isMember} isExternal={isExternal} dictionary={dictionary}/>
              <RecentPosts posts={recentPosts} dictionary={dictionary} disableOptions={disableOptions}/>
            </div>
          </>
        :
          <>
            <div className={"col-md-12"}>
              <DashboardAboutWorkspace isMember={isMember} workspace={workspace} onEditClick={handleEditClick} isExternal={isExternal} dictionary={dictionary}/>
              <DashboardTeam workspace={workspace} onEditClick={handleEditClick} isMember={isMember} isExternal={isExternal} dictionary={dictionary}/>
              <RecentPosts posts={recentPosts} dictionary={dictionary} disableOptions={disableOptions}/>
              <TimelinePanel workspaceTimeline={workspaceTimeline} actions={actions} params={params} dictionary={dictionary} />
            </div>
          </>
        }
      </div>
    </Wrapper>
  );
};

export default React.memo(WorkspaceDashboardPanel);
