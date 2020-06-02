import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUserSettings, updateUserSettings} from "../../redux/actions/settingsActions";

const useSettings = () => {

    const dispatch = useDispatch();
    const userSettings = useSelector(state => state.settings.user);
    const activeTopic = useSelector(state => state.workspaces.activeTopic);

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
                    active_topic: userSettings.ACTIVE_TOPIC,
                },
            };
            dispatch(
                updateUserSettings(
                    payload,
                ),
            );
        }
    }, [userSettings]);


    useEffect(() => {
        if (activeTopic !== null) {
            console.log(activeTopic);
        }
    }, [activeTopic]);
};

export default useSettings;