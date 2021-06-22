import { useEffect, useRef } from "react";
import { useChannels, useUsers } from "./index";
import { useSelector } from "react-redux";
import { uniqByProp } from "../../helpers/arrayHelper";
import { useHistory, useRouteMatch } from "react-router-dom";

let init = true;

const useUserChannels = () => {
  const { channels, actions: channelActions } = useChannels();
  const { actions: userActions, loggedUser, ...otherUseUsers } = useUsers();
  const userChannels = Object.values(channels).filter((channel) => channel.add_user);
  const recipients = useSelector((state) => state.global.recipients);
  const searchingRef = useRef(null);
  const history = useHistory();
  const match = useRouteMatch();
  // const userChannels = useRef({});

  // for (const i in channels) {
  //   if (channels.hasOwnProperty(i)) {
  //     let channel = channels[i];

  //     if (channel.type !== "DIRECT") continue;

  //     if (userChannels && userChannels.current && channel.profile) {
  //       if (userChannels.current.hasOwnProperty(channel.profile.id)) continue;
  //     }

  //     userChannels.current = {
  //       ...userChannels.current,
  //       ...(channel.profile && {
  //         [channel.profile.id]: channel.id,
  //       }),
  //     };
  //   }
  // }

  const selectUserChannel = (user, callback = () => {}) => {
    const userChannel = userChannels.find((c) => c.profile.id === user.id);
    if (userChannel) {
      channelActions.createByUserChannel(userChannel, callback);
    } else {
      const channel = Object.values(channels).find((c) => c.profile && c.profile.id === user.id && c.type === "DIRECT");
      if (channel) {
        channelActions.select(channel);
        history.push(`/chat/${channel.code}`);
        if (callback) {
          callback(channel);
        }
      } else {
        //search the channel
        let cb = (err, res) => {
          searchingRef.current = null;
          if (err) return;
          if (res.data.channel_code) channelActions.fetchSelectChannel(res.data.channel_code);
          if (res.data && callback) {
            callback({ id: res.data.channel_id, code: res.data.channel_code });
          }
        };
        let user_ids = [user.id, loggedUser.id];
        let recipient_ids = recipients.filter((r) => r.type === "USER" && user_ids.some((id) => r.type_id === id));
        recipient_ids = uniqByProp(recipient_ids, "type_id");

        if (recipient_ids.length && recipient_ids.length === 2 && !searchingRef.current) {
          searchingRef.current = true;
          channelActions.searchExisting(
            "",
            recipient_ids.map((r) => r.id),
            cb
          );
        }
      }
    }
  };

  useEffect(() => {
    if (init) {
      init = false;
      // channelActions.fetchNoChannelUsers((err) => {
      //   if (err) init = false;
      // });
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...useChannels(),
    ...otherUseUsers,
    loggedUser,
    userActions,
    userChannels,
    selectUserChannel,
    history,
    match,
  };
};

export default useUserChannels;
