import React from "react";
import {ChatSearchItem} from "./index";

const ChatTabResults = (props) => {

    const { chats, page, redirect } = props;
    
    return (
        <ul className="list-group list-group-flush">
            {
                Object.values(chats)
                  .slice(page > 1 ? (page * 10) - 10 : 0, page * 10)
                  .filter((c) => {
                      return c.data && c.data.message !== null;
                  })
                  .map((c) => {
                      return <ChatSearchItem key={c.id} data={c.data} redirect={redirect}/>
                  })
            }
        </ul>
    );
};

export default ChatTabResults;
