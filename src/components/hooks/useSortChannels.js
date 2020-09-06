import {useSelector} from "react-redux";
import {useSettings} from "./index";

const useSortChannels = (channels, search, options = {}, workspace) => {
  const user = useSelector((state) => state.session.user);
  const {chatSettings: settings} = useSettings();

  const channelDrafts = useSelector((state) => state.chat.channelDrafts);

  const getChannelTitle = (ac) => {
    if (ac.type === "DIRECT" && ac.members.length === 2) {
      let m = ac.members.filter((m) => m.id !== user.id)[0];
      if (m.hasOwnProperty("first_name")) {
        return m.first_name;
      } else {
        return m.name;
      }
    } else {
      return ac.title;
    }
  };

  let results = Object.values(channels)
    .filter((c) => {
      if (workspace) {
        const checkForId = (id) => id === user.id;
        let isMember = c.members.map((m) => m.id).some(checkForId);
        return c.type === "TOPIC" && isMember;
      } else {
        if (search === "" || search.length <= 2) {
          return c.type !== "TOPIC";
        } else {
          return true;
        }
      }
    })
    //.concat(this.props.startNewChannels)
    .filter((channel) => {
      if (typeof channel.add_user === "undefined")
        channel.add_user = false;

      if (typeof channel.add_open_topic === "undefined") {
        if (!channel.members.some(c => c.id === user.id)) {
          channel.add_open_topic = true;
        } else {
          channel.add_open_topic = false;
        }
      }

      if (options.type && options.type === "DIRECT") {
        if (!(channel.type === "DIRECT" || channel.type === "PERSON")) {
          return false;
        } else if (channel.members.length !== 2) {
          return false;
        }
      }

      if (search === "") {
        //return true;

        if (options.showHidden) {
          return !channel.is_archived && !channel.add_open_topic;
        } else {
          return !channel.is_hidden && !channel.is_archived && !channel.add_user && !channel.add_open_topic;
        }
      } else {
        return (channel.search.toLowerCase().search(search.toLowerCase()) !== -1 || channel.title.toLowerCase().search(search.toLowerCase()) !== -1)
      }
    })
    .sort((a, b) => {
      let compare = 0;
      const aTitle = getChannelTitle(a);
      const bTitle = getChannelTitle(b);

      if (a.type === "PERSONAL_BOT" && b.type !== "PERSONAL_BOT") {
        return -1;
      }

      if (b.type === "PERSONAL_BOT" && a.type !== "PERSONAL_BOT") {
        return 1;
      }

      //personal bot with unread message
      if (b.type === "PERSONAL_BOT" && a.type === "PERSONAL_BOT") {
        return ((b.total_unread >= 1 || b.total_mark_incomplete >= 1)) ? 1 : -1;
      }

      if (aTitle.toLowerCase() === search.toLowerCase())
        return -1;

      if (bTitle.toLowerCase() === search.toLowerCase())
        return 1;

      //add to user
      if ((a.add_user || a.add_open_topic) && !(b.add_user || b.add_open_topic)) {
        return 1;
      }
      if ((b.add_user || b.add_open_topic) && !(a.add_user || a.add_open_topic)) {
        return -1;
      }

      //pinned
      compare = b.is_pinned - a.is_pinned;
      if (compare !== 0) return compare;

      //direct users first
      if (!(a.type === "DIRECT" && b.type === "DIRECT")) {
        if (a.type === "DIRECT")
          return -1;

        if (b.type === "DIRECT")
          return 1;
      }

      //hidden and archived
      if (search.length > 2) {
        compare = (b.is_hidden + b.is_archived) - (a.is_hidden + b.is_archived);
        if (compare !== 0) return compare;
      }

      if (settings.order_channel.order_by === "channel_date_updated") {
        if (settings.order_channel.sort_by === "DESC") {
          if (typeof channelDrafts[b.id] !== "undefined" && typeof channelDrafts[a.id] !== "undefined") {
            return channelDrafts[a.id].created_at.timestamp > channelDrafts[b.id].created_at.timestamp ? -1 : 1;
          } else if (channelDrafts[b.id]) {
            return 1;
          } else if (channelDrafts[a.id]) {
            return -1;
          }
        }

        if (settings.order_channel.sort_by === "ASC") {
          if (typeof channelDrafts[b.id] !== "undefined" && typeof channelDrafts[a.id] !== "undefined") {
            return channelDrafts[a.id].created_at.timestamp < channelDrafts[b.id].created_at.timestamp ? -1 : 1;
          } else if (channelDrafts[b.id]) {
            return -1;
          } else if (channelDrafts[a.id]) {
            return 1;
          }
        }

        //Uncomment for Last Reply sorting
        if (a.last_reply && !b.last_reply) {
          return settings.order_channel.sort_by === "DESC" ? -1 : 1;
        }

        if (!a.last_reply && b.last_reply) {
          return settings.order_channel.sort_by === "DESC" ? 1 : -1;
        }

        if (!a.last_reply || !b.last_reply) {
          return settings.order_channel.sort_by === "DESC" ? -1 : 1;
        } else {
          if (settings.order_channel.sort_by === "DESC") return a.last_reply.created_at.timestamp > b.last_reply.created_at.timestamp ? -1 : 1;
          else return a.last_reply.created_at.timestamp > b.last_reply.created_at.timestamp ? 1 : -1;
        }
      }


      if (settings.order_channel.order_by === "channel_name" && settings.order_channel.sort_by === "DESC") {
        return bTitle.localeCompare(aTitle);
      } else {
        return aTitle.localeCompare(bTitle);
      }
    });
  return [results];
};

export default useSortChannels;
