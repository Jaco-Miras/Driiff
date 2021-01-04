import { useSelector } from "react-redux";
import { useHuddleChatbot } from "./index";

const useHuddle = (props) => {
  const { selectedChannel } = props;

  const currentDate = new Date();
  const actions = useHuddleChatbot();
  const loggedUser = useSelector((state) => state.session.user);

  const isOwner = loggedUser.role && loggedUser.role.name === "owner";

  const huddleAnswered = localStorage.getItem("huddle");
  const huddleBots = useSelector((state) => state.chat.huddleBots);
  const huddle = huddleBots.find((h) => selectedChannel && h.channel.id === selectedChannel.id);

  let answeredChannels = huddleAnswered ? JSON.parse(huddleAnswered).channels : [];
  let pastStartTime = false;
  const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
  if (huddle) {
    const startAtHour = parseInt(huddle.start_at.time.substr(0, 2));
    const startAtMinutes = parseInt(huddle.start_at.time.substr(3, 2));
    const currentUtcHour = currentDate.getUTCHours();
    const currentUtcMinutes = currentDate.getUTCMinutes();
    pastStartTime = currentUtcHour >= startAtHour && currentUtcMinutes > startAtMinutes;
  }

  return {
    huddleAnswered,
    huddleActions: actions,
    showQuestions: huddle !== undefined && huddle.questions.find((q) => q.answer === null) !== undefined && !answeredChannels.some((id) => selectedChannel && selectedChannel.id === id) && pastStartTime && !isOwner && !isWeekend,
    question: huddle ? huddle.questions.find((q) => q.answer === null) : null,
    huddle,
  };
};

export default useHuddle;
