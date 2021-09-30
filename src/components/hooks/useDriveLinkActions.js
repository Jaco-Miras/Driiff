import { useDispatch } from "react-redux";
import { getDriveLinks, postDriveLink, putDriveLink, deleteDriveLink, getTopicDriveLinks } from "../../redux/actions/fileActions";

const useDriveLinkActions = () => {
  const dispatch = useDispatch();

  const fetchDriveLinks = (payload, callback) => {
    dispatch(getDriveLinks(payload, callback));
  };

  const fetchTopicDriveLinks = (payload, callback) => {
    dispatch(getTopicDriveLinks(payload, callback));
  };

  const createDriveLink = (payload, callback) => {
    dispatch(postDriveLink(payload, callback));
  };

  const updateDriveLink = (payload, callback) => {
    dispatch(putDriveLink(payload, callback));
  };

  const removeDriveLink = (payload, callback) => {
    dispatch(deleteDriveLink(payload, callback));
  };

  return {
    fetchDriveLinks,
    createDriveLink,
    updateDriveLink,
    removeDriveLink,
    fetchTopicDriveLinks,
  };
};

export default useDriveLinkActions;
