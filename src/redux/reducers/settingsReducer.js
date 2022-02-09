import momentTZ from "moment-timezone";
import { $_GET } from "../../helpers/commonFunctions";

const INITIAL_STATE = {
  origTheme: {
    colors: {
      primary: "#29323F",
      secondary: "#4E5D72",
      third: "#F1F2F6",
      fourth: "#FBB800",
      fifth: "#192536",
      sidebarTextColor: "#cbd4db",
    },
  },
  sessionUser: null,
  driff: {
    i18n: 1605864545,
    isSettingsLoaded: false,
    isCompSettingsLoaded: false,
    company_name: "Driff communication",
    domains: [],
    logo: "",
    background: null,
    theme: {
      colors: {
        primary: "#29323F",
        secondary: "#4E5D72",
        third: "#F1F2F6",
        fourth: "#FBB800",
        fifth: "#192536",
        sidebarTextColor: "#cbd4db",
      },
    },
    settings: {
      maintenance_mode: false,
      google_login: true,
      magic_link: true,
      password_login: true,
      sign_up: true,
      custom_translation: false,
    },
    ANNOUNCEMENT_AT: null,
    ANNOUNCEMENT_LINK: null,
    READ_RELEASE_UPDATES: null,
  },
  user: {
    isLoaded: false,
    CHAT_SETTINGS: {
      chat_filter: "pills-home",
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
          chat_bubble_text_color: "#ffffff",
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
      virtualization: false,
      translate: false,
      filter_channel: false,
    },
    GENERAL_SETTINGS: {
      daily_digest: true,
      notification_sound: "appointed",
      is_new: true,
      timezone: momentTZ.tz.guess(),
      dark_mode: "0",
      log_rocket: "0",
      sentry: "0",
      language: null,
      active_topic: null,
      workspace_open_folder: {},
      date_format: "DD-MM-YYYY",
      time_format: "HH:mm",
      personal_links: [],
      notifications_on: true,
      order_channel: {
        order_by: "channel_date_updated",
        sort_by: "DESC",
      },
      translated_channels: [],
      chat_language: "en",
    },
    READ_ANNOUNCEMENT: null,
    ORDER_CHANNEL: {
      order_by: "channel_date_updated",
      sort_by: "DESC",
    },
  },
  isLoaded: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "INCOMING_UPDATE_COMPANY_NAME": {
      return {
        ...state,
        driff: {
          ...state.driff,
          company_name: action.data.company_name,
        },
      };
    }
    case "ADD_USER_TO_REDUCERS": {
      return {
        ...state,
        sessionUser: action.data,
      };
    }
    case "GET_DRIFF_COMP_SETTINGS_SUCCESS": {
      let settings = state.driff.settings;
      let ANNOUNCEMENT_AT = state.driff.ANNOUNCEMENT_AT;
      let ANNOUNCEMENT_LINK = state.driff.ANNOUNCEMENT_LINK;
      let READ_RELEASE_UPDATES = state.driff.READ_RELEASE_UPDATES;
      let domains = state.driff.domains;
      let logo = state.driff.logo;
      let background = state.driff.background;

      action.data.settings.forEach((s) => {
        if (s.ANNOUNCEMENT_AT) ANNOUNCEMENT_AT = s.ANNOUNCEMENT_AT;
        if (s.ANNOUNCEMENT_LINK) ANNOUNCEMENT_LINK = s.ANNOUNCEMENT_LINK;
        if (s.READ_RELEASE_UPDATES) READ_RELEASE_UPDATES = s.READ_RELEASE_UPDATES;
        if (s.domains && s.domains !== "") {
          domains = s.domains.split(",");
        }
        if (s.logo) logo = s.logo;
        if (s.background) background = s.background;
        if (s.hasOwnProperty("maintenance_mode") || s.hasOwnProperty("google_login") || s.hasOwnProperty("magic_link") || s.hasOwnProperty("password_login") || s.hasOwnProperty("sign_up") || s.hasOwnProperty("custom_translation")) {
          settings = { ...settings, ...s };
        }

        if (s.custom_translation) {
          settings.custom_translation = s.custom_translation === "1" ? true : false;
        }
      });

      Object.keys(settings).forEach((k) => {
        settings[k] = settings[k] === "1" || settings[k] === true;
      });

      settings.maintenance_mode = !Object.values(settings).some((v) => v === true);

      if ($_GET("allow") === "password_login") {
        settings.password_login = true;
      }

      return {
        ...state,
        driff: {
          ...state.driff,
          isCompSettingsLoaded: true,
          settings: settings,
          ANNOUNCEMENT_LINK,
          ANNOUNCEMENT_AT,
          READ_RELEASE_UPDATES,
          domains: domains,
          logo: logo,
          background: background,
        },
      };
    }
    case "GET_DRIFF_SETTINGS_SUCCESS": {
      let driff = state.driff;
      let origTheme = state.origTheme;

      for (const index in action.data) {
        if (action.data.hasOwnProperty(index)) {
          const item = action.data[index];
          const key = Object.keys(item)[0];
          const value = item[key];

          switch (key) {
            case "translation_updated_at": {
              if (typeof driff["client_translation_updated_at"] === "undefined") {
                driff = {
                  ...driff,
                  i18n: value ? value.timestamp : 1000000000,
                };
              } else {
                driff = {
                  ...driff,
                  i18n: driff["client_translation_updated_at"] < value.timestamp ? value.timestamp : driff["translation_updated_at"],
                };
              }

              break;
            }
            case "client_translation_updated_at": {
              if (typeof driff["translation_updated_at"] === "undefined") {
                driff = {
                  ...driff,
                  i18n: value ? value.timestamp : 1000000000,
                };
              } else {
                driff = {
                  ...driff,
                  i18n: driff["translation_updated_at"] < value.timestamp ? value.timestamp : driff["translation_updated_at"],
                };
              }

              break;
            }
            case "domains": {
              if (value !== "") {
                driff = {
                  ...driff,
                  domains: value.split(","),
                };
              }

              break;
            }
            case "themes": {
              driff = {
                ...driff,
                theme: {
                  colors: {
                    ...driff.theme.colors,
                    ...JSON.parse(value),
                  },
                },
              };
              origTheme = {
                colors: {
                  ...driff.theme.colors,
                  ...JSON.parse(value),
                },
              };

              break;
            }
            default: {
              driff = {
                ...driff,
                [key]: value,
              };
            }
          }
        }
      }

      return {
        ...state,
        origTheme: origTheme,
        driff: {
          ...driff,
          isSettingsLoaded: true,
        },
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
                language: value.language === null ? "en" : value.language,
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
    case "UPDATE_READ_ANNOUNCEMENT": {
      return {
        ...state,
        user: {
          ...state.user,
          READ_ANNOUNCEMENT: { timestamp: Math.floor(Date.now() / 1000) },
        },
      };
    }
    case "UPDATE_COMPANY_POST_ANNOUNCEMENT": {
      return {
        ...state,
        driff: {
          ...state.driff,
          ANNOUNCEMENT_LINK: action.data.ANNOUNCEMENT_LINK,
          ANNOUNCEMENT_AT: action.data.ANNOUNCEMENT_AT,
        },
      };
    }
    case "UPDATE_WORKSPACE_SETTING": {
      return {
        ...state,
        user: {
          ...state.user,
          GENERAL_SETTINGS: {
            ...state.user.GENERAL_SETTINGS,
            ...action.data,
          },
          ORDER_CHANNEL: {
            ...action.data.order_channel,
          },
        },
      };
    }
    case "INCOMING_CREATED_ANNOUNCEMENT": {
      if (action.data.major_release) {
        return {
          ...state,
          driff: {
            ...state.driff,
            READ_RELEASE_UPDATES: { timestamp: action.data.created_at.timestamp },
          },
        };
      } else {
        return state;
      }
    }
    case "GET_RELEASE_ANNOUNCEMENTS_SUCCESS": {
      return {
        ...state,
        user: {
          ...state.user,
          READ_RELEASE_UPDATES: { timestamp: action.data.READ_RELEASE_UPDATES.timestamp },
        },
      };
    }
    case "UPDATED_ALLOWED_DOMAINS": {
      return {
        ...state,
        driff: {
          ...state.driff,
          domains: action.data,
        },
      };
    }
    case "UPLOAD_DRIFF_LOGO_SUCCESS": {
      return {
        ...state,
        driff: {
          ...state.driff,
          logo: action.data.path.view_link,
        },
      };
    }
    case "PUT_LOGIN_SETTINGS_SUCCESS": {
      return {
        ...state,
        driff: {
          ...state.driff,
          settings: {
            ...state.driff.settings,
            custom_translation: action.data.custom_translation,
          },
        },
      };
    }
    case "UPDATE_CUSTOM_TRANSLATION_SETTINGS": {
      return {
        ...state,
        driff: {
          ...state.driff,
          settings: {
            ...state.driff.settings,
            custom_translation: !state.driff.settings.custom_translation,
          },
        },
      };
    }
    case "INCOMING_UPDATED_COMPANY_LOGO": {
      return {
        ...state,
        driff: {
          ...state.driff,
          logo: action.data.files.view_link,
        },
      };
    }
    case "RESET_COMPANY_LOGO_SUCCESS": {
      return {
        ...state,
        driff: {
          ...state.driff,
          logo: "",
        },
      };
    }
    case "UPDATE_THEME_COLORS": {
      return {
        ...state,
        driff: {
          ...state.driff,
          theme: { colors: { ...state.driff.theme.colors, ...action.data.colors } },
        },
      };
    }
    case "INCOMING_COMPANY_DASHBOARD_BACKGROUND": {
      return {
        ...state,
        driff: {
          ...state.driff,
          background: action.data,
        },
      };
    }
    default:
      return state;
  }
};
