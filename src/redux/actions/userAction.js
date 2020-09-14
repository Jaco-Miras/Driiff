import dispatchActionToReducer, {SimpleDispatchActionToReducer} from "../actionDispatcher";
import {
  authenticateGoogleLogin as authenticateGoogleLoginService,
  checkDriffUserEmail as checkDriffUserEmailService,
  getMentions as getMentionsService,
  getOnlineUsers as getOnlineUsersService,
  getUser as getUserService,
  getUsers as getUsersService,
  googleLogin as googleLoginService,
  login as loginService,
  logout as logoutService,
  postExternalUserData as postExternalUserDataService,
  postInternalRequestForm as postInternalRequestFormService,
  postMagicLink as postMagicLinkService,
  postPasswordReset as postPasswordResetService,
  postRequest as postRequestService,
  postUploadProfileImage as postUploadProfileImageService,
  putExternalUserUpdate as putExternalUserUpdateService,
  putMagicLink as putMagicLinkService,
  putUser as putUserService,
  resetPassword as resetPasswordService,
} from "../services";

export const postRequest = (payload, callback) => {
  return dispatchActionToReducer(postRequestService(payload), "REQUEST_START", "REQUEST_SUCCESS", "REQUEST_FAILURE", callback);
};

export const userLogin = (payload, callback) => {
  return dispatchActionToReducer(loginService(payload), "LOGIN_START", "LOGIN_SUCCESS", "LOGIN_FAILURE", callback);
};

export const userLogout = (payload, callback) => {
  return dispatchActionToReducer(logoutService(payload), "LOGOUT_START", "LOGOUT_SUCCESS", "LOGOUT_FAILURE", callback);
};

export const userGoogleLogin = (payload, callback) => {
  return dispatchActionToReducer(googleLoginService(payload), "GOOGLE_LOGIN_START", "GOOGLE_LOGIN_SUCCESS", "GOOGLE_LOGIN_FAILURE", callback);
};

export const authenticateGoogleLogin = (payload, callback) => {
  return dispatchActionToReducer(authenticateGoogleLoginService(payload), "GOOGLE_AUTH_LOGIN_START", "GOOGLE_AUTH_LOGIN_SUCCESS", "GOOGLE_AUTH_LOGIN_FAILURE", callback);
};

export function getOnlineUsers(payload, callback) {
  return dispatchActionToReducer(getOnlineUsersService(payload), "GET_ONLINE_USERS_START", "GET_ONLINE_USERS_SUCCESS", "GET_ONLINE_USERS_FAIL", callback);
}

export function getUser(payload, callback) {
  return dispatchActionToReducer(getUserService(payload), "GET_USER_START", "GET_USER_SUCCESS", "GET_USER_FAILURE", callback);
}

export function getMentions(callback) {
  return dispatchActionToReducer(getMentionsService(), "GET_MENTION_USERS_START", "GET_MENTION_USERS_SUCCESS", "GET_MENTION_USERS_FAILURE", callback);
}

export function resetPassword(payload, callback) {
  return dispatchActionToReducer(resetPasswordService(payload), "RESET_PASSWORD_START", "RESET_PASSWORD_SUCCESS", "RESET_PASSWORD_FAILURE", callback);
}

export function postPasswordReset(payload, callback) {
  return dispatchActionToReducer(postPasswordResetService(payload), "RESET_PASSWORD_START", "RESET_PASSWORD_SUCCESS", "RESET_PASSWORD_FAILURE", callback);
}

export function checkDriffUserEmail(payload, callback) {
  return dispatchActionToReducer(checkDriffUserEmailService(payload), "CHECK_DRIFF_EMAIL_START", "CHECK_DRIFF_EMAIL_SUCCESS", "CHECK_DRIFF_EMAIL_FAILURE", callback);
}

export function getUsers(payload, callback) {
  return dispatchActionToReducer(getUsersService(payload), "GET_USERS_START", "GET_USERS_SUCCESS", "GET_USERS_FAIL", callback);
}

export function putUser(payload, callback) {
  return dispatchActionToReducer(putUserService(payload), "UPDATE_USER_START", "UPDATE_USER_SUCCESS", "UPDATE_USER_FAIL", callback);
}

export function postUploadProfileImage(payload, callback) {
  return dispatchActionToReducer(postUploadProfileImageService(payload), "UPDATE_PROFILE_IMAGE_START", "UPDATE_PROFILE_IMAGE_SUCCESS", "UPDATE_PROFILE_IMAGE_FAILURE", callback);
}

export function incomingUpdatedUser(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UPDATED_USER", payload, callback);
}

export function postExternalUserData(payload, callback) {
  return dispatchActionToReducer(postExternalUserDataService(payload), "POST_EXTERNAL_USER_DATA_START", "POST_EXTERNAL_USER_DATA_SUCCESS", "POST_EXTERNAL_USER_DATA_FAILURE", callback);
}

export function putExternalUserUpdate(payload, callback) {
  return dispatchActionToReducer(putExternalUserUpdateService(payload), "PUT_EXTERNALUSER_UPDATE_START", "PUT_EXTERNALUSER_UPDATE_SUCCESS", "PUT_EXTERNALUSER_UPDATE_FAILURE", callback);
}

export function postMagicLink(payload, callback) {
  return dispatchActionToReducer(postMagicLinkService(payload), "POST_MAGIC_LINK_START", "POST_MAGIC_LINK_SUCCESS", "POST_MAGIC_LINK_FAILURE", callback);
}

export function putMagicLink(payload, callback) {
  return dispatchActionToReducer(putMagicLinkService(payload), "PUT_MAGIC_LINK_START", "PUT_MAGIC_LINK_SUCCESS", "PUT_MAGIC_LINK_FAILURE", callback);
}

export function incomingExternalUser(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_EXTERNAL_USER", payload, callback);
}

export function postInternalRequestForm(payload, callback) {
  return dispatchActionToReducer(postInternalRequestFormService(payload), "PUT_MAGIC_LINK_START", "PUT_MAGIC_LINK_SUCCESS", "PUT_MAGIC_LINK_FAILURE", callback);
}

export function incomingInternalUser(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_INTERNAL_USER", payload, callback);
}
