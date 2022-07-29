import { useEffect } from "react";
import { sessionService } from "redux-react-session";
import { useSelector } from "react-redux";
import Echo from "laravel-echo";

const useSocketConnection = (props) => {
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const sharedWsLoaded = useSelector((state) => state.workspaces.sharedWorkspacesLoaded);

  useEffect(() => {
    sessionService.loadSession().then((current) => {
      let myToken = current.token;
      let accessBroadcastToken = current.access_broadcast_token;
      let host = process.env.REACT_APP_socketAddress;
      const slug = localStorage.getItem("slug");
      if (!window.io) window.io = require("socket.io-client");
      window.Echo = {};
      if (window.Echo && !window.Echo[slug]) {
        window.Echo[slug] = new Echo({
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

  useEffect(() => {
    if (sharedWsLoaded) {
      Object.keys(sharedWs).forEach((ws) => {
        let myToken = `Bearer ${sharedWs[ws].access_token}`;
        let accessBroadcastToken = sharedWs[ws].access_broadcast_token;
        let host = process.env.REACT_APP_socketAddress;
        if (!window.io) window.io = require("socket.io-client");
        if (window.Echo) {
          console.log(window.Echo);
          if (!window.Echo[ws]) {
            window.Echo[ws] = new Echo({
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
        }
      });
    }
    console.log(window);
  }, [sharedWsLoaded, sharedWs]);
};

export default useSocketConnection;
