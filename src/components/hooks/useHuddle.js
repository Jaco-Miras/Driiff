import { useSelector } from "react-redux";
import { useHuddleChatbot } from "./index";

const useHuddle = (props) => {
  const { selectedChannel } = props;

  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  //const currentUTCDate = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000);
  const actions = useHuddleChatbot();
  //const loggedUser = useSelector((state) => state.session.user);
  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const editHuddle = useSelector((state) => state.chat.editHuddle);

  //const isOwner = loggedUser.role && loggedUser.role.name === "owner";
  const weekDays = [
    { day: "M", value: 1 },
    { day: "T", value: 2 },
    { day: "W", value: 3 },
    { day: "TH", value: 4 },
    { day: "F", value: 5 },
  ];
  const huddleAnswered = localStorage.getItem("huddle");
  const huddleBots = useSelector((state) => state.chat.huddleBots);
  const huddle = huddleBots.find((h) => {
    if (selectedChannel && h.channel.id === selectedChannel.id) {
      if (h.end_type === "NEVER") {
        if (h.repeat_type === "DAILY") {
          return true;
        } else if (h.repeat_type === "WEEKLY") {
          if (h.repeat_select_weekly && weekDays.find((d) => d.day === h.repeat_select_weekly).value === currentDate.getDay()) {
            return true;
          } else {
            return false;
          }
        } else if (h.repeat_type === "MONTHLY") {
          if (h.repeat_select_monthly === currentDate.getDate()) {
            return true;
          } else {
            return false;
          }
        } else if (h.repeat_type === "YEARLY") {
          // same day and month
          if (parseInt(huddle.repeat_select_yearly.substr(5, 2)) - 1 === currentDate.getMonth() && parseInt(huddle.repeat_select_yearly.substr(8, 2)) === currentDate.getDate()) {
            return true;
          } else {
            return false;
          }
        }
      } else if (h.end_type === "END_ON") {
        const endDate = new Date(huddle.end_select_on.substr(0, 4), parseInt(huddle.end_select_on.substr(5, 2)) - 1, huddle.end_select_on.substr(8, 2));
        if (currentDate.getTime() < endDate.getTime()) {
          if (h.repeat_type === "DAILY") {
            return true;
          } else if (h.repeat_type === "WEEKLY") {
            if (h.repeat_select_weekly && weekDays.find((d) => d.day === h.repeat_select_weekly).value === currentDate.getDay()) {
              return true;
            } else {
              return false;
            }
          } else if (h.repeat_type === "MONTHLY") {
            if (h.repeat_select_monthly === currentDate.getDate()) {
              return true;
            } else {
              return false;
            }
          } else if (h.repeat_type === "YEARLY") {
            // same day and month
            if (parseInt(huddle.repeat_select_yearly.substr(5, 2)) - 1 === currentDate.getMonth() && parseInt(huddle.repeat_select_yearly.substr(8, 2)) === currentDate.getDate()) {
              return true;
            } else {
              return false;
            }
          }
        } else {
          return false;
        }
      } else if (h.end_type === "END_AFTER_REPEAT") {
        return true;
      }
    } else {
      return false;
    }
  });

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
