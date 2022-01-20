import { useDispatch } from "react-redux";
import { addFileComment, postFileComment, getFileComments, postFileApproval, postFileCommentClose, openFileDialog, putFileVersion, putFileComment } from "../../redux/actions/wipActions";

const useWIPFileActions = () => {
  const dispatch = useDispatch();
  const addComment = (payload, callback = () => {}) => {
    dispatch(addFileComment(payload, callback));
  };
  const submitComment = (payload, callback = () => {}) => {
    dispatch(postFileComment(payload, callback));
  };
  const updateComment = (payload, callback = () => {}) => {
    dispatch(putFileComment(payload, callback));
  };
  const fetchComments = (payload, callback = () => {}) => {
    dispatch(getFileComments(payload, callback));
  };
  const approve = (payload, callback = () => {}) => {
    dispatch(postFileApproval(payload, callback));
  };
  const closeComments = (payload, callback = () => {}) => {
    dispatch(postFileCommentClose(payload, callback));
  };
  const openDialog = (payload, callback = () => {}) => {
    dispatch(openFileDialog(payload, callback));
  };
  const uploadNewVersion = (payload, callback = () => {}) => {
    dispatch(putFileVersion(payload, callback));
  };

  return {
    addComment,
    fetchComments,
    submitComment,
    approve,
    closeComments,
    openDialog,
    uploadNewVersion,
    updateComment,
  };
};

export default useWIPFileActions;
