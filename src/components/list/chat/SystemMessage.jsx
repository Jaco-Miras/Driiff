import React, {forwardRef, useEffect, useState} from "react";
import {renderToString} from "react-dom/server";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {localizeDate} from "../../../helpers/momentFormatJS";
import {SvgIconFeather} from "../../common";

const SystemMessageContainer = styled.span`
    display: block;
`;

const SystemMessageContent = styled.span`
    display: block;
`;
const ChatTimeStamp = styled.div`
    color: #a7abc3;
    font-style: italic;
    font-size: 11px;
    position: absolute;
    top: 0;
    left: calc(100% + 10px);
    display: flex;
    height: 100%;
    align-items: center;
    white-space: nowrap;
    ${"" /* display: none; */}
`;

const SystemMessage = forwardRef((props, ref) => {

    const {reply, selectedChannel, chatName} = props;
    const [body, setBody] = useState(reply.body);

    const user = useSelector(state => state.session.user);
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
        } else if (reply.body.includes("CHANNEL_UPDATE::")) {
            const data = JSON.parse(reply.body.replace("CHANNEL_UPDATE::", ""));

            let author = recipients.find(r => r.type_id === data.author.id);
            if (author) {
                if (data.author.id === user.id) {
                    author.name = "You";
                }
            } else {
                author = {
                    name: "Someone",
                };
            }

            let newBody = "";
            if (data.title !== "") {
                newBody = <><SvgIconFeather width={16} icon="edit-3"/> {author.name} renamed this chat
                    to <b>#{data.title}</b><br/></>;
            }

            if (data.added_members.includes(user.id) && data.added_members.length >= 1) {
                const am = recipients.filter(r => data.added_members.includes(r.type_id) && r.type_id !== user.id)
                    .map(r => r.name);

                if (data.author.id === user.id) {
                    if (newBody === "") {
                        newBody = <><b>{author.name}</b> joined </>;
                    } else {
                        newBody = <>{newBody} and joined</>;
                    }

                    if (am.length !== 0) {
                        newBody = <>{newBody} and added <b>{am.join(", ")}</b><br/></>;
                    }
                } else {
                    if (newBody === "") {
                        newBody = <>{author.name} added </>;
                    } else {
                        newBody = <>{newBody} and added</>;
                    }

                    if (data.added_members.includes(user.id)) {
                        if (am.length !== 0) {
                            newBody = <>{newBody} <b>You and </b></>;
                        } else {
                            newBody = <>{newBody} <b>You</b></>;
                        }
                    }

                    if (am.length !== 0) {
                        newBody = <>{newBody} <b>{am.join(", ")}</b><br/></>;
                    }
                }
            }

            if (data.removed_members.length >= 1) {
                const rm = recipients.filter(r => data.removed_members.includes(r.type_id) && r.type_id !== user.id)
                    .map(r => r.name);

                if (data.removed_members.includes(user.id) && data.author.id === user.id) {
                    if (newBody === "") {
                        newBody = <><b>{author.name}</b> left </>;
                    } else {
                        newBody = <>{newBody} and left</>;
                    }

                    if (rm.length !== 0) {
                        newBody = <>{newBody} and removed <b>{rm.join(", ")}</b><br/></>;
                    }
                } else {
                    if (newBody === "") {
                        newBody = <>{author.name} removed </>;
                    } else {
                        newBody = <>{newBody} and removed</>;
                    }

                    if (data.removed_members.includes(user.id)) {
                        if (rm.length !== 0) {
                            newBody = <>{newBody} <b>You and </b></>;
                        } else {
                            newBody = <>{newBody} <b>You</b></>;
                        }
                    }

                    if (rm.length !== 0) {
                        newBody = <>{newBody} <b>{rm.join(", ")}</b><br/></>;
                    }
                }
            }

            setBody(renderToString(newBody));
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
        } else if (reply.body.includes("CHANNEL_UPDATE::")) {
            const data = JSON.parse(reply.body.replace("CHANNEL_UPDATE::", ""));

            let author = recipients.find(r => r.type_id === data.author.id);
            if (author) {
                if (data.author.id === user.id) {
                    author.name = "You";
                }
            } else {
                author = {
                    name: "Someone",
                };
            }

            let newBody = "";
            if (data.title !== "") {
                newBody = <><SvgIconFeather width={16} icon="edit-3"/> {author.name} renamed this chat
                    to <b>#{data.title}</b><br/></>;
            }

            if (data.added_members.length >= 1) {
                const am = recipients.filter(r => data.added_members.includes(r.type_id) && r.type_id !== user.id)
                    .map(r => r.name);

                if (data.added_members.includes(user.id) && data.author.id === user.id) {
                    if (newBody === "") {
                        newBody = <><b>{author.name}</b> joined </>;
                    } else {
                        newBody = <>{newBody} and joined</>;
                    }

                    if (am.length !== 0) {
                        newBody = <>{newBody} and added <b>{am.join(", ")}</b><br/></>;
                    }
                } else {
                    if (newBody === "") {
                        newBody = <>{author.name} added </>;
                    } else {
                        newBody = <>{newBody} and added</>;
                    }

                    if (data.added_members.includes(user.id)) {
                        if (am.length !== 0) {
                            newBody = <>{newBody} <b>You and </b></>;
                        } else {
                            newBody = <>{newBody} <b>You</b></>;
                        }
                    }

                    if (am.length !== 0) {
                        newBody = <>{newBody} <b>{am.join(", ")}</b><br/></>;
                    }
                }
            }

            if (data.removed_members.length >= 1) {
                const rm = recipients.filter(r => data.removed_members.includes(r.type_id) && r.type_id !== user.id)
                    .map(r => r.name);

                if (data.removed_members.includes(user.id) && data.author.id === user.id) {
                    if (newBody === "") {
                        newBody = <><b>{author.name}</b> left </>;
                    } else {
                        newBody = <>{newBody} and left</>;
                    }

                    if (rm.length !== 0) {
                        newBody = <>{newBody} and removed <b>{rm.join(", ")}</b><br/></>;
                    }
                } else {
                    if (newBody === "") {
                        newBody = <>{author.name} removed </>;
                    } else {
                        newBody = <>{newBody} and removed</>;
                    }

                    if (data.removed_members.includes(user.id)) {
                        if (rm.length !== 0) {
                            newBody = <>{newBody} <b>You and </b></>;
                        } else {
                            newBody = <>{newBody} <b>You</b></>;
                        }
                    }

                    if (rm.length !== 0) {
                        newBody = <>{newBody} <b>{rm.join(", ")}</b><br/></>;
                    }
                }
            }

            setBody(renderToString(newBody));
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