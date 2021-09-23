import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import {
  getLoginSettings as getLoginSettingsService,
  putLoginSettings as putLoginSettingsService,
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
} from "../services";

export function getLoginSettings(payload, callback) {
  return dispatchActionToReducer(getLoginSettingsService(payload), "GET_LOGIN_SETTINGS_START", "GET_LOGIN_SETTINGS_SUCCESS", "GET_LOGIN_SETTINGS_FAILURE", callback);
}

export function putLoginSettings(payload, callback) {
  return dispatchActionToReducer(putLoginSettingsService(payload), "PUT_LOGIN_SETTINGS_START", "PUT_LOGIN_SETTINGS_SUCCESS", "PUT_LOGIN_SETTINGS_FAILURE", callback);
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
