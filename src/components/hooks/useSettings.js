import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDriffCompSettings,
  getDriffSettings,
  getUserSettings,
  putCompanyUpdateName,
  setUserChatSetting,
  setUserGeneralSetting,
  updateUserSettings,
  updateReadAnnouncement,
  setUserWorkspaceSetting,
} from "../../redux/actions/settingsActions";
import { addToModals } from "../../redux/actions/globalActions";
import { setPushNotification } from "../../redux/actions/notificationActions";
import { useToaster } from "./index";

const useSettings = () => {
  const dispatch = useDispatch();
  const toaster = useToaster();
  const { driff: driffSettings, user: userSettings } = useSelector((state) => state.settings);
  const { user: loggedUser } = useSelector((state) => state.session);

  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  const [isCompSettingsIsLoading, setIsCompSettingsLoading] = useState(false);
  const [isUserSettingsIsLoading, setIsUserSettingsLoading] = useState(false);

  const setChatSetting = (e) => {
    dispatch(
      setUserChatSetting(e, () => {
        let payload = {
          disable_sound: "0",
          chat_settings: {
            ...userSettings.CHAT_SETTINGS,
            ...e,
          },
          general_settings: {
            ...userSettings.GENERAL_SETTINGS,
          },
        };
        dispatch(updateUserSettings(payload));
      })
    );
  };

  const setWorkspaceSetting = (e) => {
    dispatch(
      setUserWorkspaceSetting(e, () => {
        let payload = {
          ...userSettings,
          general_settings: {
            ...userSettings.GENERAL_SETTINGS,
            ...e,
          },
          order_channel: {
            ...e.order_channel,
          },
        };
        dispatch(updateUserSettings(payload));
      })
    );
  };

  const setGeneralSetting = (e, callback = () => {}) => {
    dispatch(
      setUserGeneralSetting(e, () => {
        let payload = {
          disable_sound: "0",
          chat_settings: {
            ...userSettings.CHAT_SETTINGS,
          },
          general_settings: {
            ...userSettings.GENERAL_SETTINGS,
            ...e,
          },
          enable_all_notification_reply_in_email: e.enable_all_notification_reply_in_email,
        };

        if (loggedUser) {
          dispatch(updateUserSettings(payload, callback));
        }
      })
    );
  };

  const setReadAnnouncement = () => {
    dispatch(updateUserSettings({ read_announcement: 1 }));
    dispatch(updateReadAnnouncement());
  };

  const fetch = () => {
    if (!driffSettings.isSettingsLoaded && !isSettingsLoading) {
      setIsSettingsLoading(true);
      dispatch(
        getDriffSettings({}, () => {
          setIsSettingsLoading(false);
        })
      );
    }
  };

  const fetchCompSettings = () => {
    if (!driffSettings.isCompSettingsLoaded && !isCompSettingsIsLoading) {
      setIsCompSettingsLoading(true);
      dispatch(
        getDriffCompSettings({}, () => {
          setIsCompSettingsLoading(false);
        })
      );
    }
  };

  const fetchUserSettings = () => {
    if (!userSettings.isLoaded && !isUserSettingsIsLoading) {
      setIsUserSettingsLoading(true);
      dispatch(getUserSettings(), () => {
        setIsUserSettingsLoading(false);
      });
    }
  };

  const createPersonalLink = (payload, callback = () => {}) => {
    let links = userSettings.GENERAL_SETTINGS.personal_links;
    links.push(payload);
    setGeneralSetting(
      {
        personal_links: links,
      },
      (err, res) => {
        toaster.success(<>You personal link {payload.name} is successfully created!</>);
        callback(err, res);
      }
    );
  };

  const updatePersonalLink = (payload, callback = () => {}) => {
    let links = userSettings.GENERAL_SETTINGS.personal_links;
    links[payload.index] = payload;
    setGeneralSetting(
      {
        personal_links: links,
      },
      (err, res) => {
        toaster.success(<>You personal link {payload.name} is successfully updated!</>);
        callback(err, res);
      }
    );
  };

  const deletePersonalLink = (payload, callback = () => {}) => {
    let links = userSettings.GENERAL_SETTINGS.personal_links;
    links.splice(payload.index, 1);
    setGeneralSetting(
      {
        personal_links: links,
      },
      (err, res) => {
        toaster.success(
          <>
            You have deleted <b>{payload.name}</b> personal link!
          </>
        );
        callback(err, res);
      }
    );
  };

  const handleDeleteLink = (item, options) => {
    showModal("personal_link_delete", item, options);
  };

  const showModal = (mode, item = null, options = {}) => {
    let payload = {};

    switch (mode) {
      case "personal_link_create": {
        payload = {
          type: "personal_link_create_edit",
          mode: "create",
          item: item,
          actions: {
            create: createPersonalLink,
          },
        };
        break;
      }
      case "personal_link_edit": {
        payload = {
          type: "personal_link_create_edit",
          mode: "edit",
          item: item,
          actions: {
            update: updatePersonalLink,
            delete: handleDeleteLink,
          },
        };
        break;
      }
      case "personal_link_delete": {
        payload = {
          type: "confirmation",
          headerText: options.dictionary.removeLink,
          submitText: options.dictionary.remove,
          cancelText: options.dictionary.cancel,
          bodyText: options.dictionary.removeLinkBodyText,
          actions: {
            onSubmit: () => {
              deletePersonalLink(item, options.callback);
            },
          },
        };
        break;
      }
      case "modal":
      default: {
        payload = item;
      }
    }

    dispatch(addToModals(payload));
  };

  const updateCompanyName = (payload, callback = () => {}) => {
    if (driffSettings.company_name === payload.company_name) {
      toaster.success("No update made.");
    } else {
      dispatch(
        putCompanyUpdateName(payload, (err, res) => {
          if (err) {
            toaster.error(
              <>
                <b>{payload.company_name}</b> can't be used.
              </>
            );
          }
          if (res) {
            toaster.success(`You have updated the company name to ${payload.company_name}`);
          }
          callback(err, res);
        })
      );
    }
  };
  const setEmailNotificationSettings = (e) => {
    /*    dispatch(updateUserSettings({ enable_all_notification_reply_in_email: e.enable_all_notification_reply_in_email })); */
  };

  const setPushSubscription = (payload) => {
    dispatch(setPushNotification(payload));
  };

  const init = () => {
    fetchCompSettings();
  };

  return {
    init,
    fetch,
    fetchUserSettings,
    updateCompanyName,
    userSettings,
    driffSettings,
    chatSettings: userSettings.CHAT_SETTINGS,
    generalSettings: {
      ...userSettings.GENERAL_SETTINGS,
      date_picker_format: userSettings.GENERAL_SETTINGS.date_format.replace("YYYY", "y").replace("DD", "d"),
      time_picker_format: userSettings.GENERAL_SETTINGS.time_format.replace("A", "a"),
    },
    setChatSetting,
    setGeneralSetting,
    setPushSubscription,
    setReadAnnouncement,
    showModal,
    loggedUser,
    setWorkspaceSetting,
    setEmailNotificationSettings,
  };
};

export default useSettings;
