import {apiCall} from "../index";
import {objToUrlParams} from "../../../helpers/commonFunctions";

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