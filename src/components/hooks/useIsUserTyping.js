import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import usePreviousValue from "./usePreviousValue";

const useIsUserTyping = (props) => {
  const channel = useSelector((state) => state.chat.selectedChannel);
  const user = useSelector((state) => state.session.user);

  const [usersTyping, setUsersTyping] = useState([]);
  const previousChannel = usePreviousValue(channel);

  const timerRef = useRef(null);

  const usersRef = useRef(usersTyping);

  useEffect(() => {
    usersRef.current = usersTyping;
  });

  const handleSetUserTyping = (e) => {
    if (channel.id === e.channel_id) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setUsersTyping([]);
      }, 3000);

      if (e.user.id !== user.id) {
        if (usersRef.current.length) {
          let userExist = false;
          usersRef.current.forEach((u) => {
            if (u.id === e.user.id) {
              userExist = true;
            }
          });
          if (!userExist) {
            setUsersTyping([...usersRef.current, e.user]);
          }
        } else {
          setUsersTyping([e.user]);
        }
      }
    }
  };

  const handleSubscribeToChannel = (leaveId = null) => {
    setUsersTyping([]);
    const slug = localStorage.getItem("slug");
    if (window[slug]) {
      if (leaveId) {
        window[slug].leave(localStorage.getItem("slug") + ".App.Channel." + leaveId);
      }
      window[slug].private(localStorage.getItem("slug") + ".App.Channel." + channel.id).listenForWhisper("typing", (e) => {
        handleSetUserTyping(e);
      });
    }
  };

  useEffect(() => {
    if (previousChannel !== null && channel !== null) {
      if (previousChannel && previousChannel.id !== channel.id) {
        handleSubscribeToChannel(previousChannel.id);
      }
    }
    if ((previousChannel === undefined || previousChannel === null) && channel !== null) {
      handleSubscribeToChannel();
    }

    //return () => clearTimeout(timeout.current);
  }, [channel, previousChannel, usersTyping]);

  if (usersTyping.length) {
    let userNames = usersTyping
      .map((u) => u.first_name)
      .slice(0, 3)
      .join(", ");
    if (usersTyping.length > 3) {
      userNames += "and others";
    }
    return [usersTyping, userNames];
  } else {
    return [usersTyping, null];
  }
};

export default useIsUserTyping;
