import { useSelector } from "react-redux";
import { useSettings } from "./index";

const useSortChannels = (channels, search, options = {}, workspace) => {
  const user = useSelector((state) => state.session.user);
  const { chatSettings: settings } = useSettings();

  //const channelDrafts = useSelector((state) => state.chat.channelDrafts);

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
    .filter((channel) => {
      let isMember = channel.members.some(m => m.id === user.id);

      if (typeof channel.add_user === "undefined")
        channel.add_user = false;

      if (typeof channel.add_open_topic === "undefined") {
        channel.add_open_topic = !isMember;
      }

      if (options.type && options.type === "DIRECT") {
        if (!(channel.type === "DIRECT" || channel.type === "PERSON")) {
          return false;
        } else if (channel.members.length !== 2) {
          return false;
        }
      }

      if (workspace) {
        if (!(channel.type === "TOPIC" && isMember)) {
          return false;
        }
      }

      channel.is_relevant = 0;
      if (search.length >= 5) {
        if (channel.type === "DIRECT" && (channel.members
          .filter(m => m.id !== user.id)
          .some(m =>
            m.name.toLowerCase().includes(search.toLowerCase())
            || m.email.toLowerCase().includes(search.toLowerCase())
          ))) {
          channel.is_relevant = 1;
        }
      }

      if (search === "") {
        return !(channel.is_hidden || channel.is_archived === true || channel.add_user || channel.add_open_topic);
      } else {
        if (channel.type === "DIRECT" && channel.members.length === 2) {

          return channel.members.filter(m => m.id !== user.id).some(m => {
            if (m.email.toLowerCase().search(search.toLowerCase()) !== -1)
              return true;

            if (m.name.toLowerCase().search(search.toLowerCase()) !== -1)
              return true;

            return false;
          })
        }

        return (channel.search.toLowerCase().search(search.toLowerCase()) !== -1
          || channel.title.toLowerCase().search(search.toLowerCase()) !== -1
          || channel.members.filter(m => m.id !== user.id).some(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase() !== -1)))
      }
    })
    .sort((a, b) => {
      let compare = 0;
      const aTitle = getChannelTitle(a);
      const bTitle = getChannelTitle(b);

      /* uncomment if draft will be placed on top
      if (search === "" && (typeof channelDrafts[b.id] !== "undefined" || typeof channelDrafts[a.id] !== "undefined")) {
        if (typeof channelDrafts[b.id] !== "undefined" && typeof channelDrafts[a.id] !== "undefined") {
          if (settings.order_channel.order_by === "channel_date_updated") {
            return channelDrafts[a.id].created_at.timestamp > channelDrafts[b.id].created_at.timestamp ? -1 : 1;
          }
          if (settings.order_channel.order_by === "channel_name") {
            if (settings.order_channel.sort_by === "DESC") {
              return bTitle.localeCompare(aTitle);
            } else {
              return aTitle.localeCompare(bTitle);
            }
          }
        } else if (typeof channelDrafts[a.id] !== "undefined") {
          return -1;
        } else if (typeof channelDrafts[b.id] !== "undefined") {
          return 1;
        }
      }*/

      //personal bot with unread message
      if (a.type === "PERSONAL_BOT" && b.type !== "PERSONAL_BOT") {
        if (a.total_unread !== 0 || !a.is_read || a.total_mark_incomplete !== 0)
          return -1;
      }

      if (b.type === "PERSONAL_BOT" && a.type !== "PERSONAL_BOT") {
        if (b.total_unread !== 0 || !b.is_read || b.total_mark_incomplete !== 0)
          return 1;
      }

      //relevant
      compare = b.is_relevant - a.is_relevant;
      if (compare !== 0) return compare;

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

      // //sort by last reply
      // if (a.last_reply && b.last_reply) {
      //   return b.last_reply.created_at.timestamp - a.last_reply.created_at.timestamp
      // }

      //if search is active, direct users first
      if (search !== "") {
        if (!(a.type === "DIRECT" && b.type === "DIRECT")) {
          if (a.type === "DIRECT")
            return -1;

          if (b.type === "DIRECT")
            return 1;
        }

        if (!a.last_reply && !b.last_reply && (a.type === "DIRECT" || b.type === "DIRECT")) {
          if (a.type === "DIRECT")
            return -1;

          if (b.type === "DIRECT")
            return 1;
        }
      }

      //hidden and archived
      if (search.length > 2) {
        if ((b.is_hidden || b.is_archived === true) && !(a.is_hidden || b.is_archived === true))
          return -1;

        if ((a.is_hidden || a.is_archived === true) && !(b.is_hidden || b.is_archived === true))
          return 1;
      }

      if (settings.order_channel.order_by === "channel_date_updated") {
        if ( a.last_reply &&  b.last_reply) {
          if ( a.last_reply.created_at.timestamp ===  b.last_reply.created_at.timestamp) {
            return  aTitle.localeCompare(bTitle);
          }
          if ( settings.order_channel.sort_by === "DESC") {
            return  b.last_reply.created_at.timestamp -  a.last_reply.created_at.timestamp;
          } else {
            return  a.last_reply.created_at.timestamp -  b.last_reply.created_at.timestamp;
          }
        }

        if (a.last_reply && !b.last_reply) {
          return -1;
        }

        if (!a.last_reply && b.last_reply) {
          return 1;
        }

        if (!a.last_reply && !b.last_reply) {
          return aTitle.localeCompare(bTitle);
        }
      }

      if (settings.order_channel.order_by === "channel_name") {
        if (settings.order_channel.sort_by === "DESC") {
          return bTitle.localeCompare(aTitle);
        } else {
          return aTitle.localeCompare(bTitle);
        }
      }
    });
  return [results];
};

export default useSortChannels;
