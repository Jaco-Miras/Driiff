import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {sessionService} from "redux-react-session";
import {getAPIUrl, getCurrentDriffUrl} from "../../helpers/slugHelper";
import {userLogout} from "../../redux/actions/userAction";

const useUserLogout = (props) => {

    const dispatch = useDispatch();
    const {path} = props.match;

    useEffect(() => {
        if (path === "/logout") {
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
                            let redirectLink = `${getCurrentDriffUrl()}/login`;
                            window.location.href = `${getAPIUrl({isDNS: true})}/auth-web/logout?redirect_link=${redirectLink}`;
                        });
                }),
            );
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

export default useUserLogout;