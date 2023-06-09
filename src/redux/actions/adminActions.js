import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import {
  getLoginSettings as getLoginSettingsService,
  putLoginSettings as putLoginSettingsService,
  getGoogleAuthSettings as getGoogleAuthSettingsService,
  postRevokeGoogleToken as postRevokeGoogleTokenService,
  getGoogleAuth as getGoogleAuthService,
  putQuickLinks as putQuickLinksService,
  postQuickLinks as postQuickLinksService,
  getUserBot as getUserBotService,
  deleteUserBot as deleteUserBotService,
  putUserBot as putUserBotService,
  postUserBot as postUserBotService,
  getGrippBot as getGrippBotService,
  putGrippBot as putGrippBotService,
  postUploadUserBotIcon as postUploadUserBotIconService,
  getGrippDetails as getGrippDetailsService,
  getGrippUsers as getGrippUsersService,
  postSyncGrippUsers as postSyncGrippUsersService,
  createCheckoutSession as createCheckoutSessionService,
  resetGrippUsersImage as resetGrippUsersImageService,
  getStripePricing as getStripePricingService,
  getStripeProducts as getStripeProductsService,
  cancelStripeSubscription as cancelStripeSubscriptionService,
  resetCompanyLogo as resetCompanyLogoService,
  getPostAccess as getPostAccessService,
  putPostAccess as putPostAccessService,
  getNotificationSettings as getNotificationSettingsService,
  putNotificationSettings as putNotificationSettingsService,
  getSecuritySettings as getSecuritySettingsService,
  putSecuritySettings as putSecuritySettingsService,
  uploadDashboardBg as uploadDashboardBgService,
  putCompanyDescription as putCompanyDescriptionService,
  sendRequestPassword as sendRequestPasswordService,
  getAllWorkspaces as getAllWorkspacesService,
  getMeetingSettings as getMeetingSettingsService,
  putMeetingSettings as putMeetingSettingsService,
  uploadFavicon as uploadFaviconService,
} from "../services";

export function getLoginSettings(payload, callback) {
  return dispatchActionToReducer(getLoginSettingsService(payload), "GET_LOGIN_SETTINGS_START", "GET_LOGIN_SETTINGS_SUCCESS", "GET_LOGIN_SETTINGS_FAILURE", callback);
}

export function putLoginSettings(payload, callback) {
  return dispatchActionToReducer(putLoginSettingsService(payload), "PUT_LOGIN_SETTINGS_START", "PUT_LOGIN_SETTINGS_SUCCESS", "PUT_LOGIN_SETTINGS_FAILURE", callback);
}

export function getGoogleAuthSettings(payload, callback) {
  return dispatchActionToReducer(getGoogleAuthSettingsService(payload), "GET_GOOGLE_AUTH_SETTINGS_START", "GET_GOOGLE_AUTH_SETTINGS_SUCCESS", "GET_GOOGLE_AUTH_SETTINGS_FAILURE", callback);
}

export function getGoogleAuth(payload, callback) {
  return dispatchActionToReducer(getGoogleAuthService(payload), "GET_GOOGLE_AUTH_START", "GET_GOOGLE_AUTH_SUCCESS", "GET_GOOGLE_AUTH_FAILURE", callback);
}

export function postRevokeGoogleToken(callback) {
  return dispatchActionToReducer(postRevokeGoogleTokenService(), "POST_GOOGLE_REVOKE_TOKEN_START", "POST_GOOGLE_REVOKE_TOKEN_SUCCESS", "POST_GOOGLE_REVOKE_TOKEN_FAILURE", callback);
}

export function setFilter(payload, callback) {
  return SimpleDispatchActionToReducer("SET_ADMIN_FILTER", payload, callback);
}

export function putQuickLinks(payload, callback) {
  return dispatchActionToReducer(putQuickLinksService(payload), "PUT_QUICK_LINKS_START", "PUT_QUICK_LINKS_SUCCESS", "PUT_QUICK_LINKS_FAILURE", callback);
}

export function postQuickLinks(payload, callback) {
  return dispatchActionToReducer(postQuickLinksService(payload), "CREATE_QUICK_LINKS_START", "CREATE_QUICK_LINKS_SUCCESS", "CREATE_QUICK_LINKS_FAILURE", callback);
}

export function getUserBot(payload, callback) {
  return dispatchActionToReducer(getUserBotService(payload), "GET_USER_BOT_START", "GET_USER_BOT_SUCCESS", "GET_USER_BOT_FAILURE", callback);
}

export function deleteUserBot(payload, callback) {
  return dispatchActionToReducer(deleteUserBotService(payload), "DELETE_USER_BOT_START", "DELETE_USER_BOT_SUCCESS", "DELETE_USER_BOT_FAILURE", callback);
}

export function putUserBot(payload, callback) {
  return dispatchActionToReducer(putUserBotService(payload), "UPDATE_USER_BOT_START", "UPDATE_USER_BOT_SUCCESS", "UPDATE_USER_BOT_FAILURE", callback);
}

export function postUserBot(payload, callback) {
  return dispatchActionToReducer(postUserBotService(payload), "CREATE_USER_BOT_START", "CREATE_USER_BOT_SUCCESS", "CREATE_USER_BOT_FAILURE", callback);
}

export function getGrippBot(payload, callback) {
  return dispatchActionToReducer(getGrippBotService(payload), "GET_GRIPP_BOT_START", "GET_GRIPP_BOT_SUCCESS", "GET_GRIPP_BOT_FAILURE", callback);
}

export function putGrippBot(payload, callback) {
  return dispatchActionToReducer(putGrippBotService(payload), "UPDATE_GRIPP_BOT_START", "UPDATE_GRIPP_BOT_SUCCESS", "UPDATE_GRIPP_BOT_FAILURE", callback);
}

export function postUploadUserBotIcon(payload, callback) {
  return dispatchActionToReducer(postUploadUserBotIconService(payload), "POST_UPLOAD_USER_BOT_ICON_START", "POST_UPLOAD_USER_BOT_ICON_SUCCESS", "POST_UPLOAD_USER_BOT_ICON_FAILURE", callback);
}

export function getGrippDetails(payload, callback) {
  return dispatchActionToReducer(getGrippDetailsService(payload), "GET_GRIPP_DETAILS_START", "GET_GRIPP_DETAILS_SUCCESS", "GET_GRIPP_DETAILS_FAILURE", callback);
}

export function getGrippUsers(payload, callback) {
  return dispatchActionToReducer(getGrippUsersService(payload), "GET_GRIPP_USERS_START", "GET_GRIPP_USERS_SUCCESS", "GET_GRIPP_USERS_FAILURE", callback);
}

export function postSyncGrippUsers(payload, callback) {
  return dispatchActionToReducer(postSyncGrippUsersService(payload), "SYNC_GRIPP_USERS_START", "SYNC_GRIPP_USERS_SUCCESS", "SYNC_GRIPP_USERS_FAILURE", callback);
}

export function createCheckoutSession(payload, callback) {
  return dispatchActionToReducer(createCheckoutSessionService(payload), "CREATE_CHECKOUT_SESSION_START", "CREATE_CHECKOUT_SESSION_SUCCESS", "CREATE_CHECKOUT_SESSION_FAILURE", callback);
}

export function resetGrippUsersImage(payload, callback) {
  return dispatchActionToReducer(resetGrippUsersImageService(payload), "RESET_GRIPP_USERS_IMAGE_START", "RESET_GRIPP_USERS_IMAGE_SUCCESS", "RESET_GRIPP_USERS_IMAGE_FAILURE", callback);
}

export function updateAllowedDomains(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATED_ALLOWED_DOMAINS", payload, callback);
}

export function incomingUpdatedSubscription(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UPDATED_SUBSCRIPTION", payload, callback);
}

export function getStripePricing(payload, callback) {
  return dispatchActionToReducer(getStripePricingService(payload), "GET_STRIPE_PRICING_START", "GET_STRIPE_PRICING_SUCCESS", "GET_STRIPE_PRICING_FAILURE", callback);
}

export function getStripeProducts(payload, callback) {
  return dispatchActionToReducer(getStripeProductsService(payload), "GET_STRIPE_PRODUCTS_START", "GET_STRIPE_PRODUCTS_SUCCESS", "GET_STRIPE_PRODUCTS_FAILURE", callback);
}

export function cancelStripeSubscription(payload, callback) {
  return dispatchActionToReducer(cancelStripeSubscriptionService(payload), "CANCEL_STRIPE_SUBSCRIPTION_START", "CANCEL_STRIPE_SUBSCRIPTION_SUCCESS", "CANCEL_STRIPE_SUBSCRIPTION_FAILURE", callback);
}

export function incomingUpdatedCompanyLogo(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UPDATED_COMPANY_LOGO", payload, callback);
}

export function resetCompanyLogo(payload, callback) {
  return dispatchActionToReducer(resetCompanyLogoService(payload), "RESET_COMPANY_LOGO_START", "RESET_COMPANY_LOGO_SUCCESS", "RESET_COMPANY_LOGO_FAILURE", callback);
}

export function getPostAccess(payload, callback) {
  return dispatchActionToReducer(getPostAccessService(payload), "GET_POST_ACCESS_START", "GET_POST_ACCESS_SUCCESS", "GET_POST_ACCESS_FAILURE", callback);
}

export function putPostAccess(payload, callback) {
  return dispatchActionToReducer(putPostAccessService(payload), "PUT_POST_ACCESS_START", "PUT_POST_ACCESS_SUCCESS", "PUT_POST_ACCESS_FAILURE", callback);
}

export function incomingPostAccess(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_POST_ACCESS", payload, callback);
}

export function getNotificationSettings(payload, callback) {
  return dispatchActionToReducer(getNotificationSettingsService(payload), "GET_NOTIFICATIONS_SETTINGS_START", "GET_NOTIFICATIONS_SETTINGS_SUCCESS", "GET_NOTIFICATIONS_SETTINGS_FAILURE", callback);
}

export function putNotificationSettings(payload, callback) {
  return dispatchActionToReducer(putNotificationSettingsService(payload), "PUT_NOTIFICATIONS_SETTINGS_START", "PUT_NOTIFICATIONS_SETTINGS_SUCCESS", "PUT_NOTIFICATIONS_SETTINGS_FAILURE", callback);
}

export function updateSecuritySettings(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_SECURITY_SETTINGS", payload, callback);
}

export function getSecuritySettings(payload, callback) {
  return dispatchActionToReducer(getSecuritySettingsService(payload), "GET_SECURITY_SETTINGS_START", "GET_SECURITY_SETTINGS_SUCCESS", "GET_SECURITY_SETTINGS_FAILURE", callback);
}

export function putSecuritySettings(payload, callback) {
  return dispatchActionToReducer(putSecuritySettingsService(payload), "PUT_SECURITY_SETTINGS_START", "PUT_SECURITY_SETTINGS_SUCCESS", "PUT_SECURITY_SETTINGS_FAILURE", callback);
}

export function sendRequestPassword(payload, callback) {
  return dispatchActionToReducer(sendRequestPasswordService(payload), "SEND_REQUEST_PASSWORD_START", "SEND_REQUEST_PASSWORD_SUCCESS", "SEND_REQUEST_PASSWORD_FAILURE", callback);
}

export function uploadDashboardBg(payload, callback) {
  return dispatchActionToReducer(uploadDashboardBgService(payload), "UPLOAD_DASHBOARD_BACKGROUND_START", "UPLOAD_DASHBOARD_BACKGROUND_SUCCESS", "UPLOAD_DASHBOARD_BACKGROUND_FAILURE", callback);
}

export function putCompanyDescription(payload, callback) {
  return dispatchActionToReducer(putCompanyDescriptionService(payload), "PUT_COMPANY_DESCRIPTION_START", "PUT_COMPANY_DESCRIPTION_SUCCESS", "PUT_COMPANY_DESCRIPTION_FAILURE", callback);
}

export function incomingCompanyDescription(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMPANY_DESCRIPTION", payload, callback);
}

export function incomingCompanyDashboardBackground(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_COMPANY_DASHBOARD_BACKGROUND", payload, callback);
}

export function getAllWorkspaces(payload, callback) {
  return dispatchActionToReducer(getAllWorkspacesService(payload), "GET_ALL_WORKSPACES_START", "GET_ALL_WORKSPACES_SUCCESS", "GET_ALL_WORKSPACES_FAILURE", callback);
}

export function updateAllWorkspacesPage(payload, callback) {
  return SimpleDispatchActionToReducer("UPDATE_ALL_WORKSPACES_PAGE", payload, callback);
}

export function incomingLoginSettings(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_LOGIN_SETTINGS", payload, callback);
}

export function getMeetingSettings(payload, callback) {
  return dispatchActionToReducer(getMeetingSettingsService(payload), "GET_MEETING_SETTINGS_START", "GET_MEETING_SETTINGS_SUCCESS", "GET_MEETING_SETTINGS_FAILURE", callback);
}

export function putMeetingSettings(payload, callback) {
  return dispatchActionToReducer(putMeetingSettingsService(payload), "PUT_MEETING_SETTINGS_START", "PUT_MEETING_SETTINGS_SUCCESS", "PUT_MEETING_SETTINGS_FAILURE", callback);
}

export function incomingMeetingSettings(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_MEETING_SETTINGS", payload, callback);
}

export function uploadFavicon(payload, callback) {
  return dispatchActionToReducer(uploadFaviconService(payload), "UPLOAD_FAVICON_START", "UPLOAD_FAVICON_SUCCESS", "UPLOAD_FAVICON_FAILURE", callback);
}
