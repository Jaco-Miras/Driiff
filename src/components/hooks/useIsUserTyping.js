import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import usePreviousValue from "./usePreviousValue";

const useIsUserTyping = props => {

    const channel = useSelector(state => state.chat.selectedChannel);
    const user = useSelector(state => state.session.user);

    const [usersTyping, setUsersTyping] = useState([]);
    const previousChannel = usePreviousValue(channel);

    const timeout = useRef();

    timeout.current = setTimeout(() => {
        setUsersTyping([]);
    }, 3000);

    const handleSetUserTyping = (e) => {
        if (channel.id === e.channel_id) {
            console.log(e, channel.id)
            clearTimeout(timeout.current);
            if (e.user.id !== user.id) {
                if (usersTyping.length) {
                    let userExist = false;
                    usersTyping.forEach(u => {
                        if (u.id === e.user.id) {
                            userExist = true;

                        }
                    });
                    if (!userExist) {
                        setUsersTyping([...usersTyping, e.user]);
                    }
                } else {
                    setUsersTyping([e.user]);
                }
            }
        }
    };

    const handleSubscribeToChannel = (leaveId = null) => {
        setUsersTyping([]);
        if (channel.is_shared) {
            if (window[channel.slug_owner]) {
                if (leaveId) {
                    window[channel.slug_owner].leave(channel.slug_owner + `.App.Channel.` + leaveId);
                }
                window[channel.slug_owner].private(channel.slug_owner + `.App.Channel.` + channel.id)
                    .listenForWhisper("typing", e => {
                        handleSetUserTyping(e);
                    });
            }
        } else {
            if (window.Echo) {
                if (leaveId) {
                    window.Echo.leave(localStorage.getItem("slug") + `.App.Channel.` + leaveId);
                }
                window.Echo.private(localStorage.getItem("slug") + `.App.Channel.` + channel.id)
                    .listenForWhisper("typing", e => {
                        handleSetUserTyping(e);
                    });
            }
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

        return () => clearTimeout(timeout.current);

    }, [channel, previousChannel]);

    return usersTyping;
};

export default useIsUserTyping;