import React from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {useNotificationActions, useNotifications} from "../../hooks";
import {NotificationTimelineItem} from "../../list/notification/item";

const Wrapper = styled.div`    
`;

const UserNotificationPanel = (props) => {

    const {className = ""} = props;

    const history = useHistory();
    const actions = useNotificationActions();
    const {notifications} = useNotifications();

    return (
        <Wrapper className={`user-profile-panel container-fluid h-100 ${className}`}>
            <div className="row row-user-profile-panel justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title d-flex justify-content-between align-items-center">
                                <div>
                                    Notifications
                                </div>
                                {
                                    Object.keys(notifications).length > 0 &&
                                    <div>
                                        <span className="cursor-pointer" onClick={actions.readAll}>
                                            <i className="hide-show-toggler-item fa fa-check font-size-16 mr-2"/>
                                            Mark all as read
                                        </span>
                                    </div>
                                }
                            </h6>
                            <div className="timeline">
                                {
                                    Object.values(notifications).map(n => {
                                        return <NotificationTimelineItem
                                            key={n.id} notification={n} actions={actions}
                                            history={history}/>;
                                    })

                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(UserNotificationPanel);