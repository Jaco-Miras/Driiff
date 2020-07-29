import React from "react";
import { ChannelSearchItem } from "./index";

const ChannelTabResults = (props) => {

    const { channels, page } = props;

    return (
        <ul className="list-group list-group-flush">
            {
                Object.values(channels).slice(page > 1 ? (page*10)-10 : 0, page*10).map((c) => {
                    return <ChannelSearchItem key={c.id} data={c.data}/>
                })
            }
        </ul>
    );
};

export default ChannelTabResults;