import { useDispatch } from "react-redux";
import { deleteHuddleChatbot, getHuddleChatbot, postHuddleAnswer, postHuddleChatbot, putHuddleChatbot, getUserBots, saveHuddleAnswer } from "../../redux/actions/chatActions";

const useHuddleChatbot = () => {
  const dispatch = useDispatch();

  const fetch = (payload = {}, callback = () => {}) => {
    dispatch(getHuddleChatbot(payload, callback));
  };

  const create = (payload = {}, callback = () => {}) => {
    dispatch(postHuddleChatbot(payload, callback));
  };

  const update = (payload = {}, callback = () => {}) => {
    dispatch(putHuddleChatbot(payload, callback));
  };

  const remove = (payload = {}, callback = () => {}) => {
    dispatch(deleteHuddleChatbot(payload, callback));
  };

  const createAnswer = (payload = {}, callback = () => {}) => {
    dispatch(postHuddleAnswer(payload, callback));
  };

  const fetchUserBots = (payload = {}, callback = () => {}) => {
    dispatch(getUserBots(payload, callback));
  };

  const saveAnswer = (payload = {}, callback = () => {}) => {
    dispatch(saveHuddleAnswer(payload, callback));
  };

  return {
    fetch,
    create,
    update,
    remove,
    createAnswer,
    fetchUserBots,
    saveAnswer,
  };
};

export default useHuddleChatbot;
