import {apiCall} from "./index";

export function getFiles(payload) {
    const { sort } = payload;
    let url = `/v1/files`;
    if (payload.sort) {
        url += `?sort=${sort}`;
    } else {
        url += `?sort=desc`;
    }

    return apiCall({
        method: "GET",
        url: url,
    });
}

export function getChannelFiles(payload) {
    let url = `/v2/post-message-files?channel_id=${payload.channel_id}&skip=${payload.skip}&limit=${payload.limit}`;
    return apiCall({
        method: "GET",
        url: url,
    });
}