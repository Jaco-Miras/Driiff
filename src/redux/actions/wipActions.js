import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import {
  postSubject as postSubjectService,
  postWIP as postWIPService,
  getSubjects as getSubjectsService,
  getWIPs as getWIPsService,
  getWIPDetail as getWIPDetailService,
  postWIPComment as postWIPCommentService,
  getWIPComments as getWIPCommentsService,
  postFileComment as postFileCommentService,
  getFileComments as getFileCommentsService,
  postFileApproval as postFileApprovalService,
  postFileCommentClose as postFileCommentCloseService,
  patchFileVersion as patchFileVersionService,
  putFileVersion as putFileVersionService,
  putFileComment as putFileCommentService,
  putWIP as putWIPService,
  putWIPComment as putWIPCommentService,
  deleteWIPComment as deleteWIPCommentService,
  putWIPCommentImportant as putWIPCommentImportantService,
  postWIPCommentClap as postWIPCommentClapService,
  postWIPClap as postWIPClapService,
  postWIPFavorite as postWIPFavoriteService,
  deleteWIP as deleteWIPService,
} from "../services";

export function postSubject(payload, callback) {
  return dispatchActionToReducer(postSubjectService(payload), "CREATE_WIP_SUBJECT_START", "CREATE_WIP_SUBJECT_SUCCESS", "CREATE_WIP_SUBJECT_FAIL", callback);
}

export function postWIP(payload, callback) {
  return dispatchActionToReducer(postWIPService(payload), "CREATE_WIP_START", "CREATE_WIP_SUCCESS", "CREATE_WIP_FAIL", callback);
}

export function putWIP(payload, callback) {
  return dispatchActionToReducer(putWIPService(payload), "UPDATE_WIP_START", "UPDATE_WIP_SUCCESS", "UPDATE_WIP_FAIL", callback);
}

export function incomingWIP(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_WIP", payload, callback);
}

export function incomingWIPSubject(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_WIP_SUBJECT", payload, callback);
}

export function getSubjects(payload, callback) {
  return dispatchActionToReducer(getSubjectsService(payload), "GET_WIP_SUBJECTS_START", "GET_WIP_SUBJECTS_SUCCESS", "GET_WIP_SUBJECTS_FAIL", callback);
}

export function getWIPs(payload, callback) {
  return dispatchActionToReducer(getWIPsService(payload), "GET_WIPS_START", "GET_WIP_SUCCESS", "GET_WIPS_FAIL", callback);
}

export function getWIPDetail(payload, callback) {
  return dispatchActionToReducer(getWIPDetailService(payload), "GET_WIP_DETAIL_START", "GET_WIP_DETAIL_SUCCESS", "GET_WIP_DETAIL_FAIL", callback);
}

export function addWIPs(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_WIPS", payload, callback);
}

export function postWIPComment(payload, callback) {
  return dispatchActionToReducer(postWIPCommentService(payload), "POST_WIP_COMMENT_START", "POST_WIP_COMMENT_SUCCESS", "POST_WIP_COMMENT_FAIL", callback);
}

export function addWIPComment(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_WIP_COMMENT", payload, callback);
}

export function incomingWIPComment(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_WIP_COMMENT", payload, callback);
}

export function getWIPComments(payload, callback) {
  return dispatchActionToReducer(getWIPCommentsService(payload), "GET_WIP_COMMENTS_START", "GET_WIP_COMMENTS_SUCCESS", "GET_WIP_COMMENTS_FAIL", callback);
}

export function postFileComment(payload, callback) {
  return dispatchActionToReducer(postFileCommentService(payload), "POST_FILE_COMMENT_START", "POST_FILE_COMMENT_SUCCESS", "POST_FILE_COMMENT_FAIL", callback);
}

export function getFileComments(payload, callback) {
  return dispatchActionToReducer(getFileCommentsService(payload), "GET_FILE_COMMENTS_START", "GET_FILE_COMMENTS_SUCCESS", "GET_FILE_COMMENTS_FAIL", callback);
}

export function addFileComment(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_FILE_COMMENT", payload, callback);
}

export function incomingWIPFileComment(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_WIP_FILE_COMMENT", payload, callback);
}

export function postFileApproval(payload, callback) {
  return dispatchActionToReducer(postFileApprovalService(payload), "POST_FILE_APPROVAL_START", "POST_FILE_APPROVAL_SUCCESS", "POST_FILE_APPROVAL_FAIL", callback);
}

export function postFileCommentClose(payload, callback) {
  return dispatchActionToReducer(postFileCommentCloseService(payload), "POST_FILE_COMMENT_CLOSE_START", "POST_FILE_COMMENT_CLOSE_SUCCESS", "POST_FILE_COMMENT_CLOSE_FAIL", callback);
}

export function saveAnnotation(payload, callback) {
  return SimpleDispatchActionToReducer("SAVE_ANNOTATION", payload, callback);
}

export function patchFileVersion(payload, callback) {
  return dispatchActionToReducer(patchFileVersionService(payload), "PATCH_FILE_VERSION_START", "PATCH_FILE_VERSION_SUCCESS", "PATCH_FILE_VERSION_FAIL", callback);
}

export function openFileDialog(payload, callback) {
  return SimpleDispatchActionToReducer("OPEN_FILE_DIALOG", payload, callback);
}

export function putFileVersion(payload, callback) {
  return dispatchActionToReducer(putFileVersionService(payload), "PUT_FILE_VERSION_START", "PUT_FILE_VERSION_SUCCESS", "PUT_FILE_VERSION_FAIL", callback);
}

export function incomingReplacedWIPFile(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_REPLACED_WIP_FILE", payload, callback);
}

export function incomingNewFileVersion(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_NEW_WIP_FILE_VERSION", payload, callback);
}

export function setEditFileComment(payload, callback) {
  return SimpleDispatchActionToReducer("SET_EDIT_FILE_COMMENT", payload, callback);
}

export function putFileComment(payload, callback) {
  return dispatchActionToReducer(putFileCommentService(payload), "UPDATE_FILE_COMMENT_START", "UPDATE_FILE_COMMENT_SUCCESS", "UPDATE_FILE_COMMENT_FAIL", callback);
}

export function incomingUpdatedWIPFileComment(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UPDATED_WIP_FILE_COMMENT", payload, callback);
}

export function incomingClosedFileComments(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_CLOSED_FILE_COMMENTS", payload, callback);
}

export function incomingApprovedFileVersion(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_APPROVED_FILE_VERSION", payload, callback);
}

export function deleteWIPComment(payload, callback) {
  return dispatchActionToReducer(deleteWIPCommentService(payload), "DELETE_WIP_COMMENT_START", "DELETE_WIP_COMMENT_SUCCESS", "DELETE_WIP_COMMENT_FAIL", callback);
}

export function putWIPComment(payload, callback) {
  return dispatchActionToReducer(putWIPCommentService(payload), "PUT_WIP_COMMENT_START", "PUT_WIP_COMMENT_SUCCESS", "PUT_WIP_COMMENT_FAIL", callback);
}

export function setEditComment(payload, callback) {
  return SimpleDispatchActionToReducer("SET_EDIT_WIP_COMMENT", payload, callback);
}

export function incomingUpdatedWIPComment(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_UPDATED_WIP_COMMENT", payload, callback);
}

export function setParentIdForUpload(payload, callback) {
  return SimpleDispatchActionToReducer("SET_PARENT_ID_FOR_UPLOAD", payload, callback);
}

export function setWIPCommentQuote(payload, callback) {
  return SimpleDispatchActionToReducer("SET_WIP_COMMENT_QUOTE", payload, callback);
}

export function clearWIPCommentQuote(payload, callback) {
  return SimpleDispatchActionToReducer("CLEAR_WIP_COMMENT_QUOTE", payload, callback);
}

export function putWIPCommentImportant(payload, callback) {
  return dispatchActionToReducer(putWIPCommentImportantService(payload), "PUT_WIP_COMMENT_IMPORTANT_START", "PUT_WIP_COMMENT_IMPORTANT_SUCCESS", "PUT_WIP_COMMENT_IMPORTANT_FAIL", callback);
}

export function postWIPCommentClap(payload, callback) {
  return dispatchActionToReducer(postWIPCommentClapService(payload), "PUT_WIP_COMMENT_CLAP_START", "PUT_WIP_COMMENT_CLAP_SUCCESS", "PUT_WIP_COMMENT_CLAP_FAIL", callback);
}

export function addWIPCommentReact(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_WIP_COMMENT_REACT", payload, callback);
}

export function removeWIPCommentReact(payload, callback) {
  return SimpleDispatchActionToReducer("REMOVE_WIP_COMMENT_REACT", payload, callback);
}

export function postWIPClap(payload, callback) {
  return dispatchActionToReducer(postWIPClapService(payload), "POST_WIP_CLAP_START", "POST_WIP_CLAP_SUCCESS", "POST_WIP_CLAP_FAIL", callback);
}

export function addWIPReact(payload, callback) {
  return SimpleDispatchActionToReducer("ADD_WIP_REACT", payload, callback);
}

export function removeWIPReact(payload, callback) {
  return SimpleDispatchActionToReducer("REMOVE_WIP_REACT", payload, callback);
}

export function incomingProposalClap(payload, callback) {
  return SimpleDispatchActionToReducer("INCOMING_PROPOSAL_CLAP", payload, callback);
}

export function postWIPFavorite(payload, callback) {
  return dispatchActionToReducer(postWIPFavoriteService(payload), "POST_WIP_FAVORITE_START", "POST_WIP_FAVORITE_SUCCESS", "POST_WIP_FAVORITE_FAIL", callback);
}

export function favoriteWIP(payload, callback) {
  return SimpleDispatchActionToReducer("FAVORITE_WIP", payload, callback);
}

export function deleteWIP(payload, callback) {
  return dispatchActionToReducer(deleteWIPService(payload), "DELETE_WIP_START", "DELETE_WIP_SUCCESS", "DELETE_WIP_FAIL", callback);
}
