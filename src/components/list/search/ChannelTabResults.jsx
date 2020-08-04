import React from "react";
import { ChannelSearchItem } from "./index";

const ChannelTabResults = (props) => {

    const { channels, page, redirect } = props;

    return (
        <ul className="list-group list-group-flush">
            {
                Object.values(channels).slice(page > 1 ? (page*10)-10 : 0, page*10).map((c) => {
                    if (c.data) {
                        return <ChannelSearchItem key={c.id} data={c.data} redirect={redirect}/>
                    } else {
                        return null
                    }
                })
            }
        </ul>
    );
};

export default ChannelTabResults;