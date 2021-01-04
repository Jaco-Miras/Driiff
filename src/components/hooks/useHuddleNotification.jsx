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
  const huddle = huddleBots.find((h) => h.questions.filter((q) => q.answer === null).length > 0);

  let answeredChannels = huddleAnswered ? JSON.parse(huddleAnswered).channels : [];
  let pastStartTime = false;
  let pastPublishTime = false;
  const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
  if (huddle) {
    const startAtHour = parseInt(huddle.start_at.time.substr(0, 2));
    const startAtMinutes = parseInt(huddle.start_at.time.substr(3, 2));
    const publishAtHour = parseInt(huddle.publish_at.time.substr(0, 2));
    const publishAtMinutes = parseInt(huddle.publish_at.time.substr(3, 2));
    const currentUtcHour = currentDate.getUTCHours();
    const currentUtcMinutes = currentDate.getUTCMinutes();
    pastStartTime = currentUtcHour >= startAtHour && currentUtcMinutes > startAtMinutes;
    pastPublishTime = currentUtcHour >= publishAtHour && currentUtcMinutes > publishAtMinutes;
  }

  const showToaster = huddle !== undefined && !answeredChannels.some((id) => huddle && huddle.channel.id === id) && !isOwner && !isWeekend && pastStartTime && !pastPublishTime;

  if (showToaster && showToasterRef.current === null) {
    const handleToastClick = () => {
      console.log(huddle);
      showToasterRef.current = null;
      history.push(`/chat/${huddle.channel.code}`);
      dispatch(setSelectedChannel({ id: huddle.channel.id }));
    };
    const options = {
      onClick: handleToastClick,
      autoClose: false,
      position: toast.POSITION.BOTTOM_LEFT,
      // and so on ...
    };
    if (selectedChannel === null || (selectedChannel && selectedChannel.id !== huddle.channel.id)) {
      showToasterRef.current = true;
      toast(`Huddle time at ${huddle.channel.name}`, options);
    }
  }
};

export default useHuddle;
