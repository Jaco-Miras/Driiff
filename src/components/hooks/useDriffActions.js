import { useDispatch } from "react-redux";
import { patchCheckDriff, patchUpdateDriffVersion, postRegisterDriff } from "../../redux/actions/driffActions";
import { isIPAddress } from "../../helpers/commonFunctions";
import { useToaster } from "./index";
import { driffData } from "../../config/environment.json";

const useDriffActions = () => {
  const dispatch = useDispatch();
  const toaster = useToaster();

  /**
   * @param {string} driffName
   */
  const checkUpdateVersion = (callback = () => {}) => {
    if (!localStorage.getItem("site_ver")) {
      localStorage.setItem("site_ver", driffData.version);
    } else {
      const storageVersion = parseFloat(localStorage.getItem("site_ver").substr(2));
      const latestVersion = parseFloat(driffData.version.substr(2));
      if (storageVersion < latestVersion) {
        dispatch(
          patchUpdateDriffVersion(
            {
              version: driffData.version,
              requirement: driffData.requirement,
            },
            (err, res) => {
              if (res) {
                localStorage.setItem("site_ver", JSON.parse(res.config.data).data.version);
              }
              callback(err, res);
            }
          )
        );
      }
    }
  };

  /**
   * @param {string} driffName
   */
  const check = (driffName, callback = () => {}) => {
    dispatch(patchCheckDriff(driffName, callback));
  };

  const getBaseUrl = () => {
    if (isIPAddress(window.location.hostname)) {
      return `${process.env.REACT_APP_apiProtocol}${window.location.hostname}`;
    }

    if (window.location.hostname === "localhost") {
      return `${process.env.REACT_APP_apiProtocol}localhost`;
    }

    return `${process.env.REACT_APP_apiProtocol}${process.env.REACT_APP_localDNSName}`;
  };

  const getName = () => {
    let driff = localStorage.getItem("slug");
    if (driff) {
      return driff;
    } else {
      const host = window.location.host.split(".");
      if (host.length === 3) {
        localStorage.setItem("slug", host[0]);
        return host[0];
      } else {
        return null;
      }
    }
  };

  const unStoreName = () => {
    localStorage.removeItem("slug");
  };

  const storeName = (name, force = false) => {
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
  };

  const getByHostname = () => {
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
  };

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
  const create = (payload, callback = () => {}) => {
    dispatch(
      postRegisterDriff(payload, (err, res) => {
        if (err) {
          console.log(err.response.data.errors);
          toaster.error(err.response.data.errors.company_name);
        }

        if (res) {
          toaster.success("Driff successfully created.");
        }
        callback(err, res);
      })
    );
  };

  return {
    checkUpdateVersion,
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
