import { useEffect } from "react";
import { useDashboardActions } from "./index";
import { useSelector } from "react-redux";

const useCompanyDashboard = () => {
  const actions = useDashboardActions();
  const { init: timelineInit, skip: timelineSkip, limit: timelineLimit, has_more: timelineHasMore, items: timelineItems } = useSelector((state) => state.dashboard.timeline);
  const { init: membersInit, skip: membersSkip, limit: membersLimit, has_more: membersHasMore, items: membersItems } = useSelector((state) => state.dashboard.members);
  const { init: recentPostsInit, skip: recentPostsSkip, limit: recentPostsLimit, has_more: recentPostsHasMore, items: recentPostsItems } = useSelector((state) => state.dashboard.recent_posts);

  const fetchMoreTimeline = (callback) => {
    if (timelineHasMore) {
      actions.fetchCompanyTimeline(
        {
          skip: timelineSkip,
          limit: timelineLimit,
        },
        callback
      );
    }
  };

  const fetchMoreRecentPosts = (callback) => {
    if (recentPostsHasMore) {
      actions.fetchCompanyRecentPosts(
        {
          skip: recentPostsSkip,
          limit: recentPostsLimit,
        },
        callback
      );
    }
  };

  const fetchMoreMembers = (callback) => {
    if (membersHasMore) {
      actions.fetchCompanyMembers(
        {
          skip: membersSkip,
          limit: membersLimit,
        },
        callback
      );
    }
  };

  useEffect(() => {
    if (!timelineInit) {
      fetchMoreTimeline();
    }
    if (!membersInit) {
      fetchMoreMembers();
    }
    if (!recentPostsInit) {
      fetchMoreRecentPosts();
    }
  }, []);

  return {
    actions,
    fetchMoreTimeline,
    fetchMoreRecentPosts,
    fetchMoreMembers,
    timelineInit,
    timelineItems,
    recentPostsInit,
    recentPostsItems,
    membersInit,
    membersItems,
  };
};

export default useCompanyDashboard;
