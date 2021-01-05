import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { setSelectedChannel } from "../../redux/actions/chatActions";

const useHuddle = (props) => {
  const [time, setCurrentTime] = useState(null);
  const history = useHistory();
  const showToasterRef = useRef(null);
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.session.user);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const isOwner = loggedUser.role && loggedUser.role.name === "owner";

  const huddleAnswered = localStorage.getItem("huddle");
  const huddleBots = useSelector((state) => state.chat.huddleBots);
  const huddle = huddleBots.find((h) => {
    if (h.questions.filter((q) => q.answer === null).length > 0) {
      const startAtHour = parseInt(h.start_at.time.substr(0, 2));
      const startAtMinutes = parseInt(h.start_at.time.substr(3, 2));
      const publishAtHour = parseInt(h.publish_at.time.substr(0, 2));
      const publishAtMinutes = parseInt(h.publish_at.time.substr(3, 2));
      let startAtDate = new Date();
      startAtDate.setUTCHours(startAtHour, startAtMinutes, 0);
      let publishAtDate = new Date();
      publishAtDate.setUTCHours(publishAtHour, publishAtMinutes, 0);
      return currentTime > startAtDate.getTime() && publishAtDate.getTime() > currentTime;
    } else {
      return false;
    }
  });

  const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
  let answeredChannels = huddleAnswered ? JSON.parse(huddleAnswered).channels : [];

  const showToaster = huddle !== undefined && !answeredChannels.some((id) => huddle && huddle.channel.id === id) && !isOwner && !isWeekend;
  console.log(showToasterRef);
  if (showToaster && showToasterRef.current === null) {
    const handleToastClick = () => {
      history.push(`/chat/${huddle.channel.code}`);
      showToasterRef.current = null;
      dispatch(setSelectedChannel({ id: huddle.channel.id }));
    };
    const options = {
      onClick: handleToastClick,
      onClose: () => (showToasterRef.current = null),
      autoClose: false,
      position: toast.POSITION.BOTTOM_LEFT,
      // and so on ...
    };

    if (selectedChannel && selectedChannel.id !== huddle.channel.id) {
      showToasterRef.current = true;
      toast(`Huddle time at ${huddle.channel.name}`, options);
    }
  } else if (showToasterRef.current && huddle && selectedChannel && selectedChannel.id === huddle.channel.id) {
    toast.dismiss();
  }

  setInterval(() => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const huddleStorage = localStorage.getItem("huddle");
    setCurrentTime(currentDate.getTime());
    if (huddleStorage) {
      const { day } = JSON.parse(huddleStorage);
      if (day < currentDay || currentDay === 0 || currentDay === 6) {
        localStorage.removeItem("huddle");
      }
    }
  }, 60000);
};

export default useHuddle;
