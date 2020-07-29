import React from "react";
import { ChatSearchItem } from "./index";

const ChatTabResults = (props) => {

    const { chats, page } = props;
    
    return (
        <ul className="list-group list-group-flush">
            {
                Object.values(chats).slice(page > 1 ? (page*10)-10 : 0, page*10).map((c) => {
                    return <ChatSearchItem key={c.id} data={c.data}/>
                })
            }
        </ul>
    );
};

export default ChatTabResults;