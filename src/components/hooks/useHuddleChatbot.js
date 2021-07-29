import { useDispatch } from "react-redux";
import {
  deleteHuddleChatbot,
  getHuddleChatbot,
  postHuddleAnswer,
  postHuddleChatbot,
  putHuddleChatbot,
  getUserBots,
  saveHuddleAnswer,
  postUserBots,
  updateHuddleAnswer,
  clearEditHuddle,
  putUnpublishedAnswers,
  postSkipHuddle,
  snoozeHuddle,
  snoozeSkipHuddle,
  snoozeHuddleAll
} from "../../redux/actions/chatActions";

const useHuddleChatbot = () => {
  const dispatch = useDispatch();

  const fetch = (payload = {}, callback = () => { }) => {
    dispatch(getHuddleChatbot(payload, callback));
  };

  const create = (payload = {}, callback = () => { }) => {
    dispatch(postHuddleChatbot(payload, callback));
  };

  const update = (payload = {}, callback = () => { }) => {
    dispatch(putHuddleChatbot(payload, callback));
  };

  const remove = (payload = {}, callback = () => { }) => {
    dispatch(deleteHuddleChatbot(payload, callback));
  };

  const createAnswer = (payload = {}, callback = () => { }) => {
    dispatch(postHuddleAnswer(payload, callback));
  };

  const fetchUserBots = (payload = {}, callback = () => { }) => {
    dispatch(getUserBots(payload, callback));
  };

  const saveAnswer = (payload = {}, callback = () => { }) => {
    dispatch(saveHuddleAnswer(payload, callback));
  };

  const createUserBot = (payload = {}, callback = () => { }) => {
    dispatch(postUserBots(payload, callback));
  };

  const updateAnswer = (payload = {}, callback = () => { }) => {
    dispatch(updateHuddleAnswer(payload, callback));
  };

  const clearHuddle = (payload = {}, callback = () => { }) => {
    dispatch(clearEditHuddle(payload, callback));
  };

  const updateUnpublishedAnswers = (payload = {}, callback = () => { }) => {
    dispatch(putUnpublishedAnswers(payload, callback));
  };

  const skipHuddle = (payload, callback = () => { }) => {
    dispatch(postSkipHuddle(payload, callback));
  };

  const snooze = (payload) => {
    dispatch(snoozeHuddle(payload));
  };

  const snoozeSkip = (payload) => {
    dispatch(snoozeSkipHuddle(payload));
  };
  const snoozeAll = (payload) => {
    dispatch(snoozeHuddleAll(payload));
  };

  return {
    fetch,
    create,
    update,
    remove,
    createAnswer,
    fetchUserBots,
    saveAnswer,
    createUserBot,
    updateAnswer,
    clearHuddle,
    updateUnpublishedAnswers,
    skipHuddle,
    snooze,
    snoozeSkip,
    snoozeAll
  };
};

export default useHuddleChatbot;
