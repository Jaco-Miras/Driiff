import momentTZ from "moment-timezone";
import React from "react";


const INITIAL_STATE = {
    sessionUser: null,
    driff: {
        company_name: "ZUID Creatives",
    },
    user: {
        isLoaded: false,
        CHAT_SETTINGS: {
            sound_enabled: true,
            open_topic_channels: [],
            order_channel: {
                order_by: "channel_date_updated",
                sort_by: "DESC",
            },
            preview_message: true,
            chat_message_theme: {
                preset: "default",
                self: {
                    chat_bubble_focus_border_color: "rgba(151,44,134,0.25)",
                    chat_bubble_text_color: "#ffffffe6",
                    chat_bubble_background_color: "#7A1B8B",
                    chat_bubble_link_color: "#ffffff",
                    chat_bubble_hover_color: "#fff",
                    chat_bubble_quote_background_color: "#8C3B9B",
                    chat_bubble_quote_text_color: "#ffffffe6",
                    chat_bubble_quote_link_color: "#FF4445",
                    chat_bubble_quote_hover_color: "#7a1b8b",
                },
                others: {
                    chat_bubble_focus_border_color: "rgba(151,44,134,0.25)",
                    chat_bubble_name_text_color: "#AAB0C8",
                    chat_bubble_text_color: "#000000",
                    chat_bubble_background_color: "#F0F0F0",
                    chat_bubble_link_color: "#8C3B9B",
                    chat_bubble_hover_color: "#0056b3",
                    chat_bubble_quote_background_color: "#E4E4E4",
                    chat_bubble_quote_text_color: "#000000",
                    chat_bubble_quote_link_color: "#FF4445",
                    chat_bubble_quote_hover_color: "#0056b3",
                },
            },
        },
        GENERAL_SETTINGS: {
            timezone: momentTZ.tz.guess(),
            dark_mode: "0",
            language: null,
            active_topic: null,
            workspace_open_folder: {},
            date_format: "DD-MM-YYYY",
            time_format: "HH:mm",
        },
    },
    isLoaded: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "ADD_USER_TO_REDUCERS": {
            return {
                ...state,
                sessionUser: action.data,
            };
        }
        case "GET_DRIFF_SETTINGS_SUCCESS": {
            let driff = state.driff;
            for (const index in action.data) {
                if (action.data.hasOwnProperty(index)) {
                    const item = action.data[index];
                    const key = Object.keys(item)[0];
                    const value = item[key];
                    driff = {
                        ...driff,
                        [key]: value,
                    };
                }
            }
            return {
                ...state,
                driff: driff,
            };
        }
        case "GET_USER_SETTINGS_SUCCESS": {
            let settings = state.user;
            settings["isLoaded"] = true;

            for (const index in action.data.settings) {
                if (action.data.settings.hasOwnProperty(index)) {
                    let item = action.data.settings[index];
                    let key = Object.keys(item)[0];
                    let value = item[key];

                    switch (key) {
                        case "CHAT_SETTINGS": {
                            /* NOTE!!!
                             1) Previous chat message theme will no longer be used.
                             2) We will move their settings to old_chat_message_theme
                             */
                            if (value.chat_message_theme.preset === "default") {
                                delete value["chat_message_theme"];
                            } else {
                                value["old_chat_message_theme"] = value["chat_message_theme"];
                                delete value["chat_message_theme"];
                            }

                            settings[key] = {
                                ...settings[key],
                                ...value,
                            };
                            break;
                        }
                        case "GENERAL_SETTINGS": {
                            settings[key] = {
                                ...settings[key],
                                ...value,
                            };
                            break;
                        }
                        default: {
                            settings[key] = value;
                        }
                    }
                }
            }

            return {
                ...state,
                user: settings,
            };
        }
        case "UPDATE_USER_CHAT_SETTING": {
            return {
                ...state,
                user: {
                    ...state.user,
                    CHAT_SETTINGS: {
                        ...state.user.CHAT_SETTINGS,
                        ...action.data,
                    },
                },
            };
        }
        case "UPDATE_USER_GENERAL_SETTING": {
            return {
                ...state,
                user: {
                    ...state.user,
                    GENERAL_SETTINGS: {
                        ...state.user.GENERAL_SETTINGS,
                        ...action.data,
                    },
                },
            };
        }
        case "UPDATE_USER_SETTINGS": {
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.data,
                },
            };
        }
        default:
            return state;
    }
}