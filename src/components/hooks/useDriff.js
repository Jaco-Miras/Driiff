import {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {$_GET, isIPAddress} from "../../helpers/commonFunctions";
import {patchCheckDriff} from "../../redux/actions/driffAction";

let init = true;

export const getDriffName = () => {
    let driff = $_GET("driff");
    if (driff) {
        return driff;
    }

    driff = localStorage.getItem("slug");
    if (driff) {
        return driff;
    }

    if (isIPAddress(window.location.hostname)) {
        return null;
    }

    //process slug name from host name
    let hostnameArr = window.location.hostname.split(".");
    if (hostnameArr.length >= 3) {
        return hostnameArr[0];
    } else if (hostnameArr[0] === "localhost") {
        return null;
    } else {
        return false;
    }
};

const useDriff = (members = []) => {

    const dispatch = useDispatch();
    const [redirected, setRedirected] = useState(null);
    const [registeredDriff, setRegisteredDriff] = useState(null);

    const setDriff = useCallback((driffName) => {
        localStorage.setItem("slug", driffName);
        setRegisteredDriff(driffName);
        setRedirected(false);
    }, [setRedirected, setRegisteredDriff]);

    const getRedirect = () => {
        if (isIPAddress(window.location.hostname)) {
            return `${process.env.REACT_APP_apiProtocol}${window.location.hostname}`;
        }

        if (window.location.hostname === "localhost") {
            return `${process.env.REACT_APP_apiProtocol}localhost`;
        }

        return `${process.env.REACT_APP_apiProtocol}${process.env.REACT_APP_localDNSName}`;
    };

    const checkDriffName = useCallback((driffName, callback) => {
        dispatch(
            patchCheckDriff(driffName, callback),
        );
    }, [dispatch]);

    useEffect(() => {
        if (init) {
            init = false;

            const driffName = getDriffName();

            if (driffName === null) {
                setRedirected(false);
            } else if (driffName === false) {
                localStorage.removeItem("slug");
                setRedirected(true);
            } else {
                checkDriffName(driffName, (err, res) => {
                    if (res.data.status) {
                        setDriff(driffName);
                    } else {
                        localStorage.removeItem("slug");
                        setRedirected(true);
                    }
                });
            }
        }
    }, []);

    return {
        setDriff,
        checkDriffName,
        redirected,
        registeredDriff,
        getRedirect,
        getDriffName,
    };
};

export default useDriff;