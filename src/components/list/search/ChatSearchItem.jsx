import React from "react";
import styled from "styled-components";
import { Avatar } from "../../common";

const Wrapper = styled.li`
    display: flex;
    width: 100%;
    p {
        margin: 0;
    }
`;

const ChatSearchItem = (props) => {

    const { data } = props;
    const { channel, message } = data;

    return (
        <Wrapper className="list-group-item p-l-0 p-r-0">
            <div>
                <Avatar id={message.user.id} name={message.user.name} imageLink={message.user.profile_image_link}/>
            </div>
            <div className="ml-2">
                <p>{message.user.name}</p>
                <p className="text-muted" dangerouslySetInnerHTML={{__html: message.body}}></p>
            </div>
        </Wrapper>
    );
};

export default ChatSearchItem;