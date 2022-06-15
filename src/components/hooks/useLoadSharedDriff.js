import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getChannel, addCompanyNameOnMembers, getSharedChannels } from "../../redux/actions/chatActions";
import { getSharedWorkspaces, getWorkspaces } from "../../redux/actions/workspaceActions";
import Echo from "laravel-echo";
import { sessionService } from "redux-react-session";
import { getSharedUsers } from "../../redux/actions/userAction";

const useLoadSharedDriff = () => {
  const dispatch = useDispatch();
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const sharedWsLoaded = useSelector((state) => state.workspaces.sharedWorkspacesLoaded);
  useEffect(() => {
    dispatch(
      getSharedWorkspaces({}, (err, res) => {
        if (err) return;
        sessionService.loadSession().then((current) => {
          sessionService.saveSession({ ...current, sharedWorkspaces: res.data });
        });
      })
    );
  }, []);

  useEffect(() => {
    if (sharedWsLoaded) {
      Object.keys(sharedWs).forEach((ws) => {
        const sharedPayload = { slug: ws, token: sharedWs[ws].access_token, is_shared: true };
        dispatch(
          getSharedChannels({ skip: 0, limit: 30, sharedPayload: { slug: ws, token: sharedWs[ws].access_token, is_shared: true } }, (err, res) => {
            if (err) return;
          })
        );
        dispatch(
          getWorkspaces({ sharedPayload: sharedPayload }, (err, res) => {
            if (err) return;

            // const channelCodes = res.data.workspaces
            //   .map((ws) => {
            //     if (ws.topic_detail) {
            //       return [
            //         { code: ws.topic_detail.channel.code, members: ws.members },
            //         { code: ws.topic_detail.team_channel.code, members: ws.members },
            //       ];
            //     }
            //   })
            //   .flat();
            // if (channelCodes.length) {
            //   channelCodes.forEach((c) => {
            //     if (c.code) {
            //       dispatch(
            //         getChannel({ code: c.code, sharedPayload: { slug: ws, token: sharedWs[ws].access_token, is_shared: true } }, (err, res) => {
            //           if (err) return;
            //           dispatch(addCompanyNameOnMembers({ code: c.code, members: c.members }));
            //         })
            //       );
            //     }
            //   });
            // }
          })
        );
        let sharedUserPayload = {
          skip: 0,
          limit: 1000,
          sharedPayload: { slug: ws, token: sharedWs[ws].access_token, is_shared: true },
        };
        dispatch(getSharedUsers(sharedUserPayload));

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
