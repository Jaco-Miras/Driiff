import React from "react";

const ChannelSearchItem = (props) => {

    const { data } = props;
    const { channel } = data;

    return (
        <li className="list-group-item p-l-0 p-r-0">
            <h5>{channel.title}</h5>
            <p className="text-muted">post body here</p>
        </li>
    );
};

export default ChannelSearchItem;