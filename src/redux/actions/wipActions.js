import dispatchActionToReducer, { SimpleDispatchActionToReducer } from "../actionDispatcher";
import { postSubject as postSubjectService, postWIP as postWIPService, getSubjects as getSubjectsService, getWIPs as getWIPsService, getWIPDetail as getWIPDetailService } from "../services";

export function postSubject(payload, callback) {
  return dispatchActionToReducer(postSubjectService(payload), "CREATE_WIP_SUBJECT_START", "CREATE_WIP_SUBJECT_SUCCESS", "CREATE_WIP_SUBJECT_FAIL", callback);
}

export function postWIP(payload, callback) {
  return dispatchActionToReducer(postWIPService(payload), "CREATE_WIP_START", "CREATE_WIP_SUCCESS", "CREATE_WIP_FAIL", callback);
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