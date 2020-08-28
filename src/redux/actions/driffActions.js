import dispatchActionToReducer from "../actionDispatcher";
import {
  getCompanyDashboardMembers as getCompanyDashboardMembersService,
  getCompanyDashboardRecentPosts as getCompanyDashboardRecentPostsService,
  getCompanyDashboardTimeline as getCompanyDashboardTimelineService,
  patchCheckDriff as patchCheckDriffService,
  postRegisterDriff as postRegisterDriffService,
} from "../services";

export const postRegisterDriff = (payload, callback) => {
  return dispatchActionToReducer(postRegisterDriffService(payload), "REGISTER_DRIFF_START", "REGISTER_DRIFF_SUCCESS", "REGISTER_DRIFF_FAILURE", callback);
};

export const patchCheckDriff = (payload, callback) => {
  return dispatchActionToReducer(patchCheckDriffService(payload), "CHECK_DRIFF_START", "CHECK_DRIFF_SUCCESS", "CHECK_DRIFF_FAILURE", callback);
};

export const getCompanyDashboardTimeline = (payload, callback) => {
  return dispatchActionToReducer(getCompanyDashboardTimelineService(payload), "GET_COMPANY_DASHBOARD_TIMELINE_START", "GET_COMPANY_DASHBOARD_TIMELINE_SUCCESS", "GET_COMPANY_DASHBOARD_TIMELINE_FAILURE", callback);
};

export const getCompanyDashboardRecentPosts = (payload, callback) => {
  return dispatchActionToReducer(getCompanyDashboardRecentPostsService(payload), "GET_COMPANY_DASHBOARD_RECENT_POST_START", "GET_COMPANY_DASHBOARD_RECENT_POST_SUCCESS", "GET_COMPANY_DASHBOARD_RECENT_POST_FAILURE", callback);
};

export const getCompanyDashboardMembers = (payload, callback) => {
  return dispatchActionToReducer(getCompanyDashboardMembersService(payload), "GET_COMPANY_DASHBOARD_MEMBERS_START", "GET_COMPANY_DASHBOARD_MEMBERS_SUCCESS", "GET_COMPANY_DASHBOARD_MEMBERS_FAILURE", callback);
};

