import { useSelector } from "react-redux";
import { useHuddleChatbot } from "./index";

const useHuddle = (props) => {
  const { selectedChannel } = props;

  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  //const currentUTCDate = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000);
  const actions = useHuddleChatbot();
  //const loggedUser = useSelector((state) => state.session.user);
  //const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const editHuddle = useSelector((state) => state.chat.editHuddle);

  //const isOwner = loggedUser.role && loggedUser.role.name === "owner";

  const huddleAnswered = localStorage.getItem("huddle");
  const huddleBots = useSelector((state) => state.chat.huddleBots);
  const huddle = huddleBots.find((h) => selectedChannel && h.channel.id === selectedChannel.id);

  let answeredChannels = huddleAnswered ? JSON.parse(huddleAnswered).channels : [];
  let inTimeRange = false;
  const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

  if (huddle) {
    const startAtHour = parseInt(huddle.start_at.time.substr(0, 2));
    const startAtMinutes = parseInt(huddle.start_at.time.substr(3, 2));
    const publishAtHour = parseInt(huddle.publish_at.time.substr(0, 2));
    const publishAtMinutes = parseInt(huddle.publish_at.time.substr(3, 2));
    let startAtDate = new Date();
    startAtDate.setUTCHours(startAtHour, startAtMinutes, 0);
    startAtDate.setDate(currentDate.getDate());
    let publishAtDate = new Date();
    publishAtDate.setUTCHours(publishAtHour, publishAtMinutes, 0);
    publishAtDate.setDate(currentDate.getDate());
    inTimeRange = currentTime > startAtDate.getTime() && publishAtDate.getTime() > currentTime;
    // console.log(huddle, inTimeRange, answeredChannels, "huddle");
    // console.log(currentDate, startAtDate, publishAtDate, "huddle dates");
  }

  return {
    huddle,
    huddleAnswered,
    huddleActions: actions,
    showQuestions: editHuddle !== null || (huddle && huddle.questions.find((q) => q.answer === null) !== undefined && !answeredChannels.some((id) => selectedChannel && selectedChannel.id === id) && inTimeRange && !isWeekend),
    question: editHuddle ? editHuddle.questions.find((q) => q.answer === null) : huddle ? huddle.questions.find((q) => q.answer === null) : null,
    isFirstQuestion: huddle && huddle.questions.find((q) => q.answer === null) ? huddle.questions.find((q) => q.answer === null).isFirstQuestion : null,
    editHuddle: editHuddle,
  };
};

export default useHuddle;
