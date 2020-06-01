import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUserSettings, updateUserSettings} from "../../redux/actions/settingsActions";

const useSettings = props => {

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
                    language: userSettings.LANGUAGE,
                    dark_mode: userSettings.DARK_MODE,
                }
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