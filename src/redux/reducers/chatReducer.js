// import {uniqBy} from "lodash";
import {getCurrentTimestamp} from "../../helpers/dateFormatter";
import {localizeDate} from "../../helpers/momentFormatJS";

/** Initial State  */
const INITIAL_STATE = {
    user: null,
    channels: {},
    selectedChannel: null,
    startNewChannels: {},
    channelDrafts: {},
    unreadChatCount: 0,
    historicalPositions: [],
    editChatMessage: null,
    sendButtonClicked: false,
    chatQuotes: {},
    channelsLoaded: false,
    lastVisitedChannel: null,
};

export default function (state = INITIAL_STATE, action) {

    switch (action.type) {
        case "GET_GLOBAL_RECIPIENTS_SUCCESS": {
            let channels = state.channels;
            action.data.result.forEach((ac, index) => {
                if (ac.type === "USER") {
                    ac.type = "DIRECT";
                    ac.members = [{
                        id: ac.id,
                        name: ac.name,
                        profile_image_link: ac.profile_image_link,
                    }];
                    ac.replies = [];
                    ac.add_user = 1;
                    ac.profile = {
                        first_name: ac.first_name,
                        id: ac.id,
                        name: ac.name,
                        profile_image_link: ac.profile_image_link,
                    };
                }

                if (ac.type === "TOPIC") {
                    ac.members = ac.channel_members;
                    ac.replies = [];
                    ac.add_open_topic = 1;

                    if (ac.channel_code === null) {
                        ac.recipient_ids = [ac.id];
                    } else {
                        ac.hasMore = true;
                        ac.code = ac.channel_code;
                        ac.entity_id = ac.channel_id;
                        ac.read_only = true;
                    }
                }

                channels[ac.key_id] = {
                    ...channels[ac.key_id],
                    ...ac,
                    id: ac.key_id,
                    title: ac.name,
                    is_pinned: 0,
                    is_hidden: 0,
                    is_archived: 0,
                };
            });
            return {
                ...state,
                channels: channels,
            };
        }
        case "RENAME_CHANNEL_KEY":
            let channels = state.channels;
            delete channels[action.data.old_id];
            delete action.data.old_id;

            channels[action.data.id] = action.data;

            let selectedChannel = state.selectedChannel;
            if (action.data.selected) {
                if (selectedChannel) {
                    channels[selectedChannel.id].selected = false;
                }
                selectedChannel = action.data;
            }

            return {
                ...state,
                channels: channels,
                selectedChannel: selectedChannel,
            };
        case "GET_CHANNELS_SUCCESS": {
            let channels = state.channels;
            action.data.results.filter(r => {
                if (state.selectedChannel && state.selectedChannel.id === r.id) return false;
                else return true;
            }).forEach((r, i) => {
                channels[r.id] = {
                    ...channels[r.id],
                    ...r,
                    hasMore: true,
                    skip: 0,
                    replies: [],
                    selected: false,
                };
            });

            return {
                ...state,
                channels: channels,
                channelsLoaded: true,
            };
        }
        case "GET_WORKSPACES_SUCCESS": {
            //let topics = action.data.workspaces.map(ws => ws.topics).flat().filter(t => t !== undefined);
            // let topicChannels = action.data.workspaces.map(ws => {
            //     if (ws.type === "FOLDER") {
            //         return ws.topics
            //     } else if (ws.type === "WORKSPACE") {
            //         return ws.topic_detail
            //     }
            // })
            // console.log(topicChannels.flat());
            return state;
        }
        case "UPDATE_CHANNEL_REDUCER": {
            let channel = {
                ...state.channels[action.data.id],
                ...action.data,
            };

            return {
                ...state,
                channels: {
                    ...state.channels,
                    [action.data.id]: channel,
                },
                selectedChannel: state.selectedChannel && state.selectedChannel.id === channel.id ? channel : state.selectedChannel,
            };
        }
        case "SET_SELECTED_CHANNEL": {
            let channel = {
                ...state.channels[action.data.id],
                ...action.data,
            };

            let updatedChannels = {...state.channels};
            if (state.selectedChannel) {
                updatedChannels[state.selectedChannel.id].selected = false;
                updatedChannels[action.data.id].selected = true;
            }

            return {
                ...state,
                selectedChannel: channel,
                channels: updatedChannels,
            };
        }
        case "UPDATE_MEMBER_TIMESTAMP": {
            let channel = null;
            if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
                channel = {...state.channels[action.data.channel_id]};
                channel = {
                    ...channel,
                    is_read: 1,
                    total_unread: state.user && state.user.id === action.data.member_id ? 0 : channel.total_unread,
                    members: channel.members.map(m => {
                        if (m.id === action.data.member_id) {
                            return {
                                ...m,
                                last_visited_at: {
                                    timestamp: action.data.timestamp + 3,
                                },
                            };
                        } else return m;
                    }),
                };
            }
            return {
                ...state,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.channel_id]: channel,
                    }
                    : state.channels,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id ?
                    {
                        ...channel,
                    }
                    : state.selectedChannel,
            };
        }
        case "ADD_TO_CHANNELS": {

            return {
                ...state,
                channels: {
                    ...state.channels,
                    [action.data.id]: action.data,
                },
            };
        }
        case "GET_CHAT_MESSAGES_SUCCESS": {
            let channel = {...state.channels[action.data.channel_id]};
            channel = {
                ...channel,
                replies: [...action.data.results.map(r => {
                    if (channel.type === "PERSONAL_BOT" && r.body.search(/You asked me to remind you about/) > -1) {
                        r.original_body = r.body;

                        const channelName = r.body.replace(r.body.substr(0, r.body.search(" in ") + 4, r.body), "");
                        r.body = r.body.replace(` in ${channelName}`, ` in <a class="push" data-href="/chat/${r.quote.channel_code}">#${channelName}</a>`);

                        const link = `/chat/${r.quote.channel_code}/${r.quote.code}`;
                        r.body = r.body.replace("this message", `<a class="push" data-href="${link}">this message</a>`);

                        if (r.is_completed === true) {
                            r.body = `<span class="completed">${r.body}</span><br/> ${r.original_body.replace("You asked me to remind you", "OK! I’ve marked the reminder")} as complete.`;
                        } else {
                            r.body = `${r.body}<br/> <span class="action"><a class="btn btn-complete btn-action" data-message_id="${r.id}">Mark as Complete</a> <a class="btn btn-delete btn-action" data-message_id="${r.id}">Delete</a></span>`;
                        }
                    }

                    return {
                        ...r,
                        is_read: true,
                        channel_id: action.data.channel_id,
                        g_date: localizeDate(r.created_at.timestamp, "YYYY-MM-DD"),
                    };
                }), ...channel.replies],
                read_only: action.data.read_only,
                hasMore: action.data.results.length === 20,
                skip: channel.skip === 0 && channel.replies.length ?
                    channel.replies.length + 20 : channel.skip + 20,
            };
            return {
                ...state,
                channels: {
                    ...state.channels,
                    [action.data.channel_id]: channel,
                },
                selectedChannel: channel.id === state.selectedChannel.id ? channel : state.selectedChannel,
            };
        }
        case "MARK_ALL_MESSAGES_AS_READ": {
            let channel = null;
            if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
                channel = {...state.channels[action.data.channel_id]};
                channel = {
                    ...channel,
                    replies: channel.replies.map(r => {
                        return {
                            ...r,
                            is_read: true,
                        };
                    }),
                };
            }
            return {
                ...state,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.channel_id]: channel,
                    }
                    : state.channels,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id ?
                    {
                        ...channel,
                    }
                    : state.selectedChannel,
            };
        }
        case "UPDATE_UNREAD_CHAT_REPLIES": {
            return {
                ...state,
                selectedChannel: action.data.id === state.selectedChannel.id ? action.data : state.selectedChannel,
                channels: {
                    ...state.channels,
                    [action.data.id]: action.data,
                },
                unreadChatCount: state.unreadChatCount > 0 ? state.unreadChatCount - action.data.minus_count : state.unreadChatCount,
            };
        }
        case "ADD_CHAT_MESSAGE": {
            let channel = {...state.channels[action.data.channel_id]};
            channel = {
                ...channel,
                replies: [...channel.replies, action.data],
            };
            return {
                ...state,
                channels: {
                    ...state.channels,
                    [action.data.channel_id]: channel,
                },
                selectedChannel: state.selectedChannel.id === action.data.channel_id ?
                    {
                        ...state.selectedChannel,
                        replies: [...state.selectedChannel.replies, action.data],
                    }
                    : state.selectedChannel,
            };
        }
        case "INCOMING_CHAT_MESSAGE": {
            let haveReference = false;
            if (state.selectedChannel && state.selectedChannel.id === action.data.reply.channel_id) {
                state.selectedChannel.replies.forEach(rep => {
                    if (rep.reference_id === action.data.reply.reference_id) {
                        haveReference = true;

                    }
                });
            }
            let channel = null;
            if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.reply.channel_id)) {
                channel = {...state.channels[action.data.reply.channel_id]};
                channel = {
                    ...channel,
                    is_hidden: 0,
                    replies: haveReference ? channel.replies.map(r => {
                            if (r.id === action.data.reply.reference_id) {
                                return action.data.reply;
                            } else {
                                return r;
                            }
                        })
                        : [...channel.replies, action.data.reply],
                    last_visited_at_timestamp: getCurrentTimestamp(),
                    last_reply: action.data.last_reply,
                };
            }
            return {
                ...state,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.reply.channel_id ?
                    {
                        ...state.selectedChannel,
                        last_visited_at_timestamp: getCurrentTimestamp(),
                        last_reply: action.data.last_reply,
                        replies: haveReference ? state.selectedChannel.replies.map(r => {
                                if (r.id === action.data.reply.reference_id) {
                                    return action.data.reply;
                                } else {
                                    return r;
                                }
                            })
                            : [...state.selectedChannel.replies, action.data.reply],
                    }
                    : state.selectedChannel,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.reply.channel_id]: channel,
                    }
                    : state.channels,
            };
        }
        case "INCOMING_CHAT_MESSAGE_FROM_OTHERS": {
            let channel = null;
            if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.reply.channel_id)) {
                channel = {...state.channels[action.data.reply.channel_id]};
                channel = {
                    ...channel,
                    replies: [...channel.replies, action.data.reply],
                    is_hidden: 0,
                    last_reply: action.data.last_reply,
                    total_unread: state.selectedChannel && state.selectedChannel.id === action.data.reply.channel_id
                        ? channel.total_unread
                        : channel.total_unread + 1,
                };
            }
            return {
                ...state,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.reply.channel_id]: channel,
                    }
                    : state.channels,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.reply.channel_id ?
                    {
                        ...state.selectedChannel,
                        replies: [...state.selectedChannel.replies, action.data.reply],
                        last_reply: action.data.last_reply ? action.data.last_reply : state.selectedChannel.last_reply,
                    }
                    : state.selectedChannel,
            };
        }
        case "GENERATE_UNFURL_REDUCER": {
            if (action.data.channel_id) {
                let channel = null;
                if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
                    channel = {...state.channels[action.data.channel_id]};
                    channel = {
                        ...channel,
                        replies: channel.replies.map(r => {
                            if (r.id === action.data.message_id) {
                                return {
                                    ...r,
                                    unfurls: action.data.unfurls,
                                    unfurl_loading: false,
                                };
                            } else {
                                return r;
                            }
                        }),
                    };
                }
                return {
                    ...state,
                    selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id ?
                        {
                            ...state.selectedChannel,
                            replies: state.selectedChannel.replies.map(r => {
                                if (r.id === action.data.message_id) {
                                    return {
                                        ...r,
                                        unfurls: action.data.unfurls,
                                        unfurl_loading: false,
                                    };
                                } else {
                                    return r;
                                }
                            }),
                        }
                        : state.selectedChannel,
                    channels: channel !== null ?
                        {
                            ...state.channels,
                            [action.data.channel_id]: channel,
                        }
                        : state.channels,
                };
            } else {
                return state;
            }
        }
        case "INCOMING_ARCHIVED_CHANNEL": {
            let channel = null;
            if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
                channel = {...state.channels[action.data.channel_id]};
                channel = {
                    ...channel,
                    is_archived: action.data.status === "ARCHIVED" ? 1 : 0,
                };
            }
            return {
                ...state,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.channel_id]: channel,
                    }
                    : state.channels,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id ?
                    {
                        ...state.selectedChannel,
                        is_archived: action.data.status === "ARCHIVED" ? 1 : 0,
                    }
                    : state.selectedChannel,
            };
        }
        case "INCOMING_CHAT_MESSAGE_REACTION": {
            let channel = null;
            if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
                channel = {...state.channels[action.data.channel_id]};
                channel = {
                    ...channel,
                    replies: channel.replies.map(r => {
                        if (r.id === action.data.message_id) {
                            if (action.data.status === "CREATED") {
                                let reactions = r.reactions.filter(reaction => reaction.id !== action.data.id);
                                return Object.assign({}, r, {reactions: [...reactions, action.data]});
                            } else {
                                return Object.assign({}, r, {reactions: r.reactions.filter(reaction => reaction.id !== action.data.id)});
                            }
                        } else return r;
                    }),
                };
            }
            return {
                ...state,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.channel_id]: channel,
                    }
                    : state.channels,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id ?
                    {
                        ...channel,
                    }
                    : state.selectedChannel,
            };
        }
        case "SET_CHANNEL_HISTORICAL_POSITION": {
            let channelExists = false;
            if (state.historicalPositions.length) {
                state.historicalPositions.forEach(hp => {
                    if (hp.channel_id === action.data.channel_id) {
                        channelExists = true;

                    }
                });
                if (channelExists) {
                    return {
                        ...state,
                        historicalPositions: state.historicalPositions.map(h => {
                            if (h.channel_id === action.data.channel_id) {
                                return action.data;
                            } else return h;
                        }),
                    };
                } else {
                    return {
                        ...state,
                        historicalPositions: [...state.historicalPositions, action.data],
                    };
                }
            } else {
                return {
                    ...state,
                    historicalPositions: [action.data],
                };
            }
        }
        case "INCOMING_UPDATED_CHAT_MESSAGE": {
            let channel = null;
            if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
                channel = {...state.channels[action.data.channel_id]};
                channel = {
                    ...channel,
                    replies: channel.replies.map(r => {
                        if (r.id === action.data.message_id) {
                            return Object.assign({}, r, {
                                body: action.data.body,
                                mention_html: action.data.mention_html,
                                updated_at: action.data.updated_at,
                                unfurls: action.data.unfurls,
                            });
                        } else return r;
                    }),
                    last_reply: channel.last_reply && channel.last_reply.id === action.data.message_id ? {
                        ...channel.last_reply,
                        body: action.data.body,
                    } : channel.last_reply,
                };
            }
            return {
                ...state,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.channel_id]: channel,
                    }
                    : state.channels,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id ?
                    {
                        ...channel,
                    }
                    : state.selectedChannel,
            };
        }
        case "SET_EDIT_CHAT_MESSAGE": {
            return {
                ...state,
                editChatMessage: action.data,
            };
        }
        case "INCOMING_DELETED_CHAT_MESSAGE": {
            let channel = null;
            if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
                channel = {...state.channels[action.data.channel_id]};
                channel = {
                    ...channel,
                    replies: channel.replies.map(r => {
                        if (r.id === action.data.message_id) {
                            return {
                                ...r,
                                is_deleted: 1,
                                body: "CHAT_MESSAGE_DELETED",
                                files: [],
                            };
                        } else {
                            return r;
                        }
                    }),
                    last_reply: channel.last_reply.id === action.data.message_id ? {
                        ...channel.last_reply,
                        body: "The chat message has been deleted",
                        is_deleted: true,
                    } : channel.last_reply,
                };
            }
            return {
                ...state,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.channel_id]: channel,
                    }
                    : state.channels,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id ?
                    {
                        ...channel,
                    }
                    : state.selectedChannel,
            };
        }
        case "ON_CLICK_SEND_BUTTON": {
            return {
                ...state,
                sendButtonClicked: action.data,
            };
        }
        case "ADD_QUOTE": {
            let updatedQuotes = state.chatQuotes;
            if (Object.keys(state.chatQuotes).length > 0 && state.chatQuotes.hasOwnProperty(action.data.channel_id)) {
                updatedQuotes = {...state.chatQuotes};
                delete updatedQuotes[action.data.channel_id];
                updatedQuotes = {
                    ...updatedQuotes,
                    [action.data.channel_id]: action.data,
                };
            } else {
                updatedQuotes = {
                    ...state.chatQuotes,
                    [action.data.channel_id]: action.data,
                };
            }
            return {
                ...state,
                chatQuotes: updatedQuotes,
            };
        }
        case "CLEAR_QUOTE": {
            let updatedQuotes = {...state.chatQuotes};
            delete updatedQuotes[action.data.channel_id];

            return {
                ...state,
                chatQuotes: updatedQuotes,
            };
        }
        case "ADD_TO_CHANNEL_DRAFTS": {
            let updatedChannelDrafts = state.channelDrafts;
            if (Object.keys(state.channelDrafts).length > 0 && state.channelDrafts.hasOwnProperty(action.data.channel_id)) {
                updatedChannelDrafts = {...state.channelDrafts};
                delete updatedChannelDrafts[action.data.channel_id];
                updatedChannelDrafts = {
                    ...updatedChannelDrafts,
                    [action.data.channel_id]: action.data,
                };
            } else {
                updatedChannelDrafts = {
                    ...updatedChannelDrafts,
                    [action.data.channel_id]: action.data,
                };
            }
            return {
                ...state,
                channelDrafts: updatedChannelDrafts,
            };
        }
        case "CLEAR_CHANNEL_DRAFT": {
            let updatedChannelDrafts = {...state.channelDrafts};
            delete updatedChannelDrafts[action.data.channel_id];

            return {
                ...state,
                channelDrafts: updatedChannelDrafts,
            };
        }
        case "GET_CHANNEL_DRAFTS_SUCCESS": {
            let channelDrafts = state.channelDrafts;
            action.data
                .filter(item => {
                    return item.data.type === "channel";
                })
                .forEach((item, index) => {
                    channelDrafts[item.data.channel_id] = {
                        ...item.data,
                        draft_id: item.id,
                    };
                });
            return {
                ...state,
                channelDrafts: channelDrafts,
            };
        }
        case "INCOMING_UPDATED_CHANNEL_DETAIL": {
            let channel = null;
            if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.id)) {
                channel = {...state.channels[action.data.id]};
                channel = {
                    ...channel,
                    members: action.data.members,
                    title: action.data.title,
                    replies: [...channel.replies, action.data.message],
                };
            }
            return {
                ...state,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.id]: channel,
                    }
                    : state.channels,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.id ?
                    {
                        ...channel,
                    }
                    : state.selectedChannel,
            };
        }
        case "ADD_USER_TO_REDUCERS": {
            return {
                ...state,
                user: action.data,
            };
        }
        case "UPDATE_CHAT_MESSAGE_REMINDER_COMPLETE": {
            let channel = null;
            if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
                channel = {...state.channels[action.data.channel_id]};
                channel = {
                    ...channel,
                    replies: channel.replies.map(r => {
                        if (r.id === action.data.message_id) {
                            if (r.original_body)
                                r.body = r.original_body;

                            const channelName = r.body.replace(r.body.substr(0, r.body.search(" in ") + 4, r.body), "");
                            r.body = r.body.replace(` in ${channelName}`, ` in <a class="push" data-href="/chat/${r.quote.channel_code}">#${channelName}</a>`);

                            const link = `/chat/${r.quote.channel_code}/${r.quote.code}`;
                            r.body = r.body.replace("this message", `<a class="push" data-href="${link}">this message</a>`);

                            r.body = `<span class="completed">${r.body}</span><br/> ${r.original_body.replace("You asked me to remind you", "OK! I’ve marked the reminder")} as complete.`;
                            return r;
                        } else return r;
                    }),
                };
            }
            return {
                ...state,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.channel_id]: channel,
                    }
                    : state.channels,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id ?
                    {
                        ...channel,
                    }
                    : state.selectedChannel,
            };
        }
        case "UPDATE_CHANNEL_MEMBERS_TITLE": {
            let channel = null;
            if (Object.keys(state.channels).length > 0 && state.channels.hasOwnProperty(action.data.channel_id)) {
                channel = {...state.channels[action.data.channel_id]};
                channel = {
                    ...channel,
                    members: action.data.members,
                    title: action.data.title,
                };
            }
            return {
                ...state,
                channels: channel !== null ?
                    {
                        ...state.channels,
                        [action.data.channel_id]: channel,
                    }
                    : state.channels,
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id ?
                    {
                        ...channel,
                    }
                    : state.selectedChannel,
            };
        }
        case "SAVE_LAST_VISITED_CHANNEL": {
            return {
                ...state,
                lastVisitedChannel: action.data,
            };
        }
        case "RESTORE_LAST_VISITED_CHANNEL": {
            let channel = {...state.channels[action.data.channel_id]};
            return {
                ...state,
                selectedChannel: channel,
            };
        }
        case "CLEAR_SELECTED_CHANNEL": {
            return {
                ...state,
                selectedChannel: null,
            };
        }
        case "JOIN_WORKSPACE_REDUCER": {
            let user = {
                id: action.data.user.id,
                name: action.data.user.name,
                first_name: action.data.user.first_name,
                profile_image_link: action.data.user.profile_image_link,
                partial_name: action.data.user.partial_name,
                last_visited_at: {
                    timestamp: Math.floor(Date.now() / 1000)
                }
            }
            let updatedChannels = {...state.channels};
            let channel = {...updatedChannels[action.data.channel_id]};
            channel = {
                ...channel,
                members: [...channel.members, user]
            }
            updatedChannels = {
                ...updatedChannels,
                [action.data.channel_id]: channel
            }
            return {
                ...state,
                selectedChannel: state.selectedChannel.id === action.data.channel_id ?
                {
                    ...state.selectedChannel,
                    members: [...state.selectedChannel.members, user]
                }
                : state.selectedChannel,
                channels: updatedChannels
            }
        }
        default:
            return state;
    }
}