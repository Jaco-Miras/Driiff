import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {sessionService} from "redux-react-session";
import {getAPIUrl, getCurrentDriffUrl} from "../../helpers/slugHelper";
import {toggleLoading} from "../../redux/actions/globalActions";
import {userLogout} from "../../redux/actions/userAction";

const useUserLogout = (props) => {

    const dispatch = useDispatch();
    const {path} = props.match;

    useEffect(() => {
        //log-out from the backend
        if (path === "/logout") {
            let redirectLink = `${getCurrentDriffUrl()}/logged-out`;
            window.location.href = `${getAPIUrl({isDNS: true})}/auth-web/logout?redirect_link=${redirectLink}`;
        }

        //log-out from the system
        if (path === "/logged-out") {
            dispatch(
                toggleLoading(true),
            );
            dispatch(
                userLogout({}, (err, ress) => {
                    localStorage.removeItem("userAuthToken");
                    localStorage.removeItem("token");
                    localStorage.removeItem("atoken");
                    localStorage.clear();
                    sessionService
                        .deleteSession()
                        .then(() => sessionService.deleteUser())
                        .then(() => {
                            props.history.push("/login");
                            dispatch(
                                toggleLoading(false),
                            );
                        });
                }),
            );
        }

    }, [path, dispatch, props.history]);
};

export default useUserLogout;