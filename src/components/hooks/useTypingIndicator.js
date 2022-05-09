import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const useTypingIndicator = (props) => {
  const channelId = useSelector((state) => state.chat.selectedChannelId);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const user = useSelector((state) => state.session.user);

  const [usersTyping, setUsersTyping] = useState([]);
  const [slug, setSlug] = useState(selectedChannel.slug ? selectedChannel.slug : localStorage.getItem("slug"));

  const timerRef = useRef(null);

  const usersRef = useRef(usersTyping);

  useEffect(() => {
    usersRef.current = usersTyping;
  });

  const handleSetUserTyping = (e) => {
    if (channelId === e.channel_id) {
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

  useEffect(() => {
    if (selectedChannel.slug) {
      setSlug(selectedChannel.slug);
    } else {
      setSlug(localStorage.getItem("slug"));
    }
  }, [selectedChannel.slug]);

  useEffect(() => {
    setUsersTyping([]);
    window[slug].private(slug + ".App.Channel." + channelId).listenForWhisper("typing", (e) => {
      handleSetUserTyping(e);
    });
    return () => {
      window[slug].leave(slug + ".App.Channel." + channelId);
    };
  }, [channelId, slug]);

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

export default useTypingIndicator;
