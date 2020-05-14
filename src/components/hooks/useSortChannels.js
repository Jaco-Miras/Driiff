import {useSelector} from "react-redux";


const useSortChannels = (search) => {

    const channels = useSelector(state => state.chat.channels);
    const channelDrafts = useSelector(state => state.chat.channelDrafts);
    const settings = useSelector(state => state.settings.userSettings);
    const user = useSelector(state => state.session.user);

    const getChannelTitle = (ac) => {
        if (ac.type === "DIRECT" && ac.members.length === 2) {
            let m = ac.members.filter(m => m.id !== user.id)[0];
            return m.first_name;
        } else {
            return ac.title;
        }

    };
    let results = Object.values(channels)
        //.concat(this.props.startNewChannels)
        .filter(channel => {
            if (typeof channel.add_user === "undefined")
                channel.add_user = 0;

            if (typeof channel.add_open_topic === "undefined")
                channel.add_open_topic = 0;

            if (search === "") {
                return channel.is_hidden === 0 && channel.is_archived === 0 && channel.add_user === 0 && channel.add_open_topic === 0;
            } else {
                return channel.search
                    .toLowerCase()
                    .indexOf(search.toLowerCase()) > -1;
            }
        })
        .sort(
            (a, b) => {

                let compare = 0;

                //personal bot with unread message
                if (a.type === "PERSONAL_BOT" && (a.total_unread >= 1 || a.total_mark_incomplete >= 1) && b.type !== "PERSONAL_BOT") {
                    return -1;
                }

                if (b.type === "PERSONAL_BOT" && (b.total_unread >= 1 || b.total_mark_incomplete >= 1) && a.type !== "PERSONAL_BOT") {
                    return 1;
                }

                //pinned
                compare = b.is_pinned - a.is_pinned;
                if (compare !== 0)
                    return compare;

                //recent
                compare = (a.is_hidden + a.add_user + a.add_open_topic + a.is_archived) - (b.is_hidden + b.add_user + b.add_open_topic + b.is_archived);
                if (compare !== 0)
                    return compare;

                //hidden
                compare = b.is_hidden - a.is_hidden;
                if (compare !== 0)
                    return compare;

                //add to user
                compare = b.add_user - a.add_user;
                if (compare !== 0)
                    return compare;

                //view topic
                compare = b.add_open_topic - a.add_open_topic;
                if (compare !== 0)
                    return compare;

                //archived
                compare = b.is_archived - a.is_archived;
                if (compare !== 0)
                    return compare;

                if (settings.CHAT_SETTINGS.order_channel.order_by === "channel_date_updated") {
                    if (settings.CHAT_SETTINGS.order_channel.sort_by === "DESC") {
                        if (typeof channelDrafts[b.id] !== "undefined" && typeof channelDrafts[a.id] !== "undefined") {

                            return channelDrafts[a.id].created_at.timestamp > channelDrafts[b.id].created_at.timestamp ? -1 : 1;

                        } else if (channelDrafts[b.id]) {
                            return 1;
                        } else if (channelDrafts[a.id]) {
                            return -1;
                        }
                    }

                    if (settings.CHAT_SETTINGS.order_channel.sort_by === "ASC") {
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
                        return settings.CHAT_SETTINGS.order_channel.sort_by === "DESC" ? -1 : 1;
                    }

                    if (!a.last_reply && b.last_reply) {
                        return settings.CHAT_SETTINGS.order_channel.sort_by === "DESC" ? 1 : -1;
                    }

                    if (!a.last_reply || !b.last_reply) {
                        return settings.CHAT_SETTINGS.order_channel.sort_by === "DESC" ? -1 : 1;
                    } else {
                        if (settings.CHAT_SETTINGS.order_channel.sort_by === "DESC")
                            return a.last_reply.created_at.timestamp > b.last_reply.created_at.timestamp ? -1 : 1;
                        else
                            return a.last_reply.created_at.timestamp > b.last_reply.created_at.timestamp ? 1 : -1;
                    }
                }

                let aTitle = getChannelTitle(a);
                let bTitle = getChannelTitle(b);

                if (settings.CHAT_SETTINGS.order_channel.order_by === "channel_name" && settings.CHAT_SETTINGS.order_channel.sort_by === "DESC") {
                    return bTitle.localeCompare(aTitle);
                } else {
                    return aTitle.localeCompare(bTitle);
                }
            },
        );
    return [results];
};

export default useSortChannels;