import React from "react";

const ChannelSearchItem = (props) => {

    const { data, redirect } = props;
    const { channel } = data;
    const handleRedirect = () => {
        redirect.toChannel(channel);
    };
    return (
        <li className="list-group-item p-l-0 p-r-0">
            <h5 onClick={handleRedirect}>{channel.title}</h5>
        </li>
    );
};

export default ChannelSearchItem;