/**
 * @function Calls the service and then dispatch action Object as a response to reducer.
 * @param service - Name of the Service that handles all the input parameters required to be pass in service.
 * @param actionTypeStart - type : action start
 * @param actionTypeSuccess - type : action Success
 * @param actionTypeFailure - type : action Failure
 * @returns {function()}
 * @constructor
 */
//import React from "react";
import { userForceLogout } from "../../components/hooks/useUserActions";

export default function DispatchActionToReducer(service, actionTypeStart, actionTypeSuccess, actionTypeFailure, callback) {
  return (dispatch) => {
    dispatch({
      type: actionTypeStart,
    });
    service
      .then((result) => {
        if (result.status === 200 || result.status === 201 || result.status === 204) {
          dispatch({
            type: actionTypeSuccess,
            data: result.data,
          });
          if (callback) callback(null, result);
        } else {
          dispatch({
            type: actionTypeFailure,
            error: result,
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422 || error.response.status === 403) {
            // let errorEntries = Object.entries(error.response.data.errors);
            // let errorStringTitle = "Something went wrong";
            // let errorString = "";
            // for (let i = 0, l = errorEntries.length; i < l; i++) {
            //   let currentError = errorEntries[i];
            //   for (let j = 0, l = currentError[1].length; j < l; j++) {
            //     let currentParseError = currentError[1][j];
            //     errorString += `${currentParseError}`;
            //   }
            // }
            // // this error for validation or not authorized user.
            // toastr.warning(errorStringTitle, {
            //   component: () => <div dangerouslySetInnerHTML={{ __html: errorString }} />,
            // });
          }
          // not authenticated user.
          if (error.response.status === 401) {
            userForceLogout();
          }
          // internal server error
          // if (error.response.status === 500) {
          // }
          dispatch({
            type: actionTypeFailure,
            error,
          });
          if (callback) callback(error);
        } else {
          userForceLogout();
        }
      });
  };
}

export function SimpleDispatchActionToReducer(type, data, callback) {
  return (dispatch) => {
    dispatch({ type, data });
    if (callback) callback();
  };
}
