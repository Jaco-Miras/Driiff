import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import usePreviousValue from "./usePreviousValue";

const useIsUserTyping = props => {
    
    const channel = useSelector(state => state.chat.selectedChannel);
    const user = useSelector(state => state.session.user);

    const [usersTyping, setUsersTyping] = useState([]);
    const previousChannel = usePreviousValue(channel);

    const timeout = useRef();

    useEffect(() => {
        const handleSetUserTyping = (e) => {
            if (channel.id === e.channel_id) {
                clearTimeout(timeout.current);
                timeout.current = setTimeout(() => {
                    setUsersTyping([])
                }, 3000);
                if (e.user.id !== user.id) {
                    if (usersTyping.length) {
                        let userExist = false;
                        usersTyping.forEach(u => {
                            if (u.id === e.user.id) {
                                userExist = true;
                                return;
                            }
                        });
                        if (!userExist) {
                            setUsersTyping([...usersTyping, e.user])
                        }
                    } else {
                        setUsersTyping([e.user]);
                    }
                }
            }
        };
        const handleSubscribeToChannel = () => {
            if (channel.is_shared) {
                if (window[channel.slug_owner]) {
                    window[channel.slug_owner].private(channel.slug_owner + `.App.Channel.` + channel.id)
                        .listenForWhisper("typing", e => {
                            handleSetUserTyping(e);
                        });
                    }
            } else {
                if (window.Echo) {
                    window.Echo.private(localStorage.getItem("slug") + `.App.Channel.` + channel.id)
                        .listenForWhisper("typing", e => {
                            handleSetUserTyping(e);
                        });
                }
            }
        };

        if (previousChannel !== null && channel !== null) {
            if (previousChannel && previousChannel.id !== channel.id) {
                handleSubscribeToChannel();
            }
        }
        if ((previousChannel === undefined || previousChannel === null) && channel !== null) {
            handleSubscribeToChannel();
        }

        return () => clearTimeout(timeout.current);

    }, [channel, previousChannel]);

    return usersTyping;
}

export default useIsUserTyping;