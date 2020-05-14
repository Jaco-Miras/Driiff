// import {uniqBy} from "lodash";
// import {getCurrentTimestamp} from "../../helpers/dateFormatter";
// import {localizeDate} from "../../helpers/momentFormatJS";
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
            let results = action.data.results.map(r => {
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
            return state;
            // return {
            //     ...state,
            //     activeChatChannels: state.activeChatChannels.map(ac => {
            //         if (action.data.selected) {
            //             if (ac.id === action.data.id) {
            //                 return action.data;
            //             } else {
            //                 // return Object.assign({}, ac, {selected: false})
            //                 return {
            //                     ...ac,
            //                     selected: false,
            //                 };
            //             }
            //         } else {
            //             if (ac.id === action.data.id) {
            //                 return action.data;
            //             } else {
            //                 // return Object.assign({}, ac, {selected: false})
            //                 return {
            //                     ...ac,
            //                     selected: false,
            //                 };
            //             }
            //         }
            //     }),
            //     //selectedChannel: state.selectedChannel
            //     selectedChannel: state.selectedChannel.id === action.data.id ? action.data : state.selectedChannel,
            // };
        }
        case "SET_SELECTED_CHANNEL": {
            let channel = action.data;

            if (channel.last_reply)
                channel.last_reply.body = channel.last_reply.body.replace(" in ", " in #");

            channel.original_title = channel.title;

            if (channel.original_title === "PERSONAL_BOT") {
                channel.type = "PERSONAL_BOT";
            }

            return {
                ...state,
                selectedChannel: action.data,
            };
        }
        default:
            return state;
    }
}