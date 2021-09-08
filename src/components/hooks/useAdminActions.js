import { useDispatch } from "react-redux";
import { getLoginSettings, putLoginSettings, setFilter, putQuickLinks, postQuickLinks } from "../../redux/actions/adminActions";

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

  return {
    fetchLoginSettings,
    updateLoginSettings,
    setAdminFilter,
    updateQuickLinks,
    createQuickLinks,
  };
};

export default useAdminActions;
