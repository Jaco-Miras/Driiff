import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sessionService } from "redux-react-session";
import {
  activateUser,
  archiveUser,
  checkDriffUserEmail,
  deactivateUser,
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
} from "../../redux/actions/userAction";
import { useDriffActions, useSettings, useToaster, useTranslation } from "./index";
import { getAPIUrl, getCurrentDriffUrl } from "../../helpers/slugHelper";
import { toggleLoading } from "../../redux/actions/globalActions";
import { getDriffName } from "./useDriff";
import { isIPAddress } from "../../helpers/commonFunctions";
import { useHistory } from "react-router-dom";

export const userForceLogout = () => {
  if (localStorage.getItem("userAuthToken")) {
    if (["nilo@makedevelopment.com", "joules@makedevelopment.com", "jessryll@makedevelopment.com"].includes(JSON.parse(localStorage.getItem("userAuthToken")).user_auth.email)) {
      //alert("error :(");
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

  const { _t } = useTranslation();

  //const { getUserFilter } = useSelector((state) => state.users);
  const getUserFilter = useSelector((state) => state.users.getUserFilter);
  const { user: loggedUser } = useSelector((state) => state.session);

  const storeLoginToken = useCallback((payload) => {
    localStorage.setItem("userAuthToken", JSON.stringify(payload));
    localStorage.setItem("token", payload.download_token);
    localStorage.setItem("atoken", payload.auth_token);
  }, []);

  const getFrontEndAuthUrl = useCallback((payload, returnUrl = "") => {
    if (returnUrl !== "") returnUrl = `/${btoa(returnUrl)}`;

    return `/authenticate/${payload.access_token}${returnUrl}`;
  }, []);

  const processBackendLogin = useCallback((payload, returnUrl) => {
    let redirectLink = `${getCurrentDriffUrl()}${getFrontEndAuthUrl(payload, returnUrl)}`;
    window.location.href = `${getAPIUrl({ isDNS: true })}/auth-web/login?token=${payload.auth_token}&redirect_link=${redirectLink}`;
  }, []);

  const checkCredentials = useCallback((payload, callback = () => {}) => {
    dispatch(
      userLogin(payload, (err, res) => {
        if (err) {
          toaster.error(<>Invalid email or password.</>);
        }
        callback(err, res);
      })
    );
  }, []);

  const login = useCallback((payload, returnUrl) => {
    storeLoginToken(payload);
    processBackendLogin(payload, returnUrl);
  }, []);

  const googleLogin = useCallback(() => {
    let payload = {
      slug: getDriffName(),
    };

    if (isIPAddress(window.location.hostname)) {
      const { hostname, port } = window.location;
      payload.redirect_ip_address = `http://${hostname}:${port}`;
    }

    dispatch(
      userGoogleLogin(payload, (err, res) => {
        if (err) {
          //console.log(err);
        }
        if (res) {
          toaster.notify("Logging in via Google.");
          window.location.href = res.data.google_url;
        }
      })
    );
  }, []);

  const checkEmail = useCallback((email, callback = () => {}) => {
    dispatch(
      checkDriffUserEmail(
        {
          email: email,
          driff: localStorage.getItem("slug"),
        },
        callback
      )
    );
  }, []);

  const sendMagicLink = useCallback((email, callback = () => {}) => {
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
  }, []);

  const checkMagicLink = useCallback((token, callback = () => {}) => {
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
  }, []);

  const fetch = useCallback(
    ({ skip = 0, limit = getUserFilter.limit, ...res }, callback = () => {}) => {
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
    },
    [dispatch, getUserFilter.limit]
  );

  const fetchMore = useCallback(() => {
    if (getUserFilter.hasMore) {
      fetch(getUserFilter.skip, getUserFilter.limit);
    }
  }, [fetch, getUserFilter]);

  const fetchById = useCallback(
    (userId, callback = () => {}) => {
      dispatch(getUser({ id: userId }, callback));
    },
    [dispatch]
  );

  const update = useCallback(
    (user, callback = () => {}) => {
      const allowed = [
        "id",
        "first_name",
        "last_name",
        "middle_name",
        "name",
        "password",
        "role_id",
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
    },
    [dispatch]
  );

  const getReadOnlyFields = useCallback((source) => {
    switch (source) {
      case "gripp":
        return [];
      //return ["email", "designation", "house_number", "zip", "address", "place", "country", "birthday", "profile_image", "contact"];
      default:
        return [];
    }
  }, []);

  const getRequiredFields = useCallback((source) => {
    let required = ["first_name", "last_name", "password", "email"];

    switch (source) {
      case "gripp":
        return required;
      default:
        return required;
    }
  }, []);

  /**
   * @param {Object} user
   * @param {File} file
   * @param {Object} callback
   */
  const updateProfileImage = useCallback((user, file, callback = () => {}) => {
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
  }, []);

  const fetchStateCode = useCallback((stateCode, callback) => {
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
  }, []);

  const updateExternalUser = useCallback((payload, callback) => {
    dispatch(
      putExternalUserUpdate(payload, (err, res) => {
        callback(err, res);
      })
    );
  }, []);

  const updatePassword = useCallback((payload, callback) => {
    dispatch(
      postPasswordReset(payload, (err, res) => {
        if (err) {
          toaster.error(<>Invalid or expired token.</>);
          callback(err, res);
        }

        if (res) {
          toaster.success(<>Password is successfully updated. You are being logged in!</>);
          login(res.data);
        }
      })
    );
  }, []);

  const requestPasswordReset = useCallback((email, callback) => {
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
  }, []);

  const processBackendLogout = useCallback(() => {
    let redirectLink = `${getCurrentDriffUrl()}/logged-out`;
    window.location.href = `${getAPIUrl({ isDNS: true })}/auth-web/logout?redirect_link=${redirectLink}`;
  }, []);

  const logout = useCallback((callback = () => {}) => {
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
            dispatch(
              toggleLoading(false, () => {
                toaster.success("You are logged out");
              })
            );
          })
          .then(() => callback(err, res));
      })
    );
  }, []);

  /**
   * @param {Object} user
   * @param {string} user.email
   * @param {string} user.firstname
   * @param {string} user.middlename
   * @param {string} user.lastname
   * @param {Object} callback
   */
  const register = useCallback((payload, callback = () => {}) => {
    checkEmail(payload.email, (err, res) => {
      if (res && !res.data.status) {
        dispatch(
          postRequest(payload, (err, res) => {
            if (err) {
              toaster.error("User registration failed.");
            }
            if (res) {
              toaster.success("Slug request sent. Please wait for admin to cross-check. You'll recieve further notification on your email.", {
                duration: 10000,
              });
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
  }, []);

  const displayWelcomeBanner = useCallback(() => {
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
  }, [loggedUser, driffActions, is_new, driffSettings, userSettings]);

  const inviteAsInternalUsers = useCallback((payload, callback) => {
    dispatch(postInternalRequestForm(payload, callback));
  });

  const updateUserRole = useCallback((payload, callback = () => {}) => {
    dispatch(putUserRole(payload, callback));
  }, []);

  const fetchRoles = useCallback(() => {
    dispatch(getRoles());
  }, []);

  const archive = useCallback((payload, callback) => {
    dispatch(archiveUser(payload, callback));
  });

  const unarchive = useCallback((payload, callback) => {
    dispatch(unarchiveUser(payload, callback));
  });

  const activate = useCallback((payload, callback) => {
    dispatch(activateUser(payload, callback));
  });

  const deactivate = useCallback((payload, callback) => {
    dispatch(deactivateUser(payload, callback));
  });

  const fetchArchivedUsers = useCallback(() => {
    dispatch(getArchivedUsers());
  }, []);

  const updateType = (user, type) => {
    dispatch(
      updateUserType({ id: user.id, type: type }, (err, res) => {
        if (err) return;
        toaster.success(`${_t("TOASTER.CHANGE_USER_TYPE", "Change user type to ::type::", { type: type })}`);
      })
    );
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
  };
};

export default useUserActions;
