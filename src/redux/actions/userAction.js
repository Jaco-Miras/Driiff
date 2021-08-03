import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import {
  activateUser as activateUserService,
  deactivateUser as deactivateUserService,
  archiveUser as archiveUserService,
  authenticateGoogleLogin as authenticateGoogleLoginService,
  checkDriffUserEmail as checkDriffUserEmailService,
  deleteUser as deleteUserService,
  getMentions as getMentionsService,
  getOnlineUsers as getOnlineUsersService,
  getUser as getUserService,
  getUsers as getUsersService,
  getUsersWithoutActivity as getUsersWithoutActivityService,
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
  putUserRole as putUserRoleService,
  getRoles as getRolesService,
  getExternalUsers as getExternalUsersService,
  unarchiveUser as unarchiveUserService,
  getArchivedUsers as getArchivedUsersService,
  updateUserType as updateUserTypeService,
  resendInvitation as resendInvitationService,
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

export function putUserRole(payload, callback) {
  return dispatchActionToReducer(putUserRoleService(payload), "PUT_USER_ROLE_START", "PUT_USER_ROLE_SUCCESS", "PUT_USER_ROLE_FAILURE", callback);
}

export function getRoles(payload, callback) {
  return dispatchActionToReducer(getRolesService(payload), "GET_ROLES_START", "GET_ROLES_SUCCESS", "GET_ROLES_FAILURE", callback);
}

export function incomingUserRole(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_USER_ROLE", payload, callback);
}

export function getExternalUsers(payload, callback) {
  return dispatchActionToReducer(getExternalUsersService(payload), "GET_EXTERNAL_USERS_START", "GET_EXTERNAL_USERS_SUCCESS", "GET_EXTERNAL_USERS_FAILURE", callback);
}

export function archiveUser(payload, callback) {
  return dispatchActionToReducer(archiveUserService(payload), "ARCHIVE_USER_START", "ARCHIVE_USER_SUCCESS", "ARCHIVE_USER_FAILURE", callback);
}

export function unarchiveUser(payload, callback) {
  return dispatchActionToReducer(unarchiveUserService(payload), "UNARCHIVE_USER_START", "UNARCHIVE_USER_SUCCESS", "UNARCHIVE_USER_FAILURE", callback);
}

export function activateUser(payload, callback) {
  return dispatchActionToReducer(activateUserService(payload), "ACTIVATE_USER_START", "ACTIVATE_USER_SUCCESS", "ACTIVATE_USER_FAILURE", callback);
}

export function deactivateUser(payload, callback) {
  return dispatchActionToReducer(deactivateUserService(payload), "DEACTIVATE_USER_START", "DEACTIVATE_USER_SUCCESS", "DEACTIVATE_USER_FAILURE", callback);
}

export function getArchivedUsers(payload, callback) {
  return dispatchActionToReducer(getArchivedUsersService(payload), "GET_ARCHIVED_USERS_START", "GET_ARCHIVED_USERS_SUCCESS", "GET_ARCHIVED_USERS_FAILURE", callback);
}

export function incomingArchivedUser(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_ARCHIVED_USER", payload, callback);
}

export function incomingUnarchivedUser(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UNARCHIVED_USER", payload, callback);
}

export function incomingDeactivatedUser(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DEACTIVATED_USER", payload, callback);
}

export function incomingActivatedUser(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_ACTIVATED_USER", payload, callback);
}

export function incomingOnlineUsers(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_ONLINE_USERS", payload, callback);
}

export function updateUserType(payload, callback) {
  return dispatchActionToReducer(updateUserTypeService(payload), "UPDATE_USER_TYPE_START", "UPDATE_USER_TYPE_SUCCESS", "UPDATE_USER_TYPE_FAILURE", callback);
}

export function deleteUser(payload, callback) {
  return dispatchActionToReducer(deleteUserService(payload), "DELETE_USER_START", "DELETE_USER_SUCCESS", "DELETE_USER_FAILURE", callback);
}

export function getUsersWithoutActivity(payload, callback) {
  return dispatchActionToReducer(getUsersWithoutActivityService(payload), "GET_USERS_WITHOUT_ACTIVITY_START", "GET_USERS_WITHOUT_ACTIVITY_SUCCESS", "GET_USERS_WITHOUT_ACTIVITY_FAILURE", callback);
}

export function incomingDeletedUser(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_DELETED_USER", payload, callback);
}

export function resendInvitation(payload, callback) {
  return dispatchActionToReducer(resendInvitationService(payload), "RESEND_INVITATION_START", "RESEND_INVITATION_SUCCESS", "RESEND_INVITATION_FAILURE", callback);
}
