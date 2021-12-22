import { useDispatch } from "react-redux";
import { addFileComment, postFileComment, getFileComments } from "../../redux/actions/wipActions";

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
  return {
    addComment,
    fetchComments,
    submitComment,
  };
};

export default useWIPFileActions;
