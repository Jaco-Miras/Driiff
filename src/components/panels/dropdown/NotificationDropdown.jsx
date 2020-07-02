import React, {useCallback, useRef} from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {useNotificationActions, useNotifications} from "../../hooks";
import {NotificationLists} from "../../list/notification/item";

const Wrapper = styled.div`
    .text-link {
        color: #828282;
        cursor: hand;
        cursor: pointer;
        
        &:hover {
            color: #000;
        }
    }

    .notification-title-wrapper {
        background: #7a1b8b;
        color: #fff;        
    }
`;

const NotificationDropdown = (props) => {

    const {className = ""} = props;
    const history = useHistory();
    const actions = useNotificationActions();
    const {notifications, unreadCount} = useNotifications(actions);

    const refs = {
        container: useRef(null),
    };

    const markAllRead = () => {
        actions.readAll({});
    };

    const viewAll = useCallback(() => {

        refs.container.current.classList.remove("show");
        history.push(`/notifications`);
    }, []);

    return (
        <Wrapper
            ref={refs.container}
            className={`dropdown-menu dropdown-menu-right dropdown-menu-big notification-drop-down ${className}`}
            styles="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-252px, 38px, 0px);">
            <div className="notification-title-wrapper p-4 text-center d-flex justify-content-between">
                <h6 className="mb-0">Notifications</h6>
                {
                    unreadCount > 0 &&
                    <small className="font-size-11 opacity-7">{unreadCount} unread notifications</small>
                }
            </div>
            <div>
                <NotificationLists notifications={notifications} actions={actions} history={history}/>
            </div>
            <div className="p-2 text-right">
                <ul className="list-inline small">
                    <li className="list-inline-item d-flex">
                        <span className="cursor-pointer text-link" onClick={viewAll}>View all</span>
                        <span className="cursor-pointer ml-auto text-link" onClick={markAllRead}>Mark all read</span>
                    </li>
                </ul>
            </div>
        </Wrapper>
    );
};

export default React.memo(NotificationDropdown);