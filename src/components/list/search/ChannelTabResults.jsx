import React from "react";
import { ChannelSearchItem } from "./index";

const ChannelTabResults = (props) => {

    const { channels } = props;

    return (
        <ul className="list-group list-group-flush">
            {
                Object.values(channels).map((c) => {
                    return <ChannelSearchItem key={c.id} data={c.data}/>
                })
            }
        </ul>
    );
};

export default ChannelTabResults;