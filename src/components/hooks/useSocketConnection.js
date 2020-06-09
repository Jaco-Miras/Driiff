import {useEffect} from "react";
import {sessionService} from "redux-react-session";
import Echo from "laravel-echo";

const useSocketConnection = props => {

    useEffect(() => {
        sessionService.loadSession().then(current => {
            let myToken = current.token;
            let accessBroadcastToken = current.access_broadcast_token;
            let host = process.env.REACT_APP_socketAddress;
            if (!window.io) window.io = require("socket.io-client");
            if (!window.Echo) {
                window.Echo = new Echo({
                    broadcaster: "socket.io",
                    host: host,
                    auth: {
                        headers: {
                            Authorization: myToken,
                            "Driff-Broadcast-Token": accessBroadcastToken,
                        },
                    },
                });
            }
        });
    }, []);
    
};

export default useSocketConnection;