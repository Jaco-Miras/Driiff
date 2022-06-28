import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { sessionService } from "redux-react-session";
import {
  activateUser,
  archiveUser,
  checkDriffUserEmail,
  deactivateUser,
  deleteUser,
  getRoles,
  getUser,
  getUsers,
  getArchivedUsers,
  postExternalUserData,
  postInternalRequestForm,
  postMagicLink,
  postPasswordReset,
  postRequest,
  postUploadProfileImage,
  putExternalUserUpdate,
  putMagicLink,
  putUser,
  putUserRole,
  resetPassword,
  userGoogleLogin,
  userLogin,
  userLogout,
  unarchiveUser,
  updateUserType,
  resendInvitation,
  deleteInvitedUser,
  getUsersWithoutActivity,
} from "../../redux/actions/userAction";
import { useDriffActions, useSettings, useToaster, useTranslationActions } from "./index";
import { getAPIUrl, getCurrentDriffUrl } from "../../helpers/slugHelper";
import { toggleLoading } from "../../redux/actions/globalActions";
import { getDriffName } from "./useDriff";
import { isIPAddress } from "../../helpers/commonFunctions";
import { useHistory } from "react-router-dom";
import { browserName, deviceType, isAndroid, isIPad13, isTablet } from "react-device-detect";

export const userForceLogout = () => {
  if (localStorage.getItem("userAuthToken")) {
    if (["nilo@makedevelopment.com", "joules@makedevelopment.com", "jessryll@makedevelopment.com"].includes(JSON.parse(localStorage.getItem("userAuthToken")).user_auth.email)) {
      //alert("error :(");
      //console.log("error");
    }
  }
  /*localStorage.removeItem("userAuthToken");
  localStorage.removeItem("token");
  localStorage.removeItem("atoken");
  localStorage.removeItem("welcomeBanner");
  sessionService
    .deleteSession()
    .then(() => sessionService.deleteUser());*/
};

const useUserActions = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const toaster = useToaster();
  const driffActions = useDriffActions();
  const {
    generalSettings: { is_new },
    driffSettings,
    userSettings,
    setGeneralSetting,
    setReadAnnouncement,
  } = useSettings();

  const { _t } = useTranslationActions();

  const getUserFilter = useSelector((state) => state.users.getUserFilter);
  const { user: loggedUser } = useSelector((state) => state.session);

  const storeLoginToken = (payload) => {
    localStorage.setItem("userAuthToken", JSON.stringify(payload));
    localStorage.setItem("token", payload.download_token);
    localStorage.setItem("atoken", payload.auth_token);
  };

  const getFrontEndAuthUrl = (payload, returnUrl = "") => {
    if (returnUrl !== "") returnUrl = `/${btoa(returnUrl)}`;

    return `/authenticate/${payload.access_token}${returnUrl}`;
  };

  const processBackendLogin = (payload, returnUrl) => {
    let redirectLink = `${getCurrentDriffUrl()}${getFrontEndAuthUrl(payload, returnUrl)}`;
    window.location.href = `${getAPIUrl({ isDNS: true })}/auth-web/login?token=${payload.auth_token}&redirect_link=${redirectLink}`;
  };

  const checkCredentials = (payload, callback = () => {}) => {
    dispatch(
      userLogin(payload, (err, res) => {
        if (err) {
          toaster.error(<>Invalid email or password.</>);
        }
        callback(err, res);
      })
    );
  };

  const login = (payload, returnUrl) => {
    storeLoginToken(payload);
    processBackendLogin(payload, returnUrl);
  };

  const googleLogin = () => {
    let payload = {
      slug: getDriffName(),
    };

    if (isIPAddress(window.location.hostname)) {
      const { hostname, port } = window.location;
      payload.redirect_ip_address = `http://${hostname}:${port}`;
    }

    dispatch(
      userGoogleLogin(payload, (err, res) => {
        if (res) {
          toaster.notify("Logging in via Google.");
          window.location.href = res.data.google_url;
        }
      })
    );
  };

  const checkEmail = (email, callback = () => {}) => {
    dispatch(
      checkDriffUserEmail(
        {
          email: email,
          driff: localStorage.getItem("slug"),
        },
        callback
      )
    );
  };

  const sendMagicLink = (email, callback = () => {}) => {
    dispatch(
      postMagicLink(
        {
          email: email,
        },
        (err, res) => {
          if (err) {
            toaster.error(<>Not allowed for external users.</>);
          }
          if (res) {
            toaster.success(
              <>
                Link was sent to <b>{email}</b>
              </>
            );
          }
          callback(err, res);
        }
      )
    );
  };

  const checkMagicLink = (token, callback = () => {}) => {
    dispatch(
      putMagicLink(
        {
          token: token,
        },
        (err, res) => {
          if (err) {
            toaster.error(<>Token expired or not working.</>);
          }
          callback(err, res);
        }
      )
    );
  };

  const fetch = ({ skip = 0, limit = getUserFilter.limit, ...res }, callback = () => {}) => {
    dispatch(
      getUsers(
        {
          ...res,
          skip: skip,
          limit: limit,
        },
        callback
      )
    );
  };

  const fetchMore = () => {
    if (getUserFilter.hasMore) {
      fetch(getUserFilter.skip, getUserFilter.limit);
    }
  };

  const fetchById = (userId, callback = () => {}) => {
    dispatch(getUser({ id: userId }, callback));
  };

  const update = (user, callback = () => {}) => {
    const allowed = [
      "id",
      "first_name",
      "last_name",
      "middle_name",
      "name",
      "password",
      "role_ids",
      "company",
      "company_name",
      "designation",
      "skills",
      "email",
      "contact",
      "place",
      "address",
      "house_number",
      "country",
      "zip_code",
      "birthday",
      "gender",
      "timezone",
      "language",
      "change_email",
    ];

    let payload = {};
    allowed.forEach((field) => {
      payload = {
        ...payload,
        [field]: user[field],
      };

      if (field === "password") {
        if (user[field]) {
          payload = {
            ...payload,
            type: 2,
          };
        } else {
          payload = {
            ...payload,
            password: "",
            type: 0,
          };
        }
      }
    });

    dispatch(
      putUser(payload, (err, res) => {
        if (err) {
          toaster.error("Saving profile information failed.");
        }

        if (res) {
          if (loggedUser.id === res.data.id) {
            sessionService.saveUser({ ...res.data });
          }
          toaster.success("Profile information saved.");
        }

        callback(err, res);
      })
    );
  };

  const getReadOnlyFields = (source) => {
    switch (source) {
      case "gripp":
        return [];
      //return ["email", "designation", "house_number", "zip", "address", "place", "country", "birthday", "profile_image", "contact"];
      default:
        return [];
    }
  };

  const getRequiredFields = (source) => {
    let required = ["first_name", "last_name", "password", "email"];

    switch (source) {
      case "gripp":
        return required;
      default:
        return required;
    }
  };

  /**
   * @param {Object} user
   * @param {File} file
   * @param {Object} callback
   */
  const updateProfileImage = (user, file, callback = () => {}) => {
    const payload = {
      id: user.id,
      file: file,
    };
    dispatch(
      postUploadProfileImage(payload, (err, res) => {
        if (err) {
          toaster.error("Profile image upload failed.");
          callback(err);
        }

        if (res) {
          user.profile_image_id = parseInt(res.data.profile_media_id);
          update(user, callback);
        }
      })
    );
  };

  const fetchStateCode = (stateCode, callback) => {
    dispatch(
      postExternalUserData(
        {
          state_code: stateCode,
        },
        (err, res) => {
          if (err) {
            toaster.error(<>Invalid code.</>);
          }

          callback(err, res);
        }
      )
    );
  };

  const updateExternalUser = (payload, callback) => {
    dispatch(
      putExternalUserUpdate(payload, (err, res) => {
        callback(err, res);
      })
    );
  };

  const updatePassword = (payload, callback) => {
    dispatch(
      postPasswordReset(payload, (err, res) => {
        if (err) {
          toaster.error(<>Invalid or expired token.</>);
          callback(err, res);
        }

        if (res) {
          toaster.success(<>Password is successfully updated. You are being logged in!</>);
          const redirectUrl = res.data.user_auth.type === "internal" ? "/chat" : "/workspace/chat";
          login(res.data, redirectUrl);
        }
      })
    );
  };

  const requestPasswordReset = (email, callback) => {
    dispatch(
      resetPassword(
        {
          email: email,
        },
        (err, res) => {
          if (err) {
            toaster.error("Email not found");
          }
          if (res) {
            toaster.success(
              <>
                Password reset link sent to <b>{email}</b>. Please check.
              </>
            );
          }
          callback(err, res);
        }
      )
    );
  };

  const processBackendLogout = () => {
    let redirectLink = `${getCurrentDriffUrl()}/logged-out`;
    window.location.href = `${getAPIUrl({ isDNS: true })}/auth-web/logout?redirect_link=${redirectLink}`;
  };

  const logout = (callback = () => {}) => {
    dispatch(toggleLoading(true));
    dispatch(
      userLogout({}, (err, res) => {
        localStorage.removeItem("userAuthToken");
        localStorage.removeItem("token");
        localStorage.removeItem("atoken");
        localStorage.removeItem("welcomeBanner");
        sessionService
          .deleteSession()
          .then(() => sessionService.deleteUser())
          .then(() => {
            const host = window.location.host.split(".");
            if ((deviceType === "mobile" && browserName === "WebKit") || isTablet || isIPad13) {
              if (host.length === 3) {
                window.webkit.messageHandlers.driffLogout.postMessage({ slug: host[0], status: "OK" });
              }
            }
            if (deviceType === "mobile" && isAndroid) {
              window.webAppInterface.changeActivity();
            }

            dispatch(
              toggleLoading(false, () => {
                toaster.success("You are logged out");
              })
            );
          })
          .then(() => callback(err, res));
      })
    );
  };

  /**
   * @param {Object} user
   * @param {string} user.email
   * @param {string} user.firstname
   * @param {string} user.middlename
   * @param {string} user.lastname
   * @param {Object} callback
   */
  const register = (payload, callback = () => {}) => {
    checkEmail(payload.email, (err, res) => {
      if (res && !res.data.status) {
        dispatch(
          postRequest(payload, (err, res) => {
            if (err) {
              toaster.error("User registration failed.");
            }
            // if (res) {
            //   toaster.success("Slug request sent. Please wait for admin to cross-check. You'll recieve further notification on your email.", {
            //     duration: 10000,
            //   });
            // }
            if (res) {
              login(res.data, "/dashboard");
            }
            callback(err, res);
          })
        );
      } else {
        toaster.error(`Email ${payload.email} is already taken`);
        callback({
          field: {
            email: <>{payload.email} is already taken.</>,
          },
        });
      }
    });
  };

  const displayWelcomeBanner = () => {
    if (!localStorage.getItem("welcomeBanner")) {
      localStorage.setItem("welcomeBanner", "init");
      const slugName = driffActions.getName();
      if (is_new) {
        toaster.success(
          <>
            Welcome to <b>{slugName}</b> driff, {loggedUser.first_name}
          </>
        );
        setGeneralSetting({
          is_new: false,
        });
      } else {
        if (driffSettings.ANNOUNCEMENT_AT && driffSettings.ANNOUNCEMENT_LINK && driffSettings.ANNOUNCEMENT_LINK !== "") {
          let link = null;
          if (userSettings.READ_ANNOUNCEMENT) {
            if (userSettings.READ_ANNOUNCEMENT.timestamp < driffSettings.ANNOUNCEMENT_AT.timestamp) {
              link = driffSettings.ANNOUNCEMENT_LINK.split("posts/");
              link = `/posts/${link[1]}`;
              // trigger read action
              setReadAnnouncement();
            }
          } else {
            link = driffSettings.ANNOUNCEMENT_LINK.split("posts/");
            link = `/posts/${link[1]}`;
            // trigger read action
            setReadAnnouncement();
          }
          if (link) history.push(link);
        }
        toaster.success(<>Welcome back, {loggedUser.first_name}</>);
      }
    }
  };

  const inviteAsInternalUsers = (payload, callback) => {
    dispatch(postInternalRequestForm(payload, callback));
  };

  const updateUserRole = (payload, callback = () => {}) => {
    dispatch(putUserRole(payload, callback));
  };

  const fetchRoles = () => {
    dispatch(getRoles());
  };

  const archive = (payload, callback) => {
    dispatch(archiveUser(payload, callback));
  };

  const unarchive = (payload, callback) => {
    dispatch(unarchiveUser(payload, callback));
  };

  const activate = (payload, callback) => {
    dispatch(activateUser(payload, callback));
  };

  const deactivate = (payload, callback) => {
    dispatch(deactivateUser(payload, callback));
  };

  const fetchArchivedUsers = () => {
    dispatch(getArchivedUsers());
  };

  const updateType = (user, type) => {
    dispatch(
      updateUserType({ id: user.id, type: type }, (err, res) => {
        if (err) return;
        toaster.success(`${_t("TOASTER.CHANGE_USER_TYPE", "Change user type to ::type::", { type: type })}`);
      })
    );
  };

  const deleteUserAccount = (payload, callback) => {
    dispatch(deleteUser(payload, callback));
  };

  const resendInvitationEmail = (payload, callback) => {
    dispatch(resendInvitation(payload, callback));
  };

  const deleteInvitedInternalUser = (payload, callback) => {
    dispatch(deleteInvitedUser(payload, callback));
  };

  const fetchUsersWithoutActivity = (payload, callback) => {
    dispatch(getUsersWithoutActivity(payload, callback));
  };

  return {
    checkCredentials,
    login,
    register,
    googleLogin,
    storeLoginToken,
    processBackendLogin,
    requestPasswordReset,
    checkEmail,
    sendMagicLink,
    checkMagicLink,
    fetch,
    fetchStateCode,
    update,
    updateProfileImage,
    updateExternalUser,
    updatePassword,
    fetchById,
    fetchMore,
    getReadOnlyFields,
    getRequiredFields,
    processBackendLogout,
    logout,
    displayWelcomeBanner,
    inviteAsInternalUsers,
    updateUserRole,
    fetchRoles,
    archive,
    unarchive,
    activate,
    deactivate,
    fetchArchivedUsers,
    updateType,
    deleteUserAccount,
    resendInvitationEmail,
    deleteInvitedInternalUser,
    fetchUsersWithoutActivity,
  };
};

export default useUserActions;
