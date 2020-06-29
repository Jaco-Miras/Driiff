import {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    getDriffSettings,
    getUserSettings,
    setUserChatSetting,
    setUserGeneralSetting,
    updateUserSettings,
} from "../../redux/actions/settingsActions";
import {useUserLogout} from "./index";

let init = true;

const useSettings = () => {

    const dispatch = useDispatch();
    const {logout} = useUserLogout();
    const {driff: driffSettings, user: userSettings} = useSelector(state => state.settings);

    const setChatSetting = useCallback((e) => {
        dispatch(
            setUserChatSetting(e, () => {
                let payload = {
                    chat_settings: {
                        ...userSettings.CHAT_SETTINGS,
                        ...e,
                    },
                    general_settings: {
                        ...userSettings.GENERAL_SETTINGS,
                    },
                };
                dispatch(
                    updateUserSettings(payload),
                );
            }),
        );
    }, [dispatch, userSettings]);

    const setGeneralSetting = useCallback((e) => {
        dispatch(
            setUserGeneralSetting(e, () => {
                let payload = {
                    chat_settings: {
                        ...userSettings.CHAT_SETTINGS,
                    },
                    general_settings: {
                        ...userSettings.GENERAL_SETTINGS,
                        ...e,
                    },
                };
                dispatch(
                    updateUserSettings(payload),
                );
            }),
        );
    }, [dispatch, userSettings]);

    const fetch = useCallback(() => {
        dispatch(
            getDriffSettings({}, (err) => {
                if (err) {
                    logout();
                }
            }),
        );

        dispatch(
            getUserSettings(),
        );
    }, [dispatch]);

    useEffect(() => {
        if (init) {
            init = false;
            fetch();
        }
    }, []);

    return {
        fetch,
        userSettings,
        driffSettings,
        chatSettings: userSettings.CHAT_SETTINGS,
        generalSettings: userSettings.GENERAL_SETTINGS,
        setChatSetting,
        setGeneralSetting,
    };
};

export default useSettings;