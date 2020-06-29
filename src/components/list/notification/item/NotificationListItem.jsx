import React from "react";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import {Avatar} from "../../../common";
import {localizeChatChannelDate} from "../../../../helpers/momentFormatJS";
import {stripHtml} from "../../../../helpers/stringFormatter";

const Wrapper = styled.li`
    cursor: pointer;
    .avatar {
        margin-right: 1rem;
    }
    p {
        margin: 0;
    }
`;

export const NotificationListItem = props => {

    const { notification, actions } = props;
    const history = useHistory();

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

    const notifDisplay = () => {
        switch (notification.type) {
            case "POST_CREATE": {
                return (
                    <div className="flex-grow-1" onClick={handleRedirect}>
                        <p className="mb-0 line-height-20 d-flex justify-content-between">
                            sends you a post
                            {
                                notification.is_read === 0 ?
                                <i title="" data-toggle="tooltip" onClick={handleReadUnread}
                                    className="hide-show-toggler-item fa fa-circle-o font-size-11"
                                    data-original-title="Mark as read"></i>
                                :
                                <i title="" data-toggle="tooltip" onClick={handleReadUnread}
                                    className="hide-show-toggler-item fa fa-check font-size-11"
                                    data-original-title="Mark as unread"></i>
                            }
                        </p>
                        <p>
                            {notification.data.title}
                        </p>
                        <span className="text-muted small">{localizeChatChannelDate(notification.created_at.timestamp)}</span>
                    </div>
                )
            }
            case "POST_COMMENT": {
                return (
                    <div className="flex-grow-1" onClick={handleRedirect}>
                        <p className="mb-0 line-height-20 d-flex justify-content-between">
                            made a comment in {notification.data.title}
                            {
                                notification.is_read === 0 ?
                                <i title="" data-toggle="tooltip" onClick={handleReadUnread}
                                    className="hide-show-toggler-item fa fa-circle-o font-size-11"
                                    data-original-title="Mark as read"></i>
                                :
                                <i title="" data-toggle="tooltip" onClick={handleReadUnread}
                                    className="hide-show-toggler-item fa fa-check font-size-11"
                                    data-original-title="Mark as unread"></i>
                            }
                        </p>
                        <p>
                            {stripHtml(notification.data.comment_body)}
                        </p>
                        <span className="text-muted small">{localizeChatChannelDate(notification.created_at.timestamp)}</span>
                    </div>
                )
            }
            default:
                return null;
        }
    }
    return (
        <Wrapper>
            <a className="list-group-item d-flex hide-show-toggler">
                <div>
                    <Avatar
                        id={notification.author.id}
                        name={notification.author.name}
                        imageLink={notification.author.profile_image_link}
                    />
                </div>
                {notifDisplay()}
            </a>
        </Wrapper>
    )
};

export default NotificationListItem;