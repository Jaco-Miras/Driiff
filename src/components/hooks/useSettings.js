import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUserSettings, updateUserSettings} from "../../redux/actions/settingsActions";

const useSettings = () => {

    const dispatch = useDispatch();
    const userSettings = useSelector(state => state.settings.user);

    useEffect(() => {
        dispatch(
            getUserSettings(),
        );
    }, []);

    useEffect(() => {
        if (userSettings.isLoaded) {
            let payload = {
                disable_sound: userSettings.DISABLE_SOUND,
                chat_settings: {
                    ...userSettings.CHAT_SETTINGS,
                },
                general_settings: {
                    ...userSettings.GENERAL_SETTINGS,
                },
            };
            dispatch(
                updateUserSettings(
                    payload,
                ),
            );
        }
    }, [userSettings]);
};

export default useSettings;