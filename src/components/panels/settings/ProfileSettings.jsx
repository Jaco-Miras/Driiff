import momentTZ from "moment-timezone";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { CustomInput } from "reactstrap";
import styled from "styled-components";
import Flag from "../../common/Flag";
import { useSettings, useTimeFormat, useToaster, useTranslationActions } from "../../hooks";
import { getDriffName } from "../../hooks/useDriff";
import { darkTheme, lightTheme } from "../../../helpers/selectTheme";
import { deletePushSubscription, postGenerateTranslationRaw, addToModals } from "../../../redux/actions/globalActions";
import { driffData } from "../../../config/environment.json";
import reduxPersist from "../../../redux/store/configStore";
import { browserName, isMobileSafari, deviceType } from "react-device-detect";
import { SvgIconFeather, ToolTip } from "../../common";
import { useTheme } from "styled-components";

const Wrapper = styled.div`
  .card {
    overflow: visible;
  }

  .custom-switch {
    padding: 0;
    justify-content: left;
    align-items: center;
    display: flex;
    min-height: 38px;
    .custom-control-label::after {
      right: -11px;
      left: auto;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 100%;
      top: 2px;
    }

    input[type="checkbox"]:checked + .custom-control-label::after {
      right: -23px;
    }

    .custom-control-label::before {
      right: -2.35rem;
      left: auto;
      width: 3rem;
      height: 1.5rem;
      border-radius: 48px;
      top: 0;
    }

    input {
      cursor: pointer;
    }
    label {
      cursor: pointer;
      width: calc(100% - 40px);
      min-height: 25px;
      display: flex;
      align-items: center;

      span {
        display: block;
        width: calc(100% - 35px);
      }
    }
  }
  .version-number {
    display: flex;
    place-content: center;
    font-size: 13px;
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  }
`;

const ProfileSettings = (props) => {
  const { className = "" } = props;
  let persistenceOn = localStorage.getItem("persistence") ? true : false;
  const { persistor } = reduxPersist();
  const [persist, setPersist] = useState(persistenceOn);

  const theme = useTheme();
  const { localizeDate } = useTimeFormat();
  const dispatch = useDispatch();
  const toaster = useToaster();

  const { user: loggedUser } = useSelector((state) => state.session);

  const {
    generalSettings: { language, timezone, date_format, time_format, dark_mode, notifications_on, log_rocket, sentry, logs, notification_sound, order_channel: orderChannel, chat_language, daily_digest },
    chatSettings: { order_channel, sound_enabled, preview_message, virtualization },
    userSettings: { isLoaded, enable_all_notification_reply_in_email },
    setChatSetting,
    setWorkspaceSetting,
    setGeneralSetting,
    setPushSubscription,

    // driffSettings,
  } = useSettings();

  const [triggerRender, setTriggerRender] = useState(false);

  const { _t } = useTranslationActions();

  const i18n = localStorage.getItem("i18n") ? JSON.parse(localStorage.getItem("i18n")) : {};
  const i18new = localStorage.getItem("i18new") ? JSON.parse(localStorage.getItem("i18new")) : {};

  const i18update = {};

  for (let key in i18new) {
    if (!(key in i18n)) {
      i18update[key] = i18new[key];
    }
  }

  const uploadTranslationToServer = (callback = () => {}) => {
    let vocabulary = [];
    let bodyText = "You are about to add the following words to the dictionary files, continue?";
    bodyText += "<table>";
    Object.keys(i18update).forEach((k) => {
      bodyText += "<tr>";
      bodyText += `<td>${k}</td>`;
      bodyText += `<td>${i18new[k]}</td>`;
      bodyText += "</tr>";
      vocabulary.push({
        [k]: i18new[k],
      });
    });
    bodyText += "</table>";

    const cb = () => {
      dispatch(postGenerateTranslationRaw(vocabulary, callback));
    };

    let payload = {
      type: "confirmation",
      headerText: "Translation - Add",
      submitText: "Add",
      cancelText: "Cancel",
      bodyText: bodyText,
      size: "lg",
      actions: {
        onSubmit: cb,
      },
    };
    dispatch(addToModals(payload));
  };

  const dictionary = {
    chatSettingsTitle: _t("SETTINGS.CHAT_TITLE", "Chat Settings"),
    soundLabel: _t("SETTINGS.SOUND_LABEL", "Play a sound when receiving a new chat message"),
    previewMessageLabel: _t("SETTINGS.PREVIEW_MESSAGE_LABEL", "Show chat preview message"),
    sortChannelLabel: _t("SETTINGS.SORT_CHANNEL_LABEL", "Sort channel by"),
    sortChannelRecentActivityValue: _t("SETTINGS.SORT_CHANNEL_RECENT_ACTIVITY_VALUE", "Recent activity"),
    sortChannelNameValue: _t("SETTINGS.SORT_CHANNEL_NAME_VALUE", "Channel name"),
    allowNotifications: _t("SETTINGS.ALLOW_NOTIFICATIONS", "Allow notifications"),
    notificationSound: _t("SETTINGS.NOTIFICATION_SOUND", "Notification sound"),
    notificationSoundDefault: _t("SETTINGS.NOTIFICATION_SOUND_DEFAULT", "Default"),
    notificationSoundJingleBells: _t("SETTINGS.NOTIFICATION_SOUND_JINGLE_BELLS", "Jingle bells"),
    localizationSettingsTitle: _t("SETTINGS.LOCALIZATION_TITLE", "Localization"),
    languageLabel: _t("SETTINGS.LANGUAGE_LABEL", "Language"),
    timezoneLabel: _t("SETTINGS.TIMEZONE_LABEL", "Timezone"),
    dateTimeFormatLabel: _t("SETTINGS.DATE_TIME_FORMAT_LABEL", "Date and time format"),
    workspaceSettingsTitle: _t("SETTINGS.WORKSPACE_TITLE", "Workspace Settings"),
    sortWorkspaceLabel: _t("SETTINGS.SORT_WORKSPACE_LABEL", "Sort workspace by"),
    viewRelease: _t("SETTINGS.VIEW_RELEASE", "View Release List"),
    liveTranslation: _t("SETTINGS.LIVE_TRANSLATION", "Talk in your own language (live translation)"),
    dailyDigest: _t("SETTINGS.DAILY_DIGEST", "Daily digest"),
    //chatTranslateTitle: _t("SETTINGS.CHAT_TRANSLATE", "Talk in your own language (live translation) !BETA!"),
    chatTranslateTitle: _t("SETTINGS.CHAT_TRANSLATE", "Choose a target language to be translated !BETA!"),
    dailyDigest: _t("SETTINGS.DAILY_DIGEST", "Daily digest"),
    notifications: _t("NOTIFICATIONS", "Notifications"),
    extraSettings: _t("SETTINGS.EXTRA_SETTINGS", "Extra settings"),
    darkMode: _t("SETTINGS.DARK_MODE", "Dark mode"),
    customTranslation: _t("SETTINGS.CUSTOM_TRANSLATION", "Use custom translation"),
    emailToggle: _t("SETTINGS.EMAIL_TOGGLE", " Email notification"),
    emailToggleLabelOn: _t("SETTINGS.EMAIL_TOGGLE_LABEL_ON", "Always, i prefer mostly email"),
    emailToggleLabelOff: _t("SETTINGS.EMAIL_TOGGLE_LABEL_OFF", "Only on mention, I will use Driff mostly"),
    emailToggleToolTip1: _t("SETTINGS.EMAIL_TOGGLE_TOOL_TIP_ONE", "By selecting 'Always', you will receive all notifications through email."),
    emailToggleToolTip2: _t("SETTINGS.EMAIL_TOGGLE_TOOL_TIP_TWO", "By selecting 'Only on mention', you will receive email notifications when you are mentioned on Chat or Post."),
  };

  const notificationSoundOptions = [
    {
      value: "appointed",
      label: dictionary.notificationSoundDefault,
    },
    // {
    //   value: "jingle-bells",
    //   label: dictionary.notificationSoundJingleBells,
    // },
  ];
  const emailOptions = [
    {
      value: true,
      label: dictionary.emailToggleLabelOn,
    },
    {
      value: false,
      label: dictionary.emailToggleLabelOff,
    },
    // {
    //   value: "jingle-bells",
    //   label: dictionary.notificationSoundJingleBells,
    // },
  ];

  const channelSortOptions = [
    {
      value: "channel_date_updated",
      label: dictionary.sortChannelRecentActivityValue,
    },
    {
      value: "channel_name",
      label: dictionary.sortChannelNameValue,
    },
  ];

  const languageOptions = [
    {
      value: "en",
      label: (
        <>
          <Flag countryAbbr="en" className="mr-2" width="18" />
          {_t("LANGUAGE.ENGLISH", "English")}
        </>
      ),
    },
    {
      value: "nl",
      label: (
        <>
          <Flag countryAbbr="nl" className="mr-2" width="18" />
          {_t("LANGUAGE.DUTCH", "Dutch")}
        </>
      ),
    },
  ];

  const ChatLanguageOptions = [
    {
      value: "en",
      label: (
        <>
          <Flag countryAbbr="en" className="mr-2" width="18" />
          {_t("LANGUAGE.ENGLISH", "English")}
        </>
      ),
    },
    {
      value: "bg",
      label: (
        <>
          <Flag countryAbbr="bg" className="mr-2" width="18" />
          {_t("LANGUAGE.BULGARIAN", "Bulgarian")}
        </>
      ),
    },
    {
      value: "cs",
      label: (
        <>
          <Flag countryAbbr="cs" className="mr-2" width="18" />
          {_t("LANGUAGE.CZECH", "Czech")}
        </>
      ),
    },
    {
      value: "da",
      label: (
        <>
          <Flag countryAbbr="da" className="mr-2" width="18" />
          {_t("LANGUAGE.DANISH", "Danish")}
        </>
      ),
    },
    {
      value: "de",
      label: (
        <>
          <Flag countryAbbr="de" className="mr-2" width="18" />
          {_t("LANGUAGE.GERMAN", "German")}
        </>
      ),
    },
    {
      value: "el",
      label: (
        <>
          <Flag countryAbbr="el" className="mr-2" width="18" />
          {_t("LANGUAGE.GREEK", "Greek")}
        </>
      ),
    },
    {
      value: "es",
      label: (
        <>
          <Flag countryAbbr="es" className="mr-2" width="18" />
          {_t("LANGUAGE.SPANISH", "Spanish")}
        </>
      ),
    },
    {
      value: "et",
      label: (
        <>
          <Flag countryAbbr="et" className="mr-2" width="18" />
          {_t("LANGUAGE.ESTONIAN", "Estonian")}
        </>
      ),
    },
    {
      value: "fi",
      label: (
        <>
          <Flag countryAbbr="fi" className="mr-2" width="18" />
          {_t("LANGUAGE.FINNISH", "Finnish")}
        </>
      ),
    },
    {
      value: "fr",
      label: (
        <>
          <Flag countryAbbr="fi" className="mr-2" width="18" />
          {_t("LANGUAGE.FRENCH", "French")}
        </>
      ),
    },
    {
      value: "hu",
      label: (
        <>
          <Flag countryAbbr="fi" className="mr-2" width="18" />
          {_t("LANGUAGE.HUNGARAIN", "Hungarian")}
        </>
      ),
    },
    {
      value: "it",
      label: (
        <>
          <Flag countryAbbr="it" className="mr-2" width="18" />
          {_t("LANGUAGE.ITALIAN", "Italian")}
        </>
      ),
    },
    {
      value: "ja",
      label: (
        <>
          <Flag countryAbbr="ja" className="mr-2" width="18" />
          {_t("LANGUAGE.JAPANESE", "Japanese")}
        </>
      ),
    },
    {
      value: "lt",
      label: (
        <>
          <Flag countryAbbr="lt" className="mr-2" width="18" />
          {_t("LANGUAGE.LITHUANIAN", "Lithuanian")}
        </>
      ),
    },
    {
      value: "lv",
      label: (
        <>
          <Flag countryAbbr="lv" className="mr-2" width="18" />
          {_t("LANGUAGE.LATVIAN", "Latvian")}
        </>
      ),
    },
    {
      value: "nl",
      label: (
        <>
          <Flag countryAbbr="nl" className="mr-2" width="18" />
          {_t("LANGUAGE.DUTCH", "Dutch")}
        </>
      ),
    },
    {
      value: "pl",
      label: (
        <>
          <Flag countryAbbr="pl" className="mr-2" width="18" />
          {_t("LANGUAGE.POLISH", "Polish")}
        </>
      ),
    },
    {
      value: "pt",
      label: (
        <>
          <Flag countryAbbr="pt" className="mr-2" width="18" />
          {_t("LANGUAGE.PORTUGUESE", "Portuguese")}
        </>
      ),
    },
    {
      value: "ro",
      label: (
        <>
          <Flag countryAbbr="ro" className="mr-2" width="18" />
          {_t("LANGUAGE.ROMANIAN", "Romanian")}
        </>
      ),
    },
    {
      value: "ru",
      label: (
        <>
          <Flag countryAbbr="ru" className="mr-2" width="18" />
          {_t("LANGUAGE.RUSSIAN", "Russian")}
        </>
      ),
    },
    {
      value: "sk",
      label: (
        <>
          <Flag countryAbbr="sk" className="mr-2" width="18" />
          {_t("LANGUAGE.SLOVAK", "Slovak")}
        </>
      ),
    },
    {
      value: "sl",
      label: (
        <>
          <Flag countryAbbr="sl" className="mr-2" width="18" />
          {_t("LANGUAGE.SLOVENIAN", "Slovenian")}
        </>
      ),
    },
    {
      value: "sv",
      label: (
        <>
          <Flag countryAbbr="sv" className="mr-2" width="18" />
          {_t("LANGUAGE.SWEDISH", "Swedish")}
        </>
      ),
    },
    {
      value: "zh",
      label: (
        <>
          <Flag countryAbbr="zh" className="mr-2" width="18" />
          {_t("LANGUAGE.CHINESE", "Chinese")}
        </>
      ),
    },
  ];

  const TimezoneOptions = momentTZ.tz.names().map((tz) => {
    return {
      value: tz,
      label: tz,
    };
  });

  const DateFormatOptions = [
    {
      value: "DD-MM-YYYY",
      label: "DD-MM-YYYY",
    },
    {
      value: "YYYY-MM-DD",
      label: "YYYY-MM-DD",
    },
    {
      value: "MM-DD-YYYY",
      label: "MM-DD-YYYY",
    },
  ];

  const TimeFormatOptions = [
    {
      value: "hh:mm A",
      label: "AM/PM",
    },
    {
      value: "HH:mm",
      label: "24-hour format",
    },
  ];

  const handleLanguageChange = (e) => {
    setGeneralSetting(
      {
        language: e.value,
      },
      () => {
        setTimeout(() => {
          setTriggerRender((prevState) => !prevState);
        }, 300);
      }
    );

    toaster.success(<span>You have successfully updated Language</span>);
  };

  const handleChatLanguageChange = (e) => {
    setGeneralSetting({
      chat_language: e.value,
      translated_channels: [],
    });
    setTimeout(function () {
      localStorage.setItem("chat_translate_change", "1");
    }, 1000);
    toaster.success(<span>You have successfully updated chat target language</span>);
  };

  const handleChatSwitchToggle = (e) => {
    e.persist();
    const { name, checked, dataset } = e.target;
    setChatSetting({
      [name]: checked,
    });
    toaster.success(<span>{dataset.successMessage}</span>);
  };

  const handleGeneralSwitchToggle = (e) => {
    e.persist();
    const { name, checked, dataset } = e.target;

    setGeneralSetting(
      {
        [name]: name === "daily_digest" ? checked : checked ? "1" : "0",
      },
      () => {
        if (["log_rocket", "sentry"].includes(name)) {
          localStorage.setItem(name, checked ? "1" : "0");
          window.location.reload();
        } else if (name === "logs") {
          if (checked) {
            localStorage.setItem("logger", "all");
          } else {
            localStorage.removeItem("logger");
          }
        }
      }
    );
    toaster.success(<span>{dataset.successMessage}</span>);
  };

  const handleNotificationsSwitchToggle = (e) => {
    e.persist();
    const { name, dataset } = e.target;
    if (notifications_on) {
      const unregister = () => {
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.ready
            .then((registration) => {
              registration.unregister();
            })
            .catch((error) => {
              console.error(error.message);
            });
        }
      };
      unregister();
      setPushSubscription(false);
      dispatch(deletePushSubscription({ user_id: loggedUser.id }));
    } else {
      setPushSubscription(null);
    }
    setGeneralSetting({
      [name]: !notifications_on,
    });
    toaster.success(<span>{dataset.successMessage}</span>);
  };

  const handleNotificationSoundChange = (e) => {
    setGeneralSetting({
      notification_sound: e.value,
    });
    toaster.success(<span>You have successfully updated notification sound</span>);
  };

  const handleSortChannelChange = (e) => {
    setChatSetting({
      order_channel: {
        order_by: e.value,
        sort_by: e.value === "channel_date_updated" ? "DESC" : "ASC",
      },
    });
    toaster.success(<span>You have successfully sort channel</span>);
  };

  const handleSortWorkspaceChange = (e) => {
    setWorkspaceSetting({
      order_channel: {
        order_by: e.value,
        sort_by: e.value === "channel_date_updated" ? "DESC" : "ASC",
      },
    });
    toaster.success(<span>You have successfully sort channel</span>);
  };

  const handleTimezoneChange = (e) => {
    setGeneralSetting({ timezone: e.value });
    toaster.success(<span>You have successfully updated Timezone</span>);
  };

  const handleDateFormatChange = (e) => {
    setGeneralSetting({ date_format: e.value });
    toaster.success(<span>You have successfully updated Date format</span>);
  };

  const handleTimeFormatChange = (e) => {
    setGeneralSetting({ time_format: e.value });
    toaster.success(<span>You have successfully updated Time format</span>);
  };

  // const handleSystemSettingsClick = () => {
  //   let a = document.createElement("a");
  //   a.href = `https://${getDriffName()}.driff.io/admin`;
  //   a.target = "_blank";
  //   a.click();
  // };

  const handleUpdateTranslationClick = () => {
    uploadTranslationToServer(() => {
      localStorage.removeItem("i18new");
      let a = document.createElement("a");
      a.href = `https://${getDriffName()}.driff.io/admin/translations`;
      a.target = "_blank";
      a.click();

      setTimeout(() => {
        let a = document.createElement("a");
        a.href = "https://driff.io/admin/translations";
        a.target = "_blank";
        a.click();
      }, 1000);
    });
  };

  const handleTogglePersist = (e) => {
    e.persist();
    const { checked, dataset } = e.target;
    setPersist(checked);
    if (checked) {
      localStorage.setItem("persistence", true);
    } else {
      if (persistenceOn) {
        persistor.purge();
        localStorage.removeItem("persist:root");
      }
      localStorage.removeItem("persistence");
    }
    toaster.success(<span>{dataset.successMessage}</span>);
  };

  const handleVersionClick = (e) => {
    e.preventDefault();
    window.open("https://support.getdriff.com/hc/en-us/sections/4409918501905-Software-updates", "_blank");
  };

  const handleEmailNotificationDropdown = (e) => {
    setGeneralSetting({ enable_all_notification_reply_in_email: e.value }, () => {
      toaster.success(<span>You have successfully updated email notification</span>);
    });
  };

  return (
    <Wrapper className={`profile-settings ${className}`}>
      {isLoaded ? (
        <>
          <div className="card">
            <div className="card-body">
              <h6 className="card-title d-flex justify-content-between align-items-center">{dictionary.chatSettingsTitle}</h6>
              <div className="row mb-2">
                <div className="col-12">
                  <CustomInput
                    className="cursor-pointer text-muted"
                    checked={sound_enabled}
                    type="switch"
                    id="chat_sound_enabled"
                    name="sound_enabled"
                    onChange={handleChatSwitchToggle}
                    data-success-message={`${sound_enabled ? "Chats are now muted!" : "Chat sound is enabled!"}`}
                    label={<span>{dictionary.soundLabel}</span>}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12">
                  <CustomInput
                    className="cursor-pointer text-muted"
                    checked={preview_message}
                    type="switch"
                    id="chat_preview_message"
                    name="preview_message"
                    onChange={handleChatSwitchToggle}
                    data-success-message={`You have turn ${preview_message ? "OFF" : "ON"} preview in chat messages!`}
                    label={<span>{dictionary.previewMessageLabel}</span>}
                  />
                </div>
              </div>

              {["nilo@makedevelopment.com"].includes(loggedUser.email) && (
                <div className="row mb-3">
                  <div className="col-12">
                    <CustomInput
                      className="cursor-pointer text-muted"
                      checked={virtualization}
                      type="switch"
                      id="chat_virtualization"
                      name="virtualization"
                      onChange={handleChatSwitchToggle}
                      data-success-message={`You have turn ${virtualization ? "OFF" : "ON"} virtualization in chat messages!`}
                      label={<span>Virtualized chat</span>}
                    />
                  </div>
                </div>
              )}

              {/* <div className="row mb-3">
                <div className="col-12">
                  <CustomInput
                    className="cursor-pointer text-muted"
                    checked={persist}
                    type="switch"
                    id="redux_persist"
                    name="persistence"
                    onChange={handleTogglePersist}
                    data-success-message={`You have turn ${persist ? "OFF" : "ON"} data persistence in chat!`}
                    label={<span>Persisted data</span>}
                  />
                </div>
              </div> */}

              {/* <div className="row mb-3">
                <div className="col-12">
                  <CustomInput
                    className="cursor-pointer text-muted"
                    checked={translate}
                    type="switch"
                    id="translate_chat"
                    name="translate"
                    onChange={handleChatSwitchToggle}
                    data-success-message={`You have turn ${translate ? "OFF" : "ON"} translate chat messages!`}
                    label={<span>{dictionary.chatTranslateTitle}</span>}
                  />
                </div>
              </div> */}
              <div className="row mb-2">
                <div className="col-5 text-muted">{dictionary.chatTranslateTitle}</div>
                <div className="col-7">
                  <Select
                    className={"react-select-container"}
                    classNamePrefix="react-select"
                    styles={dark_mode === "0" ? lightTheme : darkTheme}
                    value={ChatLanguageOptions.find((o) => o.value === chat_language)}
                    onChange={handleChatLanguageChange}
                    options={ChatLanguageOptions}
                    menuColor={theme.colors.primary}
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-5 text-muted">{dictionary.sortChannelLabel}</div>
                <div className="col-7">
                  <Select
                    className={"react-select-container"}
                    classNamePrefix="react-select"
                    styles={dark_mode === "0" ? lightTheme : darkTheme}
                    value={channelSortOptions.find((o) => o.value === order_channel.order_by)}
                    onChange={handleSortChannelChange}
                    options={channelSortOptions}
                    menuColor={theme.colors.primary}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h6 className="card-title d-flex justify-content-between align-items-center">{dictionary.workspaceSettingsTitle}</h6>
              <div className="row mb-2">
                <div className="col-5 text-muted">{dictionary.sortWorkspaceLabel}</div>
                <div className="col-7">
                  <Select
                    className={"react-select-container"}
                    classNamePrefix="react-select"
                    styles={dark_mode === "0" ? lightTheme : darkTheme}
                    value={channelSortOptions.find((o) => o.value === orderChannel.order_by)}
                    onChange={handleSortWorkspaceChange}
                    options={channelSortOptions}
                    menuColor={theme.colors.primary}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h6 className="card-title d-flex justify-content-between align-items-center">{dictionary.localizationSettingsTitle}</h6>

              <div className="row mb-2">
                <div className="col-5 text-muted">{dictionary.languageLabel}</div>
                <div className="col-7">
                  <Select
                    className={"react-select-container"}
                    classNamePrefix="react-select"
                    styles={dark_mode === "0" ? lightTheme : darkTheme}
                    value={languageOptions.find((o) => o.value === language)}
                    onChange={handleLanguageChange}
                    options={languageOptions}
                    menuColor={theme.colors.primary}
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-5 text-muted">{dictionary.timezoneLabel}</div>
                <div className="col-7">
                  <Select
                    className={"react-select-container"}
                    classNamePrefix="react-select"
                    styles={dark_mode === "0" ? lightTheme : darkTheme}
                    value={TimezoneOptions.find((o) => o.value === timezone)}
                    onChange={handleTimezoneChange}
                    options={TimezoneOptions}
                    menuColor={theme.colors.primary}
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-5 text-muted">{dictionary.dateTimeFormatLabel}</div>
                <div className="col-7 justify-content-center align-items-center">
                  <div className="row">
                    <Select
                      className={"react-select-container col-6"}
                      classNamePrefix="react-select"
                      styles={dark_mode === "0" ? lightTheme : darkTheme}
                      value={DateFormatOptions.find((o) => o.value === date_format)}
                      onChange={handleDateFormatChange}
                      options={DateFormatOptions}
                      menuColor={theme.colors.primary}
                    />
                    <Select
                      className={"react-select-container col-6"}
                      classNamePrefix="react-select"
                      styles={dark_mode === "0" ? lightTheme : darkTheme}
                      value={TimeFormatOptions.find((o) => o.value === time_format)}
                      onChange={handleTimeFormatChange}
                      options={TimeFormatOptions}
                      menuColor={theme.colors.primary}
                    />
                  </div>
                </div>
              </div>

              {["anthea@makedevelopment.com", "nilo@makedevelopment.com", "jessryll@makedevelopment.com", "johnpaul@makedevelopment.com"].includes(loggedUser.email) && (
                <div className="row mb-2 mt-4">
                  <div className="col-12 text-right">
                    <button className="btn btn-primary" onClick={handleUpdateTranslationClick}>
                      Update translation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h6 className="card-title d-flex justify-content-between align-items-center">{dictionary.notifications}</h6>
              <div className="row mb-2">
                <div className="col-12 text-muted">
                  <CustomInput
                    className="cursor-pointer text-muted"
                    checked={notifications_on}
                    type="switch"
                    id="notifications_on"
                    name="notifications_on"
                    data-success-message={`${!notifications_on ? "Notifications enabled" : "Notifications disabled"}`}
                    onChange={handleNotificationsSwitchToggle}
                    label={<span>{dictionary.allowNotifications}</span>}
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-12 text-muted">
                  <CustomInput
                    className="cursor-pointer text-muted"
                    checked={daily_digest}
                    type="switch"
                    id="daily_digest"
                    name="daily_digest"
                    data-success-message={`${!daily_digest ? "Daily digest enabled" : "Daily digest disabled"}`}
                    onChange={handleGeneralSwitchToggle}
                    label={<span>{dictionary.dailyDigest}</span>}
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-5 text-muted">{dictionary.notificationSound}</div>
                <div className="col-7">
                  <Select
                    className={"react-select-container"}
                    classNamePrefix="react-select"
                    styles={dark_mode === "0" ? lightTheme : darkTheme}
                    value={notificationSoundOptions.find((o) => o.value === notification_sound)}
                    onChange={handleNotificationSoundChange}
                    options={notificationSoundOptions}
                    menuColor={theme.colors.primary}
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-5 text-muted" style={{ display: "flex" }}>
                  {dictionary.emailToggle}
                  &nbsp;
                  <ToolTip
                    content={
                      <>
                        {dictionary.emailToggleToolTip1}
                        <br />
                        {dictionary.emailToggleToolTip2}
                      </>
                    }
                  >
                    <SvgIconFeather icon="info" />
                  </ToolTip>
                </div>

                <div className="col-7">
                  <Select
                    className={"react-select-container"}
                    classNamePrefix="react-select"
                    styles={dark_mode === "0" ? lightTheme : darkTheme}
                    value={emailOptions.find((o) => o.value === enable_all_notification_reply_in_email)}
                    onChange={handleEmailNotificationDropdown}
                    options={emailOptions}
                    menuColor={theme.colors.primary}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h6 className="card-title d-flex justify-content-between align-items-center">{dictionary.extraSettings}</h6>

              <div className="row mb-3">
                <div className="col-12 text-muted">
                  <CustomInput
                    className="cursor-pointer text-muted"
                    checked={dark_mode === "1"}
                    type="switch"
                    id="dark_mode"
                    name="dark_mode"
                    data-success-message={`${dark_mode ? "Dark mode is now enabled" : "Dark mode is now disabled"}`}
                    onChange={handleGeneralSwitchToggle}
                    label={<span>{dictionary.darkMode}</span>}
                  />
                </div>
                <div className="col-12 text-muted">
                  <CustomInput
                    className="cursor-pointer text-muted"
                    checked={log_rocket === "1"}
                    type="switch"
                    id="log_rocket"
                    name="log_rocket"
                    data-success-message={`${log_rocket ? "LogRocket is now enabled" : "LogRocket is now disabled"}`}
                    onChange={handleGeneralSwitchToggle}
                    label={<span>LogRocket</span>}
                  />
                </div>
                <div className="col-12 text-muted">
                  <CustomInput
                    className="cursor-pointer text-muted"
                    checked={sentry === "1"}
                    type="switch"
                    id="sentry"
                    name="sentry"
                    data-success-message={`${sentry ? "Sentry is now enabled" : "Sentry is now disabled"}`}
                    onChange={handleGeneralSwitchToggle}
                    label={<span>Sentry</span>}
                  />
                </div>
                <div className="col-12 text-muted">
                  <CustomInput
                    className="cursor-pointer text-muted"
                    checked={logs === "1"}
                    type="switch"
                    id="logs"
                    name="logs"
                    data-success-message={`${sentry ? "Logs are now enabled" : "Logs are now disabled"}`}
                    onChange={handleGeneralSwitchToggle}
                    label={<span>Logs</span>}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
      )}
      <span className="version-number mb-3" onClick={handleVersionClick}>
        Driff version: {driffData.version} {localizeDate(driffData.timestamp)} &nbsp;
        {/* <ReleaseLink onClick={handleViewReleasePage}>{dictionary.viewRelease}</ReleaseLink> */}
      </span>
      {loggedUser && loggedUser.email === "nilo@makedevelopment.com" && (
        <span>
          {isMobileSafari && "mobile safari"}, {browserName}, {deviceType}
        </span>
      )}
    </Wrapper>
  );
};

export default React.memo(ProfileSettings);
