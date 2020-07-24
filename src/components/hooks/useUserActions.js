import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {sessionService} from "redux-react-session";
import {
    checkDriffUserEmail,
    getUser,
    getUsers,
    postExternalUserData,
    postUploadProfileImage,
    putExternalUserUpdate,
    putUser
} from "../../redux/actions/userAction";
import {useToaster} from "./index";
import {getAPIUrl, getCurrentDriffUrl} from "../../helpers/slugHelper";

const useUserActions = () => {
    const dispatch = useDispatch();
    const toaster = useToaster();

    const {getUserFilter} = useSelector((state) => state.users);
    const {user: loggedUser} = useSelector((state) => state.session);

    const storeLoginToken = useCallback((payload) => {
        localStorage.setItem("userAuthToken", JSON.stringify(payload));
        localStorage.setItem("token", payload.download_token);
        localStorage.setItem("atoken", payload.auth_token);
    }, []);

    const getFrontEndAuthUrl = (payload, returnUrl = "") => {
        if (returnUrl !== "") returnUrl = `/${btoa(returnUrl)}`;

        return `/authenticate/${payload.access_token}${returnUrl}`;
    };

    const processBackendLogin = (payload, returnUrl) => {
        let redirectLink = `${getCurrentDriffUrl()}${getFrontEndAuthUrl(payload, returnUrl)}`;
        window.location.href = `${getAPIUrl({isDNS: true})}/auth-web/login?token=${payload.auth_token}&redirect_link=${redirectLink}`;
    };

    const checkEmail = useCallback((email, callback = () => {
    }) => {
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

    const fetch = useCallback(
        ({skip = 0, limit = getUserFilter.limit, ...res}, callback = () => {
        }) => {
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
        (userId, callback = () => {
        }) => {
            dispatch(getUser({id: userId}, callback));
        },
        [dispatch]
    );

    const update = useCallback(
        (user, callback = () => {
        }) => {
            const allowed = [
                "id",
                "first_name",
                "last_name",
                "middle_name",
                "name",
                "password",
                "role_id",
                "company",
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
                            sessionService.saveUser({...res.data});
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
                return ["email", "designation", "house_number", "zip", "address", "place", "country", "birthday", "profile_image", "contact"];
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
    const updateProfileImage = useCallback((user, file, callback = () => {
    }) => {
        const payload = {
            id: user.id,
            file: file,
        };
        console.log(payload);
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
            postExternalUserData({
                state_code: stateCode
            }, (err, res) => {
                if (err) {
                    toaster.error(<>Invalid code.</>);
                }

                callback(err, res);
            })
        )
    }, []);

    const updateExternalUser = useCallback((payload, callback) => {
        dispatch(
            putExternalUserUpdate(payload, (err, res) => {
                callback(err, res);
            })
        )
    }, []);

    return {
        storeLoginToken,
        processBackendLogin,
        checkEmail,
        fetch,
        fetchStateCode,
        update,
        updateProfileImage,
        updateExternalUser,
        fetchById,
        fetchMore,
        getReadOnlyFields,
        getRequiredFields,
    };
};

export default useUserActions;
