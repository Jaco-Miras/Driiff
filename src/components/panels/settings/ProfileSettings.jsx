import momentTZ from "moment-timezone";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { CustomInput } from "reactstrap";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import Flag from "../../common/Flag";
import { useSettings, useTimeFormat, useToaster, useTranslation } from "../../hooks";
import { getDriffName } from "../../hooks/useDriff";
import { darkTheme, lightTheme } from "../../../helpers/selectTheme";
import { deletePushSubscription } from "../../../redux/actions/globalActions";
import { driffData } from "../../../config/environment.json";

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
  }
`;

const ProfileSettings = (props) => {
  const { className = "" } = props;

  const { localizeDate } = useTimeFormat();
  const dispatch = useDispatch();
  const toaster = useToaster();

  const { user: loggedUser } = useSelector((state) => state.session);

  const {
    generalSettings: { language, timezone, date_format, time_format, dark_mode, notifications_on, log_rocket, sentry, logs, notification_sound, order_channel: orderChannel },
    chatSettings: { order_channel, sound_enabled, preview_message, virtualization },
    userSettings: { isLoaded },
    setChatSetting,
    setWorkspaceSetting,
    setGeneralSetting,
    setPushSubscription,
  } = useSettings();

  const { _t, setLocale, uploadTranslationToServer } = useTranslation();
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
    {
      value: "de",
      label: (
        <>
          <Flag countryAbbr="de" className="mr-2" width="18" />
          {_t("LANGUAGE.GERMAN", "German")}
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
    setLocale(e.value);
    toaster.success(<span>You have successfully updated Language</span>);
  };

  const handleChatSwitchToggle = useCallback(
    (e) => {
      e.persist();
      const { name, checked, dataset } = e.target;
      setChatSetting({
        [name]: checked,
      });
      toaster.success(<span>{dataset.successMessage}</span>);
    },
    [setChatSetting]
  );

  const handleGeneralSwitchToggle = useCallback(
    (e) => {
      e.persist();
      const { name, checked, dataset } = e.target;

      setGeneralSetting(
        {
          [name]: checked ? "1" : "0",
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
    },
    [setChatSetting]
  );

  const handleNotificationsSwitchToggle = useCallback(
    (e) => {
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
    },
    [setGeneralSetting]
  );

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
        sort_by: e.value === "channel_date_updated"? "DESC" : "ASC",
      }
    });
    toaster.success(<span>You have successfully sort channel</span>);
  };

  const handleTimezoneChange = useCallback((e) => {
    setGeneralSetting({ timezone: e.value });
    toaster.success(<span>You have successfully updated Timezone</span>);
  }, []);

  const handleDateFormatChange = useCallback((e) => {
    setGeneralSetting({ date_format: e.value });
    toaster.success(<span>You have successfully updated Date format</span>);
  }, []);

  const handleTimeFormatChange = useCallback((e) => {
    setGeneralSetting({ time_format: e.value });
    toaster.success(<span>You have successfully updated Time format</span>);
  }, []);

  const handleSystemSettingsClick = () => {
    let a = document.createElement("a");
    a.href = `https://${getDriffName()}.driff.io/admin`;
    a.target = "_blank";
    a.click();
  };

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

  return (
    <Wrapper className={`profile-settings ${className}`}>
      {isLoaded ? (
        <>
          {loggedUser.role.name === "owner" && (
            <div className="card">
              <div className="card-body">
                <h6 className="card-title d-flex justify-content-between align-items-center mb-0">
                  System Settings <SvgIconFeather className="cursor-pointer" icon="settings" onClick={handleSystemSettingsClick} />
                </h6>
              </div>
            </div>
          )}
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
              {
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
              }
              <div className="row mb-2">
                <div className="col-5 text-muted">{dictionary.sortChannelLabel}</div>
                <div className="col-7">
                  <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={channelSortOptions.find((o) => o.value === order_channel.order_by)} onChange={handleSortChannelChange} options={channelSortOptions} />
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
                  <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={channelSortOptions.find((o) => o.value === orderChannel.order_by)} onChange={handleSortWorkspaceChange} options={channelSortOptions} />
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
                  <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={languageOptions.find((o) => o.value === language)} onChange={handleLanguageChange} options={languageOptions} />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-5 text-muted">{dictionary.timezoneLabel}</div>
                <div className="col-7">
                  <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={TimezoneOptions.find((o) => o.value === timezone)} onChange={handleTimezoneChange} options={TimezoneOptions} />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-5 text-muted">{dictionary.dateTimeFormatLabel}</div>
                <div className="col-7 justify-content-center align-items-center">
                  <div className="row">
                    <Select styles={dark_mode === "0" ? lightTheme : darkTheme} className="col-6" value={DateFormatOptions.find((o) => o.value === date_format)} onChange={handleDateFormatChange} options={DateFormatOptions} />
                    <Select styles={dark_mode === "0" ? lightTheme : darkTheme} className="col-6" value={TimeFormatOptions.find((o) => o.value === time_format)} onChange={handleTimeFormatChange} options={TimeFormatOptions} />
                  </div>
                </div>
              </div>
              {(["anthea@makedevelopment.com", "nilo@makedevelopment.com", "jessryll@makedevelopment.com", "johnpaul@makedevelopment.com"].includes(loggedUser.email)) && (
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
              <h6 className="card-title d-flex justify-content-between align-items-center">Notifications</h6>
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
              {/* <div className="row mb-2">
                <div className="col-5 text-muted">{dictionary.notificationSound}</div>
                <div className="col-7">
                  <Select styles={dark_mode === "0" ? lightTheme : darkTheme} value={notificationSoundOptions.find((o) => o.value === notification_sound)} onChange={handleNotificationSoundChange} options={notificationSoundOptions} />
                </div>
              </div> */}
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h6 className="card-title d-flex justify-content-between align-items-center">Extra settings</h6>

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
                    label={<span>Dark mode</span>}
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
      <span className="version-number">
        Driff version: {driffData.version} {localizeDate(driffData.timestamp)}
      </span>
    </Wrapper>
  );
};

export default React.memo(ProfileSettings);
