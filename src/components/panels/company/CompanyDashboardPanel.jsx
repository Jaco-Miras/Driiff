import React from "react";
import styled from "styled-components";
import {useCompanyDashboard, useCompanyPosts, useTranslation} from "../../hooks";
import {CompanyDashboardTeam, CompanyRecentPosts} from "../dashboard";
import {CompanyTimelinePanel} from "../common";

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
  const {className = "", match, actions} = props;

  const {params} = match;
  const {_t} = useTranslation();
  const {timelineInit, timelineItems: timeline, recentPostsInit, recentPostsItems, membersInit, membersItems} = useCompanyDashboard();
  const {posts} = useCompanyPosts();
  const width = window.innerWidth;

  const dictionary = {
    aboutThisWorkspace: _t("DASHBOARD.ABOUT_THIS_WORKSPACE", "About this workspace"),
    team: _t("TEAM", "Team"),
    timeline: _t("TIMELINE", "Timeline"),
    noRecentPosts: _t("DASHBOARD.NO_RECENT_POSTS", "No recent posts."),
    recentPosts: _t("DASHBOARD.RECENT_POSTS", "Recent posts"),
    fileAttachments: _t("FILE_ATTACHMENTS", "File attachments"),
  };

  return (
    <Wrapper className={`container-fluid h-100 fadeIn ${className}`}>
      <div className={"row"}>
        {width > 620 ? (
          <>
            <div className={"col-md-6"}>
              <CompanyTimelinePanel
                init={timelineInit}
                timeline={timeline}
                actions={actions}
                params={params}
                dictionary={dictionary}/>
            </div>
            <div className={"col-md-6"}>
              <CompanyDashboardTeam
                dictionary={dictionary}/>
              <CompanyRecentPosts
                posts={posts}
                dictionary={dictionary}/>
            </div>
          </>
        ) : (
          <>
            <div className={"col-md-12"}>
              <CompanyDashboardTeam
                dictionary={dictionary}/>
              <CompanyRecentPosts
                init={recentPostsInit}
                posts={posts}
                dictionary={dictionary}/>
              <CompanyTimelinePanel
                init={timelineInit}
                timeline={timeline}
                actions={actions}
                params={params}
                dictionary={dictionary}/>
            </div>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyDashboardPanel);
