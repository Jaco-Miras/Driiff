import React from "react";
import styled from "styled-components";
import { useCompanyDashboard, useCompanyPosts, useTranslation } from "../../hooks";
import { CompanyDashboardTeam, CompanyRecentPosts } from "../dashboard";
import { CompanyTimelinePanel } from "../common";

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

const CompanyDashboardPanel = (props) => {
  const { className = "", match, actions } = props;

  const { params } = match;
  const { _t } = useTranslation();
  const { timelineInit, timelineItems: timeline, recentPostsInit } = useCompanyDashboard();
  const { posts } = useCompanyPosts();
  const width = window.innerWidth;

  const dictionary = {
    aboutThisWorkspace: _t("DASHBOARD.ABOUT_THIS_WORKSPACE", "About this workspace"),
    team: _t("TEAM", "Team"),
    timeline: _t("TIMELINE", "Timeline"),
    noRecentPosts: _t("DASHBOARD.NO_RECENT_POSTS", "No recent posts."),
    recentPosts: _t("DASHBOARD.RECENT_POSTS", "Recent posts"),
    fileAttachments: _t("FILE_ATTACHMENTS", "File attachments"),
    attachedFile: _t("ATTACHED_A_FILE", "attached a file"),
    sharedThePost: _t("SHARED_THE_POST", "shared the post"),
    hasJoined: _t("TIMELINE.HAS_JOINED", "has joined"),
    hasLeft: _t("TIMELINE.HAS_LEFT", "has left"),
    youJoined: _t("TIMELINE.YOU_JOINED", "You joined"),
    youLeft: _t("TIMELINE.YOU_LEFT", "You left"),
    isAdded: _t("TIMELINE.IS_ADDED", "is added"),
    isRemoved: _t("TIMELINE.IS_REMOVED", "is removed"),
    createdThePost: _t("TIMELINE.CREATED_POST", "created the post"),
    isAddedToCompany: _t("TIMELINE.IS_ADDED_TO_COMPANY", "is added to the company"),
    updatedWorkspaceTo: _t("TIMELINE.UPDATED_WORKSPACE_TO", "Updated workspace to"),
    revokeAsTeamLead: _t("TEAM.REVOKE_TEAM_LEAD", "Revoke as team lead"),
    revokeAsApprover: _t("TEAM.REVOKE_APPROVER", "Revoke as approver"),
    assignAsTeamLead: _t("TEAM.REVOKE_TEAM_LEAD", "Assign as team lead"),
    assignAsApprover: _t("TEAM.REVOKE_APPROVER", "Assign as approver"),
    remove: _t("TEAM.REMOVE", "Remove"),
    showMore: _t("SHOW_MORE", "Show more"),
    showLess: _t("SHOW_LESS", "Show less"),
  };

  return (
    <Wrapper className={`container-fluid h-100 fadeIn ${className}`}>
      <div className={"row"}>
        {width > 620 ? (
          <>
            <div className={"col-md-6"}>
              <CompanyTimelinePanel init={timelineInit} timeline={timeline} actions={actions} params={params} dictionary={dictionary} />
            </div>
            <div className={"col-md-6"}>
              <CompanyDashboardTeam dictionary={dictionary} />
              <CompanyRecentPosts posts={posts} dictionary={dictionary} />
            </div>
          </>
        ) : (
          <>
            <div className={"col-md-12"}>
              <CompanyDashboardTeam dictionary={dictionary} />
              <CompanyRecentPosts init={recentPostsInit} posts={posts} dictionary={dictionary} />
              <CompanyTimelinePanel init={timelineInit} timeline={timeline} actions={actions} params={params} dictionary={dictionary} />
            </div>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyDashboardPanel);
