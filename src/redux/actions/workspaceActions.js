import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import {
  createWorkspaceTeamChannel as createWorkspaceTeamChannelService,
  createWorkspace as createWorkspaceService,
  deleteWorkspace as deleteWorkspaceService,
  deleteWorkspaceFolder as deleteWorkspaceFolderService,
  deleteWorkspaceRole as deleteWorkspaceRoleService,
  getUnreadWorkspacePostEntries as getUnreadWorkspacePostEntriesService,
  favouriteWorkspace as favouriteWorkspaceService,
  fetchDetail as fetchDetailService,
  fetchMembers as fetchMembersService,
  fetchPrimaryFiles as fetchPrimaryFilesService,
  fetchTimeline as fetchTimelineService,
  getAllWorkspace as getAllWorkspaceService,
  getPostStatusCount as getPostStatusCountService,
  getFavoriteWorkspaces as getFavoriteWorkspacesService,
  getFavoriteWorkspaceCounters as getFavoriteWorkspaceCountersService,
  getWorkspace as getWorkspaceService,
  getWorkspaceFilterCount as getWorkspaceFilterCountService,
  getWorkspaceFolder as getWorkspaceFolderService,
  getWorkspacePostDetail as getWorkspacePostDetailService,
  getWorkspaceReminders as getWorkspaceRemindersService,
  getWorkspaceRemindersCount as getWorkspaceRemindersCountService,
  getWorkspaces as getWorkspacesService,
  getWorkspaceTopics as getWorkspaceTopicsService,
  joinWorkspace as joinWorkspaceService,
  moveWorkspaceTopic as moveWorkspaceTopicService,
  postResendInvite as postResendInviteService,
  postWorkspaceRole as postWorkspaceRoleService,
  updatePostStatus as updatePostStatusService,
  updateWorkspace as updateWorkspaceService,
  putChannel as putChannelService,
  toggleShowAbout as toggleShowAboutService,
  getAllWorkspaceFolders as getAllWorkspaceFoldersService,
  getExistingFolder as getExistingFolderService,
  putWorkspaceNotification as putWorkspaceNotificationService,
  getWorkspaceQuickLinks as getWorkspaceQuickLinksService,
  putWorkspaceQuickLinks as putWorkspaceQuickLinksService,
  getRelatedWorkspace as getRelatedWorkspaceService,
} from "../services";

export function getWorkspaces(payload, callback) {
  return dispatchActionToReducer(getWorkspacesService(payload), "GET_WORKSPACES_START", "GET_WORKSPACES_SUCCESS", "GET_WORKSPACES_FAIL", callback);
}

export function createWorkspace(payload, callback) {
  return dispatchActionToReducer(createWorkspaceService(payload), "CREATE_WORKSPACE_START", "CREATE_WORKSPACE_SUCCESS", "CREATE_WORKSPACE_FAIL", callback);
}

export function fetchDetail(payload, callback) {
  return dispatchActionToReducer(fetchDetailService(payload), "GET_WORKSPACE_DETAIL_START", "GET_WORKSPACE_DETAIL_SUCCESS", "GET_WORKSPACE_DETAIL_FAIL", callback);
}

export function updateWorkspace(payload, callback) {
  return dispatchActionToReducer(updateWorkspaceService(payload), "UPDATE_WORKSPACE_START", "UPDATE_WORKSPACE_SUCCESS", "UPDATE_WORKSPACE_FAIL", callback);
}

export function deleteWorkspace(payload, callback) {
  return dispatchActionToReducer(deleteWorkspaceService(payload), "DELETE_WORKSPACE_START", "DELETE_WORKSPACE_SUCCESS", "DELETE_WORKSPACE_FAIL", callback);
}

export function moveWorkspaceTopic(payload, callback) {
  return dispatchActionToReducer(moveWorkspaceTopicService(payload), "MOVE_WORKSPACE_TOPIC_START", "MOVE_WORKSPACE_TOPIC_SUCCESS", "MOVE_WORKSPACE_TOPIC_FAIL", callback);
}

export function getWorkspaceTopics(payload, callback) {
  return dispatchActionToReducer(getWorkspaceTopicsService(payload), "GET_WORKSPACE_TOPICS_START", "GET_WORKSPACE_TOPICS_SUCCESS", "GET_WORKSPACE_TOPICS_FAIL", callback);
}

export function getWorkspacePostDetail(payload, callback) {
  return dispatchActionToReducer(getWorkspacePostDetailService(payload), "GET_WORKSPACE_POST_DETAIL_START", "GET_WORKSPACE_POST_DETAIL_SUCCESS", "GET_WORKSPACE_POST_DETAIL_FAIL", callback);
}

export function updatePostStatus(payload, callback) {
  return dispatchActionToReducer(updatePostStatusService(payload), "UPADATE_POST_STATUS_START", "UPADATE_POST_STATUS_SUCCESS", "UPADATE_POST_STATUS_FAIL", callback);
}

export function getPostStatusCount(payload, callback) {
  return dispatchActionToReducer(getPostStatusCountService(payload), "GET_POST_STATUS_COUNT_START", "GET_POST_STATUS_COUNT_SUCCESS", "GET_POST_STATUS_COUNT_FAIL", callback);
}

export function incomingWorkspaceFolder(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_WORKSPACE_FOLDER", payload, callback);
}

export function incomingWorkspace(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_WORKSPACE", payload, callback);
}

export function incomingUpdatedWorkspaceFolder(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UPDATED_WORKSPACE_FOLDER", payload, callback);
}

export function incomingMovedTopic(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_MOVED_TOPIC", payload, callback);
}

export function setActiveTopic(payload, callback) {
  return SimpleDispatchActionToReducer("SET_ACTIVE_TOPIC", payload, callback);
}

export function setActiveTab(payload, callback) {
  return SimpleDispatchActionToReducer("SET_ACTIVE_TAB", payload, callback);
}

export function updateWorkspacePostFilterSort(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_WORKSPACE_POST_FILTER_SORT", payload, callback);
}

export function joinWorkspace(payload, callback) {
  return dispatchActionToReducer(joinWorkspaceService(payload), "JOIN_WORKSPACE_START", "JOIN_WORKSPACE_SUCCESS", "JOIN_WORKSPACE_FAIL", callback);
}

export function joinWorkspaceReducer(payload, callback) {
  return SimpleDispatchActionToReducer("JOIN_WORKSPACE_REDUCER", payload, callback);
}

export function addPostSearchResult(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_POST_SEARCH_RESULT", payload, callback);
}

export function fetchPrimaryFiles(payload, callback) {
  return dispatchActionToReducer(fetchPrimaryFilesService(payload), "FETCH_WORKSPACE_PRIMARY_FILES_START", "FETCH_WORKSPACE_PRIMARY_FILES_SUCCESS", "FETCH_WORKSPACE_PRIMARY_FILES_FAIL", callback);
}

export function addPrimaryFiles(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_PRIMARY_FILES", payload, callback);
}

export function fetchMembers(payload, callback) {
  return dispatchActionToReducer(fetchMembersService(payload), "FETCH_WORKSPACE_MEMBERS_START", "FETCH_WORKSPACE_MEMBERS_SUCCESS", "FETCH_WORKSPACE_MEMBERS_FAIL", callback);
}

export function fetchTimeline(payload, callback) {
  return dispatchActionToReducer(fetchTimelineService(payload), "FETCH_TIMELINE_START", "FETCH_TIMELINE_SUCCESS", "FETCH_TIMELINE_FAIL", callback);
}

export function addToWorkspaceFiles(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_TO_WORKSPACE_FILES", payload, callback);
}

export function incomingTimeline(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_TIMELINE", payload, callback);
}

export function getWorkspace(payload, callback) {
  return dispatchActionToReducer(getWorkspaceService(payload), "GET_WORKSPACE_START", "GET_WORKSPACE_SUCCESS", "GET_WORKSPACE_FAIL", callback);
}

export function updateWorkspaceCounter(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_WORKSPACE_COUNTER", payload, callback);
}

export function incomingArchivedWorkspaceChannel(payload, callback) {
  return SimpleDispatchActionToReducer("ARCHIVE_REDUCER", payload, callback);
}

export function incomingUnArchivedWorkspaceChannel(payload, callback) {
  return SimpleDispatchActionToReducer("UNARCHIVE_REDUCER", payload, callback);
}

export function leaveWorkspace(payload, callback) {
  return SimpleDispatchActionToReducer("LEAVE_WORKSPACE", payload, callback);
}

export function postWorkspaceRole(payload, callback) {
  return dispatchActionToReducer(postWorkspaceRoleService(payload), "ADD_WORKSPACE_ROLE_START", "ADD_WORKSPACE_ROLE_SUCCESS", "ADD_WORKSPACE_ROLE_FAIL", callback);
}

export function incomingWorkspaceRole(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_WORKSPACE_ROLE", payload, callback);
}

export function setWorkspaceToDelete(payload, callback) {
  return SimpleDispatchActionToReducer("SET_WORKSPACE_TO_DELETE", payload, callback);
}

export function deleteWorkspaceRole(payload, callback) {
  return dispatchActionToReducer(deleteWorkspaceRoleService(payload), "DELETE_WORKSPACE_ROLE_START", "DELETE_WORKSPACE_ROLE_SUCCESS", "DELETE_WORKSPACE_ROLE_FAIL", callback);
}

export function deleteWorkspaceFolder(payload, callback) {
  return dispatchActionToReducer(deleteWorkspaceFolderService(payload), "DELETE_WORKSPACE_FOLDER_START", "DELETE_WORKSPACE_FOLDER_SUCCESS", "DELETE_WORKSPACE_FOLDER_FAIL", callback);
}

export function incomingDeletedWorkspaceFolder(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DELETED_WORKSPACE_FOLDER", payload, callback);
}

export function getWorkspaceFolder(payload, callback) {
  return dispatchActionToReducer(getWorkspaceFolderService(payload), "GET_FOLDER_START", "GET_FOLDER_SUCCESS", "GET_FOLDER_FAIL", callback);
}

export function updateWorkspaceTimelinePage(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_WORKSPACE_TIMELINE_PAGE", payload, callback);
}

export function getAllWorkspace(payload, callback) {
  return dispatchActionToReducer(getAllWorkspaceService(payload), "GET_ALL_WORKSPACE_START", "GET_ALL_WORKSPACE_SUCCESS", "GET_ALL_WORKSPACE_FAIL", callback);
}

export function updateWorkspaceSearch(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_WORKSPACE_SEARCH", payload, callback);
}

export function getUnreadWorkspacePostEntries(payload, callback) {
  return dispatchActionToReducer(getUnreadWorkspacePostEntriesService(payload), "GET_UNREAD_WORKSPACE_POSTS_ENTRIES_START", "GET_UNREAD_WORKSPACE_POSTS_ENTRIES_SUCCESS", "GET_UNREAD_WORKSPACE_POSTS_ENTRIES_FAIL", callback);
}

export function updateWorkspacePostCount(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_WORKSPACE_POST_COUNT", payload, callback);
}

export function postResendInvite(payload, callback) {
  return dispatchActionToReducer(postResendInviteService(payload), "POST_RESEND_INVITE_START", "POST_RESEND_INVITE_SUCCESS", "POST_RESEND_INVITE_FAIL", callback);
}

export function createWorkspaceTeamChannel(payload, callback) {
  return dispatchActionToReducer(createWorkspaceTeamChannelService(payload), "CREATE_WORKSPACE_TEAM_CHANNEL_START", "CREATE_WORKSPACE_TEAM_CHANNEL_SUCCESS", "CREATE_WORKSPACE_TEAM_CHANNEL_FAIL", callback);
}

export function incomingTeamChannel(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_TEAM_CHANNEL", payload, callback);
}

export function favouriteWorkspace(payload, callback) {
  return dispatchActionToReducer(favouriteWorkspaceService(payload), "FAVOURITE_WORKSPACE_START", "FAVOURITE_WORKSPACE_SUCCESS", "FAVOURITE_WORKSPACE_FAIL", callback);
}

export function incomingFavouriteWorkspace(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_FAVOURITE_WORKSPACE", payload, callback);
}

export function getWorkspaceFitlerCount(payload, callback) {
  return dispatchActionToReducer(getWorkspaceFilterCountService(payload), "GET_WORKSPACE_FILTER_COUNT_START", "GET_WORKSPACE_FILTER_COUNT_SUCCESS", "GET_WORKSPACE_FILTER_COUNT_FAIL", callback);
}

export function getFavoriteWorkspaceCounters(payload, callback) {
  return dispatchActionToReducer(getFavoriteWorkspaceCountersService(payload), "GET_FAVORITE_WORKSPACE_COUNTERS_START", "GET_FAVORITE_WORKSPACE_COUNTERS_SUCCESS", "GET_FAVORITE_WORKSPACE_COUNTERS_FAIL", callback);
}

export function getWorkspaceReminders(payload, callback) {
  return dispatchActionToReducer(getWorkspaceRemindersService(payload), "GET_WORKSPACE_REMINDERS_START", "GET_WORKSPACE_REMINDERS_SUCCESS", "GET_WORKSPACE_REMINDERS_FAIL", callback);
}

export function getWorkspaceRemindersCallback(payload, callback) {
  return SimpleDispatchActionToReducer("GET_WORKSPACE_REMINDERS_CALLBACK", payload, callback);
}

export function getWorkspaceRemindersCount(payload, callback) {
  return dispatchActionToReducer(getWorkspaceRemindersCountService(payload), "GET_WORKSPACE_REMINDERS_COUNT_START", "GET_WORKSPACE_REMINDERS_COUNT_SUCCESS", "GET_WORKSPACE_REMINDERS_COUNT_FAIL", callback);
}

export function updateWorkspaceRemindersCount(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_WORKSPACE_REMINDERS_COUNT", payload, callback);
}

export function getFavoriteWorkspaces(payload, callback) {
  return dispatchActionToReducer(getFavoriteWorkspacesService(payload), "GET_FAVORITE_WORKSPACES_START", "GET_FAVORITE_WORKSPACES_SUCCESS", "GET_FAVORITE_WORKSPACES_FAIL", callback);
}

export function getDoneWorkspaceRemindersCallback(payload, callback) {
  return SimpleDispatchActionToReducer("GET_DONE_WORKSPACE_REMINDERS_CALLBACK", payload, callback);
}

export function getOverdueWorkspaceRemindersCallback(payload, callback) {
  return SimpleDispatchActionToReducer("GET_OVERDUE_WORKSPACE_REMINDERS_CALLBACK", payload, callback);
}

export function getTodayWorkspaceRemindersCallback(payload, callback) {
  return SimpleDispatchActionToReducer("GET_TODAY_WORKSPACE_REMINDERS_CALLBACK", payload, callback);
}

export function setChannelIsTranslate(payload, callback) {
  return SimpleDispatchActionToReducer("SET_CHANNEL_IS_TRANSLATE", payload, callback);
}

export function updateChannelIsTranslate(payload, callback) {
  return dispatchActionToReducer(putChannelService(payload), "UPDATE_CHANNEL_IS_TRANSLATE", "UPDATE_CHANNEL_IS_TRANSLATE_SUCCESS", "UPDATE_CHANNEL_IS_TRANSLATE_FAILURE", callback);
}

export function getWorkspaceAndSetToFavorites(payload, callback) {
  return dispatchActionToReducer(getWorkspaceService(payload), "GET_WORKSPACE_SET_TO_FAV_START", "GET_WORKSPACE_SET_TO_FAV_SUCCESS", "GET_WORKSPACE_SET_TO_FAV_FAIL", callback);
}

export function toggleShowAbout(payload, callback) {
  return dispatchActionToReducer(toggleShowAboutService(payload), "TOGGLE_SHOW_ABOUT_START", "TOGGLE_SHOW_ABOUT_SUCCESS", "TOGGLE_SHOW_ABOUT_FAILURE", callback);
}

export function getAllWorkspaceFolders(payload, callback) {
  return dispatchActionToReducer(getAllWorkspaceFoldersService(payload), "GET_ALL_WORKSPACE_FOLDERS_START", "GET_ALL_WORKSPACE_FOLDERS_SUCCESS", "GET_ALL_WORKSPACE_FOLDERS_FAIL", callback);
}

export function getExistingFolder(payload, callback) {
  return dispatchActionToReducer(getExistingFolderService(payload), "GET_EXISTING_WORKSPACE_FOLDER_START", "GET_EXISTING_WORKSPACE_FOLDER_SUCCESS", "GET_EXISTING_WORKSPACE_FOLDER_FAIL", callback);
}

export function putWorkspaceNotification(payload, callback) {
  return dispatchActionToReducer(putWorkspaceNotificationService(payload), "TOGGLE_WORKSPACE_NOTIFICATION_START", "TOGGLE_WORKSPACE_NOTIFICATION_SUCCESS", "TOGGLE_WORKSPACE_NOTIFICATION_FAIL", callback);
}

export function incomingWorkpaceNotificationStatus(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_WORKSPACE_NOTIFICATION_STATUS", payload, callback);
}

export function setUnreadPostIds(payload, callback) {
  return SimpleDispatchActionToReducer("SET_UNREAD_POST_IDS", payload, callback);
}

export function setPostIsSelected(payload, callback) {
  return SimpleDispatchActionToReducer("SET_SELECTED_POST", payload, callback);
}

export function getWorkspaceQuickLinks(payload, callback) {
  return dispatchActionToReducer(getWorkspaceQuickLinksService(payload), "GET_WORKSPACE_QUICKLINKS_START", "GET_WORKSPACE_QUICKLINKS_SUCCESS", "GET_WORKSPACE_QUICKLINKS_FAIL", callback);
}

export function putWorkspaceQuickLinks(payload, callback) {
  return dispatchActionToReducer(putWorkspaceQuickLinksService(payload), "PUT_WORKSPACE_QUICKLINKS_START", "PUT_WORKSPACE_QUICKLINKS_SUCCESS", "PUT_WORKSPACE_QUICKLINKS_FAIL", callback);
}

export function incomingUpdatedWorkspaceQuickLinks(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UPDATED_WORKSPACE_QUICK_LINKS", payload, callback);
}

export function getRelatedWorkspace(payload, callback) {
  return dispatchActionToReducer(getRelatedWorkspaceService(payload), "GET_RELATED_WORKSPACE_START", "GET_RELATED_WORKSPACE_SUCCESS", "GET_RELATED_WORKSPACE_FAIL", callback);
}
export function clearRelatedWorkspace(payload, callback) {
  return SimpleDispatchActionToReducer("CLEAR_RELATED_WORKSPACE", payload, callback);
}
