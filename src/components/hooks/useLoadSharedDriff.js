import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSharedChannels } from "../../redux/actions/chatActions";
import { getSharedWorkspaces, getWorkspaces } from "../../redux/actions/workspaceActions";
import Echo from "laravel-echo";
import { sessionService } from "redux-react-session";
import { getSharedUsers } from "../../redux/actions/userAction";
import { useGetSlug } from ".";

const useLoadSharedDriff = () => {
  const dispatch = useDispatch();
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const sharedWsLoaded = useSelector((state) => state.workspaces.sharedWorkspacesLoaded);
  const sharedDriff = useSelector((state) => state.chat.sharedDriff);
  const session = useSelector((state) => state.session);
  const [newSharedWs, setNewSharedWs] = useState(null);

  const { slug } = useGetSlug();
  useEffect(() => {
    if (session.user.sharedWorkspaces) {
      Object.keys(session.user.sharedWorkspaces).forEach((ws) => {
        const sharedPayload = { slug: ws, token: session.user.sharedWorkspaces[ws].access_token, is_shared: true };
        dispatch(getSharedChannels({ skip: 0, limit: 15, sharedPayload: { slug: ws, token: session.user.sharedWorkspaces[ws].access_token, is_shared: true } }));
        dispatch(getWorkspaces({ sharedPayload: sharedPayload }));
        let sharedUserPayload = {
          skip: 0,
          limit: 1000,
          sharedPayload: { slug: ws, token: session.user.sharedWorkspaces[ws].access_token, is_shared: true },
        };
        if (ws.slice(0, -7) === slug) {
          dispatch(getSharedUsers(sharedUserPayload));
        }

        let myToken = `Bearer ${session.user.sharedWorkspaces[ws].access_token}`;
        let accessBroadcastToken = session.user.sharedWorkspaces[ws].access_broadcast_token;
        let host = process.env.REACT_APP_socketAddress;
        if (!window.io) window.io = require("socket.io-client");
        if (!window[ws]) {
          window[ws] = new Echo({
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
    }
    dispatch(
      getSharedWorkspaces({}, (err, res) => {
        if (err) return;
        sessionService.loadSession().then((current) => {
          sessionService.saveSession({ ...current, sharedWorkspaces: res.data });
        });
        if (session.user.sharedWorkspaces) {
          //check for new sharedWorkspaces
          let newSharedWs = Object.keys(res.data).filter((driff) => {
            if (Object.keys(session.user.sharedWorkspaces).some((k) => k === driff)) {
              return false;
            } else {
              return true;
            }
          });
          if (newSharedWs.length) {
            setNewSharedWs(newSharedWs);
          } else {
            sessionService.saveUser({ ...session.user, sharedWorkspaces: res.data });
          }
        } else {
          sessionService.saveUser({ ...session.user, sharedWorkspaces: res.data });
        }
      })
    );
  }, []);

  useEffect(() => {
    if (newSharedWs && sharedWsLoaded) {
      newSharedWs.forEach((ws) => {
        const sharedPayload = { slug: ws, token: sharedWs[ws].access_token, is_shared: true };
        dispatch(getSharedChannels({ skip: 0, limit: 15, sharedPayload: { slug: ws, token: sharedWs[ws].access_token, is_shared: true } }));
        dispatch(getWorkspaces({ sharedPayload: sharedPayload }));
        let sharedUserPayload = {
          skip: 0,
          limit: 1000,
          sharedPayload: { slug: ws, token: sharedWs[ws].access_token, is_shared: true },
        };
        if (ws.slice(0, -7) === slug) {
          dispatch(getSharedUsers(sharedUserPayload));
        }

        let myToken = `Bearer ${sharedWs[ws].access_token}`;
        let accessBroadcastToken = sharedWs[ws].access_broadcast_token;
        let host = process.env.REACT_APP_socketAddress;
        if (!window.io) window.io = require("socket.io-client");
        if (!window[ws]) {
          window[ws] = new Echo({
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
      sessionService.saveUser({ ...session.user, sharedWorkspaces: sharedWs });
    }
  }, [newSharedWs, sharedWsLoaded]);

  useEffect(() => {
    if (sharedWsLoaded) {
      Object.keys(sharedDriff).forEach((driff) => {
        if (sharedDriff[driff] && sharedDriff[driff].hasMore) {
          dispatch(getSharedChannels({ skip: sharedDriff[driff].skip, limit: 15, sharedPayload: { slug: driff, token: sharedWs[driff].access_token, is_shared: true } }));
        }
      });
    }
  }, [sharedWsLoaded, sharedDriff]);

  useEffect(() => {
    if (sharedWsLoaded && !session.user.hasOwnProperty("sharedWorkspaces")) {
      Object.keys(sharedWs).forEach((ws) => {
        const sharedPayload = { slug: ws, token: sharedWs[ws].access_token, is_shared: true };
        dispatch(getSharedChannels({ skip: 0, limit: 15, sharedPayload: { slug: ws, token: sharedWs[ws].access_token, is_shared: true } }));
        dispatch(getWorkspaces({ sharedPayload: sharedPayload }));
        let sharedUserPayload = {
          skip: 0,
          limit: 1000,
          sharedPayload: { slug: ws, token: sharedWs[ws].access_token, is_shared: true },
        };
        if (ws.slice(0, -7) === slug) {
          dispatch(getSharedUsers(sharedUserPayload));
        }

        let myToken = `Bearer ${sharedWs[ws].access_token}`;
        let accessBroadcastToken = sharedWs[ws].access_broadcast_token;
        let host = process.env.REACT_APP_socketAddress;
        if (!window.io) window.io = require("socket.io-client");
        if (!window[ws]) {
          window[ws] = new Echo({
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
    }
  }, [sharedWsLoaded]);
};

export default useLoadSharedDriff;
