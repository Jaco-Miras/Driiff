import {useCallback} from "react";
import {useDispatch} from "react-redux";
import {patchCheckDriff, postRegisterDriff} from "../../redux/actions/driffActions";
import {isIPAddress} from "../../helpers/commonFunctions";
import {useToaster} from "./index";

const useDriffActions = () => {

  const dispatch = useDispatch();
  const toaster = useToaster();

  /**
   * @param {string} driffName
   */
  const check = useCallback(
    (driffName, callback = () => {
    }) => {
      dispatch(patchCheckDriff(driffName, callback));
    },
    [dispatch]
  );

  const getBaseUrl = useCallback(() => {
    if (isIPAddress(window.location.hostname)) {
      return `${process.env.REACT_APP_apiProtocol}${window.location.hostname}`;
    }

    if (window.location.hostname === "localhost") {
      return `${process.env.REACT_APP_apiProtocol}localhost`;
    }

    return `${process.env.REACT_APP_apiProtocol}${process.env.REACT_APP_localDNSName}`;
  }, []);

  const getName = useCallback(() => {
    let driff = localStorage.getItem("slug");
    if (driff) {
      return driff;
    } else {
      return null;
    }
  }, []);

  const unStoreName = useCallback(() => {
    localStorage.removeItem("slug");
  }, [])

  const storeName = useCallback((name, force = false) => {
    if (force) {
      localStorage.setItem("slug", name);
    } else {
      check(name, (err, res) => {
        if (res && res.status) {
          localStorage.setItem("slug", name);
        } else {
          unStoreName();
        }
      });
    }
  }, []);

  const getByHostname = useCallback(() => {
    if (isIPAddress(window.location.hostname) || window.location.hostname === "localhost") {
      return null;
    }

    if (window.location.hostname === process.env.REACT_APP_localDNSName) {
      return null;
    }

    //process slug name from host name
    let hostnameArr = window.location.hostname.split(".");
    if (hostnameArr.length >= 3) {
      return hostnameArr[0];
    } else {
      return false;
    }
  }, []);

  /**
   * This function will call on the API to process driff registration
   *
   * @param {Object} payload
   * @param {string} payload.company_name
   * @param {string} payload.password
   * @param {string} payload.email
   * @param {string} payload.slug
   * @param {string} payload.user_name
   * @param {array} payload.invitations
   * @param {number} payload.free_account
   * @param {number} payload.topic_id
   * @param {string} payload.topic_name
   * @param {string} payload.slug_from
   * @param {string} payload.invited_by
   * @param {number} payload.invited_by_id
   */
  const create = useCallback(
    (payload, callback = () => {
    }) => {
      dispatch(postRegisterDriff(payload, (err, res) => {
        if (err) {
          toaster.success("Something went wrong!");
        }

        if (res) {
          toaster.success("Driff successfully created.");
        }
        callback(err, res);
      }));
    },
    [dispatch]
  );

  return {
    check,
    create,
    getBaseUrl,
    getName,
    getByHostname,
    storeName,
    unStoreName,
  };
};

export default useDriffActions;
