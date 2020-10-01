import React, {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  getDriffCompSettings,
  getDriffSettings,
  getUserSettings,
  putCompanyUpdateName,
  setUserChatSetting,
  setUserGeneralSetting,
  updateUserSettings
} from "../../redux/actions/settingsActions";
import {addToModals} from "../../redux/actions/globalActions";
import {setPushNotification} from "../../redux/actions/notificationActions";
import {useToaster} from "./index";

const useSettings = () => {

  const dispatch = useDispatch();
  const toaster = useToaster();
  const {driff: driffSettings, user: userSettings, sessionUser} = useSelector((state) => state.settings);

  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  const [isCompSettingsIsLoading, setIsCompSettingsLoading] = useState(false);
  const [isUserSettingsIsLoading, setIsUserSettingsLoading] = useState(false);

  const setChatSetting = useCallback(
    (e) => {
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
    },
    [dispatch, userSettings]
  );

  const setGeneralSetting = useCallback(
    (e, callback = () => {
    }) => {
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
          };

          if (sessionUser) {
            dispatch(
              updateUserSettings(payload, callback)
            );
          }
        })
      );
    },
    [dispatch, userSettings]
  );

  const fetch = useCallback(() => {
    if (!driffSettings.isSettingsLoaded && !isSettingsLoading) {
      setIsSettingsLoading(true);
      dispatch(
        getDriffSettings({}, () => {
          setIsSettingsLoading(false);
        })
      );
    }
  }, [dispatch, driffSettings.isSettingsLoaded, setIsSettingsLoading, isSettingsLoading]);

  const fetchCompSettings = useCallback(() => {
    if (!driffSettings.isCompSettingsLoaded && !isCompSettingsIsLoading) {
      setIsCompSettingsLoading(true);
      dispatch(
        getDriffCompSettings({}, () => {
          setIsCompSettingsLoading(false)
        })
      );
    }
  }, [dispatch, driffSettings.isCompSettingsLoaded, setIsCompSettingsLoading, isCompSettingsIsLoading]);

  const fetchUserSettings = useCallback(() => {
    if (!userSettings.isLoaded && !isUserSettingsIsLoading) {
      setIsUserSettingsLoading(true);
      dispatch(getUserSettings(), () => {
        setIsUserSettingsLoading(false);
      });
    }
  }, [dispatch, !driffSettings.isSetting, setIsUserSettingsLoading, isUserSettingsIsLoading])

  const createPersonalLink = (payload, callback = () => {
  }) => {
    let links = userSettings.GENERAL_SETTINGS.personal_links;
    links.push(payload);
    setGeneralSetting({
      personal_links: links
    }, (err, res) => {
      toaster.success(<>You personal link {payload.name} is successfully created!</>);
      callback(err, res);
    })
  }

  const updatePersonalLink = (payload, callback = () => {
  }) => {
    let links = userSettings.GENERAL_SETTINGS.personal_links;
    links[payload.index] = payload;
    setGeneralSetting({
      personal_links: links
    }, (err, res) => {
      toaster.success(<>You personal link {payload.name} is successfully updated!</>);
      callback(err, res);
    })
  }

  const deletePersonalLink = (payload, callback = () => {
  }) => {
    let links = userSettings.GENERAL_SETTINGS.personal_links;
    links.splice(payload.index, 1);
    setGeneralSetting({
      personal_links: links
    }, (err, res) => {
      toaster.success(<>You have deleted <b>{payload.name}</b> personal link!</>);
      callback(err, res);
    })
  }

  const handleDeleteLink = useCallback((item, options) => {
    showModal("personal_link_delete", item, options)
  }, []);

  const showModal = useCallback(
    (mode, item = null, options = {}) => {
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
              delete: handleDeleteLink
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
    },
    [dispatch]
  );

  const updateCompanyName = (payload, callback = () => {
  }) => {
    if (driffSettings.company_name === payload.company_name) {
      toaster.success(`No update made.`);
    } else {
      dispatch(
        putCompanyUpdateName(payload, (err, res) => {
          if (err) {
            toaster.error(<><b>{payload.company_name}</b> can't be used.</>);
          }
          if (res) {
            toaster.success(`You have updated the company name to ${payload.company_name}`);
          }
          callback(err, res);
        })
      )
    }
  }

  const setPushSubscription = useCallback(
    (payload) => {
      dispatch(setPushNotification(payload));
    },
    [dispatch]
  );

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
    generalSettings: userSettings.GENERAL_SETTINGS,
    setChatSetting,
    setGeneralSetting,
    setPushSubscription,
    showModal,
  };
};

export default useSettings;
