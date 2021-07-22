import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { setSelectedChannel, clearHuddleAnswers, adjustHuddleDate, clearHasUnpiblishedAnswers } from "../../redux/actions/chatActions";
import { useToaster, useHuddleChatbot } from "./index";

const useHuddle = (props) => {
  const [toggleInterval, setToggleInterval] = useState(true);
  const actions = useHuddleChatbot();
  const toaster = useToaster();
  const history = useHistory();
  const showToasterRef = useRef(null);
  const huddleRef = useRef(null);
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.session.user);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const channels = useSelector((state) => state.chat.channels);
  const isOwner = loggedUser.role && loggedUser.role.name === "owner";
  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const hasUnpublishedAnswers = useSelector((state) => state.chat.hasUnpublishedAnswers);
  const huddleBots = useSelector((state) => state.chat.huddleBots);
  const weekDays = [
    { day: "M", value: 1 },
    { day: "T", value: 2 },
    { day: "W", value: 3 },
    { day: "TH", value: 4 },
    { day: "F", value: 5 },
  ];

  const huddle = huddleBots.find((h) => {
    if (h.questions.filter((q) => q.answer === null).length > 0) {
      let inTimeRange = false;
      const startAtHour = parseInt(h.start_at.time.substr(0, 2));
      const startAtMinutes = parseInt(h.start_at.time.substr(3, 2));
      const publishAtHour = parseInt(h.publish_at.time.substr(0, 2));
      const publishAtMinutes = parseInt(h.publish_at.time.substr(3, 2));
      let startAtDate = new Date();
      startAtDate.setUTCHours(startAtHour, startAtMinutes, 0);
      startAtDate.setDate(currentDate.getDate());
      let publishAtDate = new Date();
      publishAtDate.setUTCHours(publishAtHour, publishAtMinutes, 0);
      publishAtDate.setDate(currentDate.getDate());
      inTimeRange = currentTime > startAtDate.getTime() && publishAtDate.getTime() > currentTime;
      if (selectedChannel && h.channel.id !== selectedChannel.id && inTimeRange) {
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
            return h.showToday;
          } else if (h.repeat_type === "YEARLY") {
            // same day and month
            return h.showToday;
          }
        } else if (h.end_type === "END_ON") {
          const endDate = new Date(h.end_select_on.substr(0, 4), parseInt(h.end_select_on.substr(5, 2)) - 1, h.end_select_on.substr(8, 2));
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
              return h.showToday;
            } else if (h.repeat_type === "YEARLY") {
              // same day and month
              return h.showToday;
            }
          } else {
            return false;
          }
        } else if (h.end_type === "END_AFTER_REPEAT") {
          if (h.repeat_count < h.end_select_after) {
            if (h.repeat_type === "DAILY") {
              return true;
            } else if (h.repeat_type === "WEEKLY") {
              if (h.repeat_select_weekly && weekDays.find((d) => d.day === h.repeat_select_weekly).value === currentDate.getDay()) {
                return true;
              } else {
                return false;
              }
            } else if (h.repeat_type === "MONTHLY") {
              return h.showToday;
            } else if (h.repeat_type === "YEARLY") {
              // same day and month
              return h.showToday;
            }
          }
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  });

  const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
  //let answeredChannels = huddleAnswered ? JSON.parse(huddleAnswered).channels : [];
  let answeredChannels = [...hasUnpublishedAnswers];

  const showToaster = huddle !== undefined && !answeredChannels.some((id) => huddle && huddle.channel.id === id) && !isWeekend;

  if (showToaster && showToasterRef.current === null) {
    const handleToastClick = () => {
      history.push(`/chat/${huddle.channel.code}`);
      showToasterRef.current = null;
      dispatch(setSelectedChannel({ id: huddle.channel.id }));
    };
    const handleDismiss = () => {
      showToasterRef.current = null;
      toaster.info("Huddle skipped.");
      actions.skipHuddle({
        channel_id: huddle.channel.id,
        huddle_id: huddle.id,
        body: `HUDDLE_SKIP::${JSON.stringify({
          huddle_id: huddle.id,
          author: {
            name: loggedUser.name,
            first_name: loggedUser.first_name,
            id: loggedUser.id,
            profile_image_link: loggedUser.profile_image_link,
          },
          user_bot: huddle.user_bot,
        })}`,
      });

      // if (huddleAnswered) {
      //   const { channels } = JSON.parse(huddleAnswered);
      //   localStorage.setItem("huddle", JSON.stringify({ channels: [...channels, huddle.channel.id], day: currentDate.getDay() }));
      // } else {
      //   localStorage.setItem("huddle", JSON.stringify({ channels: [huddle.channel.id], day: currentDate.getDay() }));
      // }
    };
    const CloseButton = ({ closeToast }) => (
      <i
        className="material-icons"
        onClick={(e) => {
          e.stopPropagation();
          closeToast();
          handleDismiss();
        }}
      >
        skip
      </i>
    );
    const options = {
      onClick: handleToastClick,
      autoClose: false,
      position: toast.POSITION.BOTTOM_LEFT,
      closeButton: CloseButton,
    };

    showToasterRef.current = true;
    huddleRef.current = huddle.id;

    toast(`Huddle time at ${huddle.channel.name}`, options);
  } else if (showToasterRef.current && huddle && selectedChannel && selectedChannel.id === huddle.channel.id) {
    showToasterRef.current = null;
    huddleRef.current = null;
    toast.dismiss();
  }

  if (showToasterRef.current && huddle && huddleRef.current && huddleRef.current !== huddle.id) {
    showToasterRef.current = null;
    huddleRef.current = null;
    toast.dismiss();
  }

  if (typeof huddle === "undefined" && showToasterRef.current) {
    showToasterRef.current = null;
    huddleRef.current = null;
    toast.dismiss();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      if (d.getDate() !== currentDate.getDate()) {
        //console.log(d.getDate(), currentDate.getDate());
        dispatch(clearHuddleAnswers());
        dispatch(adjustHuddleDate());
        dispatch(clearHasUnpiblishedAnswers());
        clearInterval(interval);
        setToggleInterval((prevState) => !prevState);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [toggleInterval]);
};

export default useHuddle;
