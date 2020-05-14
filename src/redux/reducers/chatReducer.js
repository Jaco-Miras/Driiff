// import {uniqBy} from "lodash";
// import {getCurrentTimestamp} from "../../helpers/dateFormatter";
import {localizeDate} from "../../helpers/momentFormatJS";
import {convertArrayToObject} from '../../helpers/arrayHelper';

/** Initial State  */
const INITIAL_STATE = {
    user: {},
    channels: {},
    selectedChannel: null,
    startNewChannels: {},
    channelDrafts: []
};

export default function (state = INITIAL_STATE, action) {

    switch (action.type) {
        case "GET_CHANNELS_SUCCESS": {
            let results = action.data.results.filter(r => {
                if (state.selectedChannel && state.selectedChannel.id === r.id) return false
                else return true
            }).map(r => {
                return {
                    ...r,
                    hasMore: true,
                    skip: 0,
                    replies: [],
                    selected: false
                }
            })
            return {
                ...state,
                channels: {
                    ...state.channels, 
                    ...convertArrayToObject(results, "id")
                }
            }
        }
        case "UPDATE_CHANNEL_REDUCER": {
            return {
                ...state,
                channels: {
                    ...state.channels,
                    [action.data.id]: action.data
                },
                selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.id ? action.data : state.selectedChannel,
            };
        }
        case "SET_SELECTED_CHANNEL": {
            let channel = action.data;

            if (channel.last_reply)
                channel.last_reply.body = channel.last_reply.body.replace(" in ", " in #");

            channel.original_title = channel.title;

            if (channel.original_title === "PERSONAL_BOT") {
                channel.type = "PERSONAL_BOT";
            }

            let updatedChannels = { ...state.channels }
            if (state.selectedChannel) {
                updatedChannels[state.selectedChannel.id].selected = false
                updatedChannels[action.data.id].selected = true
            }
            
            return {
                ...state,
                selectedChannel: action.data,
                channels: updatedChannels
            };
        }
        case "UPDATE_MEMBER_TIMESTAMP": {
            let channel = state.channels[action.data.channel_id]
            if (typeof channel !== 'undefined') {
                return {
                    ...state,
                    selectedChannel: state.selectedChannel && state.selectedChannel.id === action.data.channel_id 
                        ? {
                            ...state.selectedChannel,
                            is_read: 1,
                            members: state.selectedChannel.members.map(m => {
                                if (m.id === action.data.member_id) {
                                    return {
                                        ...m,
                                        last_visited_at: {
                                            timestamp: action.data.timestamp + 3,
                                        },
                                    };
                                } else return m;
                            }),
                            }
                        : state.selectedChannel,
                    channels: {
                        ...state.channels,
                        [action.data.channel_id]: {
                            ...channel,
                            is_read: 1,
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
                        }
                    }
                }
            } else {
                return state
            }
        }
        case "ADD_TO_CHANNELS": {
            
            return {
                ...state,
                channels: {
                    ...state.channels,
                    [action.data.id]: action.data
                }
            };
        }
        case "GET_CHAT_MESSAGES_SUCCESS": {
            return {
                ...state,
                // activeChatChannels: state.activeChatChannels.map(ac => {
                //     if (ac.id === action.data.channel_id) {
                //         return {
                //             ...ac,
                //             read_only: action.data.read_only,
                //             replies: uniqBy([...action.data.results.map(r => {
                //                 if (ac.type === "PERSONAL_BOT" && r.body.search(/You asked me to remind you about/) > -1) {
                //                     r.original_body = r.body;

                //                     const channelName = r.body.replace(r.body.substr(0, r.body.search(" in ") + 4, r.body), "");
                //                     r.body = r.body.replace(` in ${channelName}`, ` in <a data-href="/chat/${r.quote.channel_code}">#${channelName}</a>`);

                //                     const link = `/chat/${r.quote.channel_code}/${r.quote.code}`;
                //                     r.body = r.body.replace("this message", `<a class="push" data-href="${link}">this message</a>`);

                //                     if (r.is_completed === true) {
                //                         r.body = `<span class="completed">${r.body}</span><br/> ${r.original_body.replace("You asked me to remind you", "OK! I’ve marked the reminder")} as complete.`;
                //                     } else {
                //                         r.body = `${r.body}<br/> <span class="action"><a class="btn btn-complete btn-action" data-message_id="${r.id}">Mark as Complete</a> <a class="btn btn-delete btn-action" data-message_id="${r.id}">Delete</a></span>`;
                //                     }
                //                 }

                //                 return {
                //                     ...r,
                //                     is_read: true,
                //                     channel_id: action.data.channel_id,
                //                     g_date: localizeDate(r.created_at.timestamp, "YYYY-MM-DD"),
                //                 };
                //             }), ...ac.replies], "id"),
                //             hasMore: action.data.results.length === 20,
                //             skip: ac.skip === 0 && ac.replies.length ?
                //                 ac.replies.length + 20 : ac.skip + 20,
                //         };
                //     } else return ac;
                // }),
                selectedChannel: {
                    ...state.selectedChannel,
                    read_only: action.data.read_only,
                    replies: action.data.channel_id === state.selectedChannel.id ?
                        [...action.data.results.map(r => {
                            if (action.data.type === "PERSONAL_BOT" && r.body.search(/You asked me to remind you about/) > -1) {
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
                        }), ...state.selectedChannel.replies]
                        : state.selectedChannel.replies,
                    hasMore: action.data.results.length === 20,
                    skip: state.selectedChannel.skip === 0 && state.selectedChannel.replies.length ?
                        state.selectedChannel.replies.length + 20 : state.selectedChannel.skip + 20,
                },
            };
        }
        default:
            return state;
    }
}