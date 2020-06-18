import {useCallback, useEffect} from "react";
import {useDispatch} from "react-redux";
import {useHistory, useRouteMatch} from "react-router-dom";
import {sessionService} from "redux-react-session";
import {getAPIUrl, getCurrentDriffUrl} from "../../helpers/slugHelper";
import {toggleLoading} from "../../redux/actions/globalActions";
import {userLogout} from "../../redux/actions/userAction";

const useUserLogout = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const {path} = useRouteMatch();

    const logout = useCallback(() => {
        dispatch(
            toggleLoading(true),
        );
        dispatch(
            userLogout({}, () => {
                localStorage.removeItem("userAuthToken");
                localStorage.removeItem("token");
                localStorage.removeItem("atoken");
                sessionService
                    .deleteSession()
                    .then(() => sessionService.deleteUser())
                    .then(() => {
                        history.push("/login");
                        dispatch(
                            toggleLoading(false),
                        );
                    });
            }),
        );
    }, [dispatch]);

    useEffect(() => {
        //log-out from the backend
        if (path === "/logout") {
            let redirectLink = `${getCurrentDriffUrl()}/logged-out`;
            window.location.href = `${getAPIUrl({isDNS: true})}/auth-web/logout?redirect_link=${redirectLink}`;
        }

        //log-out from the system
        if (path === "/logged-out") {
            logout();
        }

    }, [path, dispatch, history]);

    return {
        logout,
    };
};

export default useUserLogout;