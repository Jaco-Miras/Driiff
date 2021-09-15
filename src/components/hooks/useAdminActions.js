import { useDispatch } from "react-redux";
import {
  getLoginSettings,
  putLoginSettings,
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
} from "../../redux/actions/adminActions";

const useAdminActions = () => {
  const dispatch = useDispatch();

  const fetchLoginSettings = (payload, callback) => {
    dispatch(
      getLoginSettings(payload, (err, res) => {
        if (callback) callback(err, res);
      })
    );
  };

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

  return {
    fetchLoginSettings,
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
  };
};

export default useAdminActions;
