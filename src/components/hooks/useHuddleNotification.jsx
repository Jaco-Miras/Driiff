import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { setSelectedChannel } from "../../redux/actions/chatActions";

const useHuddle = (props) => {
  const history = useHistory();
  const showToasterRef = useRef(null);
  const currentDate = new Date();
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.session.user);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const isOwner = loggedUser.role && loggedUser.role.name === "owner";

  const huddleAnswered = localStorage.getItem("huddle");
  const huddleBots = useSelector((state) => state.chat.huddleBots);
  const huddle = huddleBots.find((h) => {
    if (h.questions.filter((q) => q.answer === null).length > 0) {
      let pastStartTime = false;
      let beforePublishTime = false;
      const startAtHour = parseInt(h.start_at.time.substr(0, 2));
      const startAtMinutes = parseInt(h.start_at.time.substr(3, 2));
      const publishAtHour = parseInt(h.publish_at.time.substr(0, 2));
      const publishAtMinutes = parseInt(h.publish_at.time.substr(3, 2));
      const currentUtcHour = currentDate.getUTCHours();
      const currentUtcMinutes = currentDate.getUTCMinutes();
      if (currentUtcHour > startAtHour) {
        pastStartTime = true;
      } else if (currentUtcHour === startAtHour) {
        if (currentUtcMinutes > startAtMinutes) {
          pastStartTime = true;
        }
      }
      if (currentUtcHour > publishAtHour) {
        beforePublishTime = true;
      } else if (currentUtcHour === publishAtHour) {
        if (currentUtcMinutes > publishAtMinutes) {
          beforePublishTime = true;
        }
      }
      return pastStartTime && beforePublishTime;
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
  } else if (showToasterRef.current && selectedChannel && selectedChannel.id === huddle.channel.id) {
    toast.dismiss();
  }
};

export default useHuddle;
