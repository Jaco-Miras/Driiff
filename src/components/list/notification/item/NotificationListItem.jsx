import React from "react";
import styled from "styled-components";
import {localizeChatChannelDate} from "../../../../helpers/momentFormatJS";
import {replaceChar} from "../../../../helpers/stringFormatter";
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
    .info-tip {
        position: relative;
        
        &:hover {
            span {
                opacity: 1;
            }
        }        
        
        span {
            opacity: 0;
            text-align: center;
            position: absolute;            
            top: -30px;
            background: rgba(0,0,0,0.65);
            color: #fff;
            padding: 0.5rem;
            border-radius: 25px;
            font-size: 10px;            
            width: 95px;
            right: -20px;
            pointer-events: none;            
        }
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
        if (notification.is_read === 0) {
            actions.read({id: notification.id});
        }
        if (notification.data.workspaces) {
            let workspace = notification.data.workspaces[0];
            if (workspace.workspace_name) {
                history.push(`/workspace/posts/${workspace.workspace_id}/${replaceChar(workspace.workspace_name)}/${workspace.topic_id}/${replaceChar(workspace.topic_name)}/post/${notification.data.post_id}/${replaceChar(notification.data.title)}`);
            } else {
                history.push(`/workspace/posts/${workspace.topic_id}/${replaceChar(workspace.topic_name)}/post/${notification.data.post_id}/${replaceChar(notification.data.title)}`);
            }
        }
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
                    <i onClick={handleReadUnread}
                       className="info-tip hide-show-toggler-item fa fa-circle-o font-size-11">
                        <span>Mark as read</span>
                    </i>
                                               :
                    <i onClick={handleReadUnread}
                       className="info-tip hide-show-toggler-item fa fa-check font-size-11">
                        <span>Mark as unread</span>
                    </i>
                }
                </div>
            </span>
        </Wrapper>
    );
};

export default NotificationListItem;