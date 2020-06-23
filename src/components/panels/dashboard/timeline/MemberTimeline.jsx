import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {todayOrYesterdayDate} from "../../../../helpers/momentFormatJS";
import {Avatar} from "../../../common";

const Wrapper = styled.div`
    font-weight: bold;
    .action-text {
        margin: 0;
        color: #505050;
        .joined {
            color: #00c851
            font-weight: bold;
        }
        .left {
            color: #f44;
            font-weight: bold;
        }
    }
`;

const MemberTimeline = (props) => {

    const {className = "", data} = props;

    const user = useSelector(state => state.session.user);
    const recipients = useSelector(state => state.global.recipients.filter(r => r.type === "USER"));

    let message = null;
    if (data.body.includes("CHANNEL_UPDATE")) {
        message = JSON.parse(data.body.replace("CHANNEL_UPDATE::", ""));
    }

    const renderTitle = () => {
        if (message.title !== "") {
            return `Updated workspace to ${message.title}`;
        }
        if (message.added_members.length !== 0 || message.removed_members.length) {
        }
    };

    const renderAddedMembers = (joined = false) => {
        if (joined) {
            let author = recipients.filter(r => r.type_id === message.author.id && message.added_members.includes(r.type_id))[0];
            if (author) {
                if (author.type_id === user.id) {
                    return `You joined.`;
                } else {
                    return `${author.name} has joined`;
                }
            }
        } else {
            let members = recipients.filter(r => message.added_members.includes(r.type_id) && r.type_id !== message.author.id).map(r => r.name);
            if (members.length) {
                return members.join(", ") + " is added.";
            }
        }
    };

    const renderRemovedMembers = (left = false) => {
        if (left) {
            let author = recipients.filter(r => r.type_id === message.author.id && message.removed_members.includes(r.type_id))[0];
            if (author) {
                if (author.left === user.id) {
                    return `You left.`;
                } else {
                    return `${author.name} has left`;
                }
            }
        } else {
            let members = recipients.filter(r => message.removed_members.includes(r.type_id) && r.type_id !== message.author.id).map(r => r.name);
            if (members.length) {
                return members.join(", ") + " is removed.";
            }
        }
    };

    if (message === null)
        return null;

    return (
        <Wrapper className={`member-timeline timeline-item ${className}`}>
            <div>
                {
                    <Avatar className="mr-3" name={message.author.name} imageLink={message.author.profile_image_link}/>
                }
            </div>
            <div>
                <h6 className="d-flex justify-content-between mb-4">
                <   span className="title">
                        {message.author.name} {renderTitle()}
                    </span>
                    <span
                        className="text-muted font-weight-normal">{todayOrYesterdayDate(data.created_at.timestamp)}</span>
                </h6>
                {
                    message.added_members.length || message.removed_members.length ?
                    <div className="mb-3 border p-3 border-radius-1">
                        <p className="action-text">
                            {
                                message.added_members.length > 0 &&
                                renderAddedMembers(true)
                            }
                        </p>
                        <p className="action-text">
                            {
                                message.added_members.length > 0 &&
                                renderAddedMembers()
                            }
                        </p>
                        <p className="action-text">
                            {
                                message.removed_members.length > 0 &&
                                renderRemovedMembers(true)
                            }
                        </p>
                        <p className="action-text">
                            {
                                message.removed_members.length > 0 &&
                                renderRemovedMembers()
                            }
                        </p>
                    </div>
                                                                                   : null
                }
            </div>
        </Wrapper>
    );
};

export default React.memo(MemberTimeline);