import React, {useEffect} from "react";
import {sessionService} from "redux-react-session";

const AuthenticateUserPanel = (props) => {

    useEffect(() => {
        const {
            history,
            match: {
                params: {
                    token,
                    returnUrl,
                },
            },
        } = props;

        let userAuthToken = localStorage.getItem("userAuthToken");
        let goTo = atob(returnUrl);

        if (userAuthToken) {
            let dataSet = JSON.parse(userAuthToken);

            if (dataSet.access_token !== token) {
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

                    if (returnUrl) {
                        history.push(goTo);
                    }
                });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <></>
    );
};
export default React.memo(AuthenticateUserPanel);