import {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUserSettings, setUserGeneralSetting, updateUserSettings} from "../../redux/actions/settingsActions";

let init = true;

/**
 * @returns {{userSettings, chatSettings: {open_topic_channels: [], preview_message: boolean, chat_message_theme: {self: {chat_bubble_focus_border_color: string, chat_bubble_quote_link_color: string, chat_bubble_quote_hover_color: string, chat_bubble_hover_color: string, chat_bubble_link_color: string, chat_bubble_text_color: string, chat_bubble_quote_text_color: string, chat_bubble_background_color: string, chat_bubble_quote_background_color: string}, preset: string, others: {chat_bubble_focus_border_color: string, chat_bubble_quote_link_color: string, chat_bubble_quote_hover_color: string, chat_bubble_name_text_color: string, chat_bubble_hover_color: string, chat_bubble_link_color: string, chat_bubble_text_color: string, chat_bubble_quote_text_color: string, chat_bubble_background_color: string, chat_bubble_quote_background_color: string}}, order_channel: {order_by: string, sort_by: string}}, generalSettings: ({dark_mode: string, workspace_open_folder: {}, language: null, active_topic: null}|{dark_mode: string, workspace_open_folder: {}, language: null, active_topic: null}), setGeneralSetting: (...args: any[]) => any}}
 */
const useSettings = () => {

    const dispatch = useDispatch();
    const userSettings = useSelector(state => state.settings.user);

    const setGeneralSetting = useCallback((e) => {
        dispatch(
            setUserGeneralSetting(e, () => {
                let payload = {
                    disable_sound: userSettings.DISABLE_SOUND,
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
    });

    useEffect(() => {
        if (init) {
            init = false;

            dispatch(
                getUserSettings(),
            );
        }
    }, []);

    return {
        userSettings,
        chatSettings: userSettings.CHAT_SETTINGS,
        generalSettings: userSettings.GENERAL_SETTINGS,
        setGeneralSetting,
    };
};

export default useSettings;