import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useHistory, useRouteMatch} from "react-router-dom";
import {sessionService} from "redux-react-session";
import {$_GET, getUrlParams} from "../../helpers/commonFunctions";
import {getAPIUrl, getCurrentDriffUrl} from "../../helpers/slugHelper";
import {authenticateGoogleLogin} from "../../redux/actions/userAction";

export const storeLoginToken = (payload) => {
    localStorage.setItem("userAuthToken", JSON.stringify(payload));
    localStorage.setItem("token", payload.download_token);
    localStorage.setItem("atoken", payload.auth_token);
};

export const getFrontEndAuthUrl = (payload, returnUrl = "") => {
    if (returnUrl !== "")
        returnUrl = `/${btoa(returnUrl)}`;

    return `/authenticate/${payload.access_token}${returnUrl}`;
};

export const processBackendLogin = (payload, returnUrl) => {
    let redirectLink = `${getCurrentDriffUrl()}${getFrontEndAuthUrl(payload, returnUrl)}`;
    window.location.href = `${getAPIUrl({isDNS: true})}/auth-web/login?token=${payload.auth_token}&redirect_link=${redirectLink}`;
};

export const useUserLogin = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const authMatch = useRouteMatch("/authenticate/:token/:returnUrl?");

    useEffect(() => {

        //authenticate user login from backend
        if (authMatch !== null) {
            let userAuthToken = localStorage.getItem("userAuthToken");
            let goTo = atob(authMatch.params.returnUrl);

            if (userAuthToken) {
                let dataSet = JSON.parse(userAuthToken);

                if (dataSet.access_token !== authMatch.params.token) {
                    localStorage.removeItem("userAuthToken");
                }

                //LogRocket.identify(dataSet.user_auth.id, dataSet.user_auth);
                sessionService
                    .saveSession({
                        token: `${dataSet.token_type} ${dataSet.access_token}`,
                        xsrf_token: `XSRF-TOKEN=${dataSet.access_token}`,
                        access_broadcast_token: `${dataSet.access_broadcast_token}`,
                        download_token: `${dataSet.download_token}`,
                    })
                    .then(() => {
                        sessionService
                            .saveUser({
                                ...dataSet.user_auth,
                            });

                        if (localStorage.getItem("promptTrustDevice") === "1") {
                            localStorage.removeItem("promptTrustDevice");
                            let cb = {
                                id: new Date().getTime(),
                                type: "modal",
                                modal: "modal_dialog_yes_no",
                                title: `Trust this device?`,
                                children: "",
                                callback: {
                                    handleYes: this.handleConfirmationDialogYes,
                                },
                            };

                            /**
                             * @todo Add modal
                             */
                            console.log(cb);
                            //this.props.redux.action.openModal(cb);
                        }

                        if (authMatch.params.returnUrl) {
                            history.push(goTo);
                        }
                    });
            }
        }

        //process google login
        if ($_GET("code") && $_GET("state")) {
            const payload = getUrlParams(window.location.href);
            dispatch(
                authenticateGoogleLogin(payload, (err, res) => {
                    console.log(err);

                    if (res) {
                        storeLoginToken(res.data);
                        history.push(getFrontEndAuthUrl(res.data, "/workspace/dashboard"));
                    }
                }),
            );
        }
    }, [authMatch, dispatch, history, props]);
};