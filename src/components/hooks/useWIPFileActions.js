import { useDispatch } from "react-redux";
import { addFileComment, postFileComment, getFileComments, postFileApproval, postFileCommentClose } from "../../redux/actions/wipActions";

const useWIPFileActions = () => {
  const dispatch = useDispatch();
  const addComment = (payload, callback = () => {}) => {
    dispatch(addFileComment(payload, callback));
  };
  const submitComment = (payload, callback = () => {}) => {
    dispatch(postFileComment(payload, callback));
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
  return {
    addComment,
    fetchComments,
    submitComment,
    approve,
    closeComments,
  };
};

export default useWIPFileActions;
