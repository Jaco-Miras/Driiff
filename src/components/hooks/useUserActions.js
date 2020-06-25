import {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {sessionService} from "redux-react-session";
import {getUser, getUsers, postUploadProfileImage, putUser} from "../../redux/actions/userAction";
import {useToaster} from "./index";

let init = true;

const useUserActions = () => {

    const dispatch = useDispatch();
    const toaster = useToaster();

    const {getUserFilter} = useSelector(state => state.users);
    const {user: loggedUser} = useSelector(state => state.session);

    const fetch = useCallback((
        {
            skip = 0,
            limit = getUserFilter.limit,
            ...res
        },
        callback = () => {},
    ) => {
        dispatch(
            getUsers({
                ...res,
                skip: skip,
                limit: limit,
            }, callback),
        );
    }, [dispatch, getUserFilter.limit]);

    const fetchMore = useCallback(() => {
        if (getUserFilter.hasMore) {
            fetch(getUserFilter.skip, getUserFilter.limit);
        }
    }, [fetch, getUserFilter]);

    const fetchById = useCallback((userId, callback = () => {}) => {
        dispatch(
            getUser({id: userId}, callback),
        );
    }, [dispatch]);

    const update = useCallback((user, callback = () => {}) => {
        const allowed = ["id", "first_name", "last_name", "middle_name", "name", "password",
            "role_id", "company", "designation", "skills", "email", "contact", "place", "address", "house_number",
            "country", "zip_code", "birthday", "gender", "timezone", "language"];

        let payload = {};
        allowed.forEach(field => {
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
                    toaster.error(`Saving profile information failed.`,
                        {position: "bottom-left"});
                }

                if (res) {
                    if (loggedUser.id === res.data.id) {
                        sessionService.saveUser({...res.data});
                    }
                    toaster.success(`Profile information saved.`,
                        {position: "bottom-left"});
                }

                callback(err, res);
            }),
        );
    }, [dispatch]);

    const getReadOnlyFields = useCallback((source) => {
        switch (source) {
            case "gripp":
                return [
                    "email",
                    "designation",
                    "house_number",
                    "zip",
                    "address",
                    "place",
                    "country",
                    "birthday",
                    "profile_image",
                    "contact",
                ];
            default:
                return [];
        }
    }, []);

    const getRequiredFields = useCallback((source) => {
        let required = ["first_name", "last_name", "password"];

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
        console.log(payload);
        dispatch(
            postUploadProfileImage(payload, (err, res) => {
                if (err) {
                    toaster.error(`Profile image upload failed.`);
                    callback(err);
                }

                if (res) {
                    user.profile_image_id = parseInt(res.data.profile_media_id);
                    update(user, callback);
                }
            }),
        );
    }, []);

    useEffect(() => {
        if (init) {
            init = false;

            fetch({}, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        fetch,
        update,
        updateProfileImage,
        fetchById,
        fetchMore,
        getReadOnlyFields,
        getRequiredFields,
    };
};

export default useUserActions;