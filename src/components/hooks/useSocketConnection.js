import { useEffect } from "react";
import { sessionService } from "redux-react-session";
import Echo from "laravel-echo";

const useSocketConnection = (props) => {
  useEffect(() => {
    sessionService.loadSession().then((current) => {
      let myToken = current.token;
      let accessBroadcastToken = current.access_broadcast_token;
      let host = process.env.REACT_APP_socketAddress;
      const slug = localStorage.getItem("slug");
      if (!window.io) window.io = require("socket.io-client");
      if (!window[slug]) {
        window[slug] = new Echo({
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
