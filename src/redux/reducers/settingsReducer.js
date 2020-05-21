const INITIAL_STATE = {
    user: null,
    companySettings: null,
    userSettings: {
        isLoaded: false,
        DISABLE_SOUND: "0",
        CHAT_SETTINGS: {
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
                    chat_bubble_link_color: "rgba(18,100,163,1)",
                    chat_bubble_hover_color: "#fff",
                    chat_bubble_quote_background_color: "#ffffffe6",
                    chat_bubble_quote_text_color: "",
                    chat_bubble_quote_link_color: "#FF4445",
                    chat_bubble_quote_hover_color: "#0056b3",
                },
                others: {
                    chat_bubble_focus_border_color: "rgba(151,44,134,0.25)",
                    chat_bubble_name_text_color: "#AAB0C8",
                    chat_bubble_text_color: "#000000",
                    chat_bubble_background_color: "#F0F0F0",
                    chat_bubble_link_color: "#FF4445",
                    chat_bubble_hover_color: "#0056b3",
                    chat_bubble_quote_background_color: "#cbcbcb",
                    chat_bubble_quote_text_color: "#000000",
                    chat_bubble_quote_link_color: "#FF4445",
                    chat_bubble_quote_hover_color: "#0056b3",
                },
            },
        },
    },
    isLoaded: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "ADD_USER_TO_REDUCERS": {
            return {
                ...state,
                user: action.data,
            };
        }
        case "GET_USER_SETTINGS_SUCCESS": {
            let settings = state.userSettings;
            settings["isLoaded"] = true;

            // # Don't load custom theme, maybe in the future again
            // for (const index in action.data.settings) {
            //     let item = action.data.settings[index];
            //     let key = Object.keys(item)[0];
            //     let value = item[key];

            //     switch (key) {
            //         case "CHAT_SETTINGS": {

            //             //do not apply chat message theme from db if preset is default
            //             if (value.chat_message_theme.preset === "default") {
            //                 delete value["chat_message_theme"];
            //             }

            //             settings[key] = {
            //                 ...settings[key],
            //                 ...value,
            //             };
            //             break;
            //         }
            //         default: {
            //             settings[key] = value;
            //         }
            //     }
            // }

            return {
                ...state,
                userSettings: settings,
                isLoaded: true,
            };
        }
        default:
            return state;
    }
}