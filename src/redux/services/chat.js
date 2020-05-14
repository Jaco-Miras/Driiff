import {apiCall} from "./index";
import {objToUrlParams} from "../../helpers/commonFunctions";

export function getChannels(payload) {
    payload = {
        order_by: "channel_name",
        sort_by: "desc",
        ...payload,
    };

    if (payload.order_by === "channel_date_updated") {
        payload = {
            ...payload,
            order_by: "updated_at",
        };
    }

    return apiCall({
        method: "GET",
        url: `/v2/post-channels?${objToUrlParams(payload)}`,
    });
}

export function updateChannel(payload) {
    let url = `/v2/post-channels/${payload.id}`;
    return apiCall({
        method: "PUT",
        url: url,
        data: payload,
        is_shared: payload.is_shared ? true : false,
    });
}

export function markReadChannel(payload) {
    return apiCall({
        method: "PUT",
        url: `/v2/read-notification-counter/all-chat?channel_id=${payload.channel_id}`,
        data: payload,
        is_shared: payload.is_shared ? true : false,
    });
}

export function markUnreadChannel(payload) {
    return apiCall({
        method: "PUT",
        url: `/v2/unread-notification-counter/all-chat?channel_id=${payload.channel_id}`,
        data: payload,
        is_shared: payload.is_shared ? true : false,
    });
}

export function getChannel(payload) {
    let url = `/v2/post-channels/${payload.channel_id}`;
    return apiCall({
        method: "GET",
        url: url,
    });
}

export function getLastVisitedChannel(payload) {
    let url = `/v2/last-visit-channel`;
    return apiCall({
        method: "GET",
        url,
    });
}