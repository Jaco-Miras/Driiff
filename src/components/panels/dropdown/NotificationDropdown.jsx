import React from "react";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import {NotificationLists} from "../../list/notification/item";
import {useNotifications, useNotificationActions} from "../../hooks";

const Wrapper = styled.div`
`;

const NotificationDropdown = (props) => {

    const {className = ""} = props;
    const history = useHistory();
    const actions = useNotificationActions();
    const {notifications, unreadCount} = useNotifications(actions);

    const markAllRead = () => {
        actions.readAll({});
    };

    const viewAll = () => {
        history.push(`/notifications`);
    };

    return (
        <Wrapper className={`dropdown-menu dropdown-menu-right dropdown-menu-big notification-drop-down ${className}`}
                 styles="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-252px, 38px, 0px);">
                <div className="p-4 text-center d-flex justify-content-between" data-backround-image="assets/media/image/image1.jpg"
                     styles="background: rgba(0, 0, 0, 0) url(&quot;assets/media/image/image1.jpg&quot;) repeat scroll 0% 0%;">
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
                            <a onClick={viewAll}>View all</a>
                            <a className="ml-auto" onClick={markAllRead}>Mark all read</a>
                        </li>
                    </ul>
                </div>
                {/*<div id="ascrail2003" className="nicescroll-rails nicescroll-rails-vr"
                     styles="width: 8px; z-index: 1000; cursor: default; position: absolute; top: 65.8px; left: 292px; height: 296.7px; display: none; opacity: 0;">
                    <div
                        styles="position: relative; top: 0px; float: right; width: 6px; height: 0px; background-color: rgb(66, 66, 66); border: 1px solid rgb(255, 255, 255); background-clip: padding-box; border-radius: 5px;"
                        className="nicescroll-cursors"></div>
                </div>
                <div id="ascrail2003-hr" className="nicescroll-rails nicescroll-rails-hr"
                     styles="height: 8px; z-index: 1000; top: 354.5px; left: 0px; position: absolute; cursor: default; display: none; opacity: 0;">
                    <div
                        styles="position: absolute; top: 0px; height: 6px; width: 0px; background-color: rgb(66, 66, 66); border: 1px solid rgb(255, 255, 255); background-clip: padding-box; border-radius: 5px; left: 0px;"
                        className="nicescroll-cursors"></div>
                </div>*/}
        </Wrapper>
    );
};

export default React.memo(NotificationDropdown);