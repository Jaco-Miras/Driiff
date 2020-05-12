/**
 * @function Calls the service and then dispatch action Object as a response to reducer.
 * @param service - Name of the Service that handles all the input parameters required to be pass in service.
 * @param actionTypeStart - type : action start
 * @param actionTypeSuccess - type : action Success
 * @param actionTypeFailure - type : action Failure
 * @returns {function()}
 * @constructor
 */
import React from "react";
import {toastr} from "react-redux-toastr";
// import {getBaseUrl, getSlugName, processDriffLogout} from "../../helpers/slugHelper";

export default function DispatchActionToReducer(
    service,
    actionTypeStart,
    actionTypeSuccess,
    actionTypeFailure,
    callback,
) {
    return dispatch => {
        dispatch({
            type: actionTypeStart,
        });
        service
            .then(result => {
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
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 422 || error.response.status === 403) {
                        let errorEntries = Object.entries(error.response.data.errors);
                        let errorStringTitle = "Something went wrong";
                        let errorString = "";
                        for (let i = 0, l = errorEntries.length; i < l; i++) {
                            let currentError = errorEntries[i];
                            for (let j = 0, l = currentError[1].length; j < l; j++) {
                                let currentParseError = currentError[1][j];
                                errorString += `${currentParseError}`;
                            }
                        }
                        // this error for validation or not authorized user.
                        toastr.warning(errorStringTitle, {
                            component: () => (<div dangerouslySetInnerHTML={{__html: errorString}}/>),
                        });
                    }
                    // not authenticated user.
                    if (error.response.status === 401) {
                        //processDriffLogout();
                        //return window.location = getBaseUrl() + "/login";
                    }
                    // internal server error
                    if (error.response.status === 500) {
                        // check the url subdomain and localstorage
                        // if not match this will force to delete the user session and redirect to page slugname
                        // let currentSubdomain = window.location.hostname.split(".")[0];
                        // if (currentSubdomain !== getSlugName()) {
                        //     // force delete user session
                        //     // sessionService.deleteSession().then(() => sessionService.deleteUser());
                        // }
                        // last internal server error from API
                        console.log(error.response.data);
                    }
                    dispatch({
                        type: actionTypeFailure,
                        error,
                    });
                    if (callback) callback(error);
                } 
            });
    };
}

export function SimpleDispatchActionToReducer(type, data, callback) {
    return dispatch => {
        dispatch({type, data});
        if (callback) callback();
    };
}
