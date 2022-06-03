import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { getNotifications, getAllSnoozedNotification } from "../../redux/actions/notificationActions";
// import { getUsers, getExternalUsers, getTeams } from "../../redux/actions/userAction";
// import { getUnreadNotificationCounterEntries, getToDoDetail, getAllRecipients } from "../../redux/actions/globalActions";
// import { getGlobalRecipients, getHuddleChatbot, getCompanyChannel, setChannelInitialLoad } from "../../redux/actions/chatActions";
// import { getNotificationSettings, getSecuritySettings } from "../../redux/actions/adminActions";
// import { useChannelActions } from "../hooks";
import { getChannel, addCompanyNameOnMembers } from "../../redux/actions/chatActions";
import { getSharedWorkspaces, getWorkspaces } from "../../redux/actions/workspaceActions";
import Echo from "laravel-echo";
import { sessionService } from "redux-react-session";

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
          getWorkspaces({ sharedPayload: sharedPayload }, (err, res) => {
            if (err) return;
            res.data.workspaces.forEach((ws) => {
              if (ws.topic_detail) {
                const channelCodes = [ws.topic_detail.channel.code, ws.topic_detail.team_channel.code];
                channelCodes.forEach((code) => {
                  if (code) {
                    dispatch(
                      getChannel({ code: code, sharedPayload: sharedPayload }, (err, res) => {
                        if (err) return;
                        dispatch(addCompanyNameOnMembers({ code: code, members: ws.members }));
                      })
                    );
                  }
                });
              }
            });
          })
        );

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
