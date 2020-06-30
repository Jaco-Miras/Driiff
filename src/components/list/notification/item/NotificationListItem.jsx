import React from "react";
import styled from "styled-components";
import {localizeChatChannelDate} from "../../../../helpers/momentFormatJS";
import {Avatar} from "../../../common";

const Wrapper = styled.li`
    cursor: pointer;
    
    .notification-container {
        max-width: calc(100% - 60px);
    }
    .notification-title {
        overflow: hidden;
        display: block !important;
        text-overflow: ellipsis;
        width: calc(100% - 10px);
        white-space: nowrap;
        line-height: 1.1;
    }
    
    .list-group-item {
        border: none;
    }
    
    .avatar {
        margin-right: 1rem;
    }
    p {
        margin: 0;
    }
`;

export const NotificationListItem = props => {

    const {notification, actions, history} = props;

    const handleRedirect = e => {
        e.preventDefault();
    };

    const handleReadUnread = e => {
        e.preventDefault();
        e.stopPropagation();
        if (notification.is_read === 0) {
            actions.read({id: notification.id});
        } else {
            actions.unread({id: notification.id});
        }
    };

    const handleRemove = e => {
        e.preventDefault();
        e.stopPropagation();
        actions.remove({id: notification.id});
    };

    const notifDisplay = () => {
        switch (notification.type) {
            case "POST_CREATE": {
                return (
                    <div className="notification-container flex-grow-1" onClick={handleRedirect}>
                        <p className="notification-title text-link">
                            shared a post
                        </p>
                        <span
                            className="text-muted small">{localizeChatChannelDate(notification.created_at.timestamp)}</span>
                    </div>
                );
            }
            case "POST_COMMENT": {
                return (
                    <div className="notification-container flex-grow-1" onClick={handleRedirect}>
                        <p className="notification-title text-link">
                            made a comment in {notification.data.title}
                        </p>
                        <span
                            className="text-muted small">{localizeChatChannelDate(notification.created_at.timestamp)}</span>
                    </div>
                );
            }
            case "POST_MENTION": {
                return (
                    <div className="notification-container flex-grow-1" onClick={handleRedirect}>
                        <p className="notification-title text-link">
                            mentioned you in {notification.data.title}
                        </p>
                        <span
                            className="text-muted small">{localizeChatChannelDate(notification.created_at.timestamp)}</span>
                    </div>
                );
            }
            default:
                return null;
        }
    };
    return (
        <Wrapper>
            <span className="list-group-item d-flex hide-show-toggler">
                <div>
                    <Avatar
                        id={notification.author.id}
                        name={notification.author.name}
                        imageLink={notification.author.profile_image_link}
                    />
                </div>
                {notifDisplay()}
                <div style={{minWidth: "10px"}}>
                {
                    notification.is_read === 0 ?
                    <i title="" data-toggle="tooltip" onClick={handleReadUnread}
                       className="hide-show-toggler-item fa fa-circle-o font-size-11"
                       data-original-title="Mark as read"/>
                                               :
                    <i title="" data-toggle="tooltip" onClick={handleReadUnread}
                       className="hide-show-toggler-item fa fa-check font-size-11"
                       data-original-title="Mark as unread"></i>
                }
                </div>
            </span>
        </Wrapper>
    );
};

export default NotificationListItem;