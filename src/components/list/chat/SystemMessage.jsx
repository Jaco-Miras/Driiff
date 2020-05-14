import React, {forwardRef, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {localizeDate} from "../../../helpers/momentFormatJS";

const SystemMessageContainer = styled.span`
    display: block;
`;

const SystemMessageContent = styled.span`
    display: block;

    .channel-title{
        font-weight: 600;
    }
    .channel-new-members{
        color: #007180;
        font-weight: 600;
    }
`;
const ChatTimeStamp = styled.div`
    // position: absolute;
    // left: ${props => props.isAuthor ? "5px" : "unset"};
    // right: ${props => props.isAuthor ? "unset" : "5px"};
    color: #676767;
    font-size: .75em;
    display: flex;
    flex-flow: ${props => props.isAuthor ? "row" : "row-reverse"};
    .reply-date{
        margin: ${props => props.isAuthor ? "0 10px 0 0" : "0 0 0 10px"};
    }
    .reply-date.updated{
        // -webkit-transition: all 0.2s ease-in-out;
        // -o-transition: all 0.2s ease-in-out;
        // transition: all 0.2s ease-in-out;
        >span:last-child{
            display: none;
        }
    }
    .reply-date.updated:hover{
        >span:first-child{
            display: none;
        }
        >span:last-child{
            display: block;
        }
    }
`;

const SystemMessage = forwardRef((props, ref) => {

    const {reply, selectedChannel, chatName} = props;
    const [body, setBody] = useState(reply.body);
    const recipients = useSelector(state => state.global.recipients.filter(r => r.type === "USER"));

    useEffect(() => {
        if (reply.body.includes("JOIN_CHANNEL")) {
            let ids = /\d+/g;
            let extractedIds = reply.body.match(ids);
            let newMembers = recipients.filter(r => {
                let userFound = false;
                extractedIds.forEach(id => {
                    if (parseInt(id) === r.type_id) {
                        userFound = true;
                    }
                });
                return userFound;
            }).map(user => user.name);
            if (selectedChannel.type === "DIRECT") {
                setBody(`<p><span class='channel-new-members'>${newMembers.join(", ")}</span><br> joined <span class='channel-title'>#${chatName}</span></p>`);
            } else {
                setBody(`<p><span class='channel-new-members'>${newMembers.join(", ")}</span><br> joined <span class='channel-title'>#${selectedChannel.title}</span></p>`);
            }
        } else if (reply.body.includes("MEMBER_REMOVE_CHANNEL")) {
            if (selectedChannel.type === "DIRECT") {
                setBody(`<p><span class='channel-new-members'>${reply.body.substr(reply.body.indexOf(" "))}</span><br> left <span class='channel-title'>#${chatName}</span></p>`);
            } else {
                setBody(`<p><span class='channel-new-members'>${reply.body.substr(reply.body.indexOf(" "))}</span><br> left <span class='channel-title'>#${selectedChannel.title}</span></p>`);
            }
        } else if (reply.body.includes("ACCOUNT_DEACTIVATED")) {
            let newBody = reply.body.replace("ACCOUNT_DEACTIVATED ", "");
            if (newBody[newBody.length - 1] === "s") {
                setBody(`Update: ${newBody}' account is deactivated.`);
            } else {
                setBody(`Update: ${newBody}'s account is deactivated.`);
            }
        } else if (reply.body.includes("NEW_ACCOUNT_ACTIVATED")) {
            let newBody = reply.body.replace("NEW_ACCOUNT_ACTIVATED ", "");
            if (newBody[newBody.length - 1] === "s") {
                setBody(`Update: ${newBody}' account is activated.`);
            } else {
                setBody(`Update: ${newBody}'s account is activated.`);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (reply.body.includes("JOIN_CHANNEL")) {
            let ids = /\d+/g;
            let extractedIds = reply.body.match(ids);
            let newMembers = recipients.filter(r => {
                let userFound = false;
                extractedIds.forEach(id => {
                    if (parseInt(id) === r.type_id) {
                        userFound = true;
                    }
                });
                return userFound;
            }).map(user => user.name);
            if (selectedChannel.type === "DIRECT") {
                setBody(`<p><span class='channel-new-members'>${newMembers.join(", ")}</span><br> joined <span class='channel-title'>#${chatName}</span></p>`);
            } else {
                setBody(`<p><span class='channel-new-members'>${newMembers.join(", ")}</span><br> joined <span class='channel-title'>#${selectedChannel.title}</span></p>`);
            }
        } else if (reply.body.includes("MEMBER_REMOVE_CHANNEL")) {
            if (selectedChannel.type === "DIRECT") {
                setBody(`<p><span class='channel-new-members'>${reply.body.substr(reply.body.indexOf(" "))}</span><br> left <span class='channel-title'>#${chatName}</span></p>`);
            } else {
                setBody(`<p><span class='channel-new-members'>${reply.body.substr(reply.body.indexOf(" "))}</span><br> left <span class='channel-title'>#${selectedChannel.title}</span></p>`);
            }
        } else if (reply.body.includes("ACCOUNT_DEACTIVATED")) {
            let newBody = reply.body.replace("ACCOUNT_DEACTIVATED ", "");
            if (newBody[newBody.length - 1] === "s") {
                setBody(`Update: ${newBody}' account is deactivated.`);
            } else {
                setBody(`Update: ${newBody}'s account is deactivated.`);
            }
        } else if (reply.body.includes("NEW_ACCOUNT_ACTIVATED")) {
            let newBody = reply.body.replace("NEW_ACCOUNT_ACTIVATED ", "");
            if (newBody[newBody.length - 1] === "s") {
                setBody(`Update: ${newBody}' account is activated.`);
            } else {
                setBody(`Update: ${newBody}'s account is activated.`);
            }
        }
    }, [recipients, recipients.length, chatName, reply.body, selectedChannel.title, selectedChannel.type]);

    return <SystemMessageContainer>
        <SystemMessageContent
            ref={ref}
            dangerouslySetInnerHTML={{__html: body}}>
        </SystemMessageContent>
        <ChatTimeStamp
            className='chat-timestamp'
            isAuthor={false}>
        <span className="reply-date created">
            {reply.created_at.diff_for_humans ? "sending..." : localizeDate(reply.created_at.timestamp, "HH:mm")}
        </span>
        </ChatTimeStamp>
    </SystemMessageContainer>;
});

export default React.memo(SystemMessage);