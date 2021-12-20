import { useDispatch } from "react-redux";
import { postWIPComment, addWIPComment } from "../../redux/actions/wipActions";

const useWIPCommentActions = () => {
  const dispatch = useDispatch();
  const submitComment = (payload, callback = () => {}) => {
    dispatch(postWIPComment(payload, callback));
  };
  const addComment = (payload, callback = () => {}) => {
    dispatch(addWIPComment(payload, callback));
  };
  return {
    submitComment,
    addComment,
  };
};

export default useWIPCommentActions;
