import { useDispatch } from "react-redux";
import {
  getLoginSettings,
  putLoginSettings,
  getGoogleAuthSettings,
  setFilter,
  putQuickLinks,
  postQuickLinks,
  getUserBot,
  deleteUserBot,
  putUserBot,
  postUserBot,
  getGrippBot,
  putGrippBot,
  postUploadUserBotIcon,
  getGrippDetails,
  getGrippUsers,
  postSyncGrippUsers,
  createCheckoutSession,
  resetGrippUsersImage,
  updateAllowedDomains,
  getStripePricing,
  getStripeProducts,
  cancelStripeSubscription,
  resetCompanyLogo,
  uploadDashboardBg,
  uploadFavicon,
} from "../../redux/actions/adminActions";
import { addToModals } from "../../redux/actions/globalActions";
import { uploadDriffLogo } from "../../redux/actions/settingsActions";
import { useTranslationActions } from "./index";

const useAdminActions = () => {
  const dispatch = useDispatch();
  const { _t } = useTranslationActions();

  const dictionary = {
    cancelHeaderText: _t("MODAL.CANCEL_HEADER_TEXT", "Cancel subsription?"),
    cancelBodyText: _t("MODAL.CANCEL_BODY_TEXT", "Are you sure you want to cancel your Driff subscription?"),
    cancelSubscriptionButton: _t("BUTTON.CANCEL_SUBSCRIPTION", "Cancel subscription"),
    closeButton: _t("BUTTON.CLOSE", "Close"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    resetButton: _t("BUTTON.REMOVE_LOGO", "Remove logo"),
    resetHeaderText: _t("MODAL.REMOVE_HEADER_TEXT", "Remove company logo?"),
    resetBodyText: _t("MODAL.REMOVE_BODY_TEXT", "Are you sure you want to remove your company logo? Default Driff logo will be displayed if company logo is removed."),
  };

  const fetchLoginSettings = (payload, callback) => {
    dispatch(
      getLoginSettings(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const fetchGoogleAuthSettings = (payload, callback) => {
    dispatch(
      getGoogleAuthSettings(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    )
  }

  const updateLoginSettings = (payload, callback) => {
    dispatch(
      putLoginSettings(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const setAdminFilter = (payload, callback) => {
    dispatch(
      setFilter(payload, () => {
        if (callback) callback();
      })
    );
  };

  const updateQuickLinks = (payload, callback) => {
    dispatch(
      putQuickLinks(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const createQuickLinks = (payload, callback) => {
    dispatch(
      postQuickLinks(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const fetchUserBot = (payload, callback) => {
    dispatch(
      getUserBot(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const removeUserBot = (payload, callback) => {
    dispatch(
      deleteUserBot(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const updateUserBot = (payload, callback) => {
    dispatch(
      putUserBot(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const createUserBot = (payload, callback) => {
    dispatch(
      postUserBot(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const fetchGrippBot = (payload, callback) => {
    dispatch(
      getGrippBot(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const updateGrippBot = (payload, callback) => {
    dispatch(
      putGrippBot(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const uploadUserBotIcon = (payload, callback) => {
    dispatch(
      postUploadUserBotIcon(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const fetchGrippDetails = (payload, callback) => {
    dispatch(
      getGrippDetails(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const fetchGrippUsers = (payload, callback) => {
    dispatch(
      getGrippUsers(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const syncGrippUsers = (payload, callback) => {
    dispatch(
      postSyncGrippUsers(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const resetGrippProfileImages = (payload, callback) => {
    dispatch(
      resetGrippUsersImage(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  //   {
  //     "success_url": "https://getdriff.com/get-started/",
  //     "cancel_url": "https://getdriff.com/pricing/",
  //     "payment_method_types": ["card"],
  //     "mode": "subscription",
  //     "line_items": [
  //         {
  //             "price": "price_1JDRQXLoW9ieUi2mdBJP8Wkp",
  //             "quantity": 1
  //         }
  //     ]
  // }

  const stripeCheckout = (payload, callback) => {
    dispatch(
      createCheckoutSession(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const updateDomains = (payload, callback) => {
    dispatch(
      updateAllowedDomains(payload, () => {
        if (callback) callback();
      })
    );
  };

  const fetchStripePricing = (payload, callback) => {
    dispatch(
      getStripePricing(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const fetchStripeProducts = (payload, callback) => {
    dispatch(
      getStripeProducts(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const cancelSubscription = (payload = {}, callback = () => {}) => {
    const onConfirm = () => {
      dispatch(
        cancelStripeSubscription(payload, (err, res) => {
          if (callback) callback(err, res);
        })
      );
    };
    let modal = {
      type: "confirmation",
      headerText: dictionary.cancelHeaderText,
      submitText: dictionary.cancelSubscriptionButton,
      cancelText: dictionary.closeButton,
      bodyText: dictionary.cancelBodyText,
      actions: {
        onSubmit: onConfirm,
      },
    };

    dispatch(addToModals(modal));
  };

  const uploadLogo = (payload, callback) => {
    dispatch(
      uploadDriffLogo(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  const resetLogo = (payload, callback) => {
    const onConfirm = () => {
      dispatch(
        resetCompanyLogo(payload, (err, res) => {
          if (callback) callback(err, res);
        })
      );
    };
    let modal = {
      type: "confirmation",
      headerText: dictionary.resetHeaderText,
      submitText: dictionary.resetButton,
      cancelText: dictionary.cancel,
      bodyText: dictionary.resetBodyText,
      actions: {
        onSubmit: onConfirm,
      },
    };

    dispatch(addToModals(modal));
  };

  const uploadDashboardBackground = (payload, callback) => {
    dispatch(
      uploadDashboardBg(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };
  const uploadFaviconImage = (payload, callback) => {
    dispatch(
      uploadFavicon(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

  return {
    fetchLoginSettings,
    fetchGoogleAuthSettings,
    updateLoginSettings,
    setAdminFilter,
    updateQuickLinks,
    createQuickLinks,
    fetchUserBot,
    removeUserBot,
    updateUserBot,
    createUserBot,
    fetchGrippBot,
    updateGrippBot,
    uploadUserBotIcon,
    resetGrippProfileImages,
    fetchGrippDetails,
    fetchGrippUsers,
    syncGrippUsers,
    stripeCheckout,
    updateDomains,
    fetchStripePricing,
    fetchStripeProducts,
    cancelSubscription,
    uploadLogo,
    resetLogo,
    uploadDashboardBackground,
    uploadFaviconImage,
  };
};

export default useAdminActions;
