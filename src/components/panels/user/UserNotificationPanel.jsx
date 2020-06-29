import React from "react";
import styled from "styled-components";
import {useNotifications, useNotificationActions} from "../../hooks";
import {NotificationLists} from "../../list/notification/item";

const Wrapper = styled.div`    
`;

const UserNotificationPanel = (props) => {

    const {className = ""} = props;

    const actions = useNotificationActions();
    const {notifications} = useNotifications();

    return (
        <Wrapper className={`user-profile-panel container-fluid h-100 ${className}`}>
            <div className="row row-user-profile-panel">
                <div className="col-md-6">
                    <div className="card">
                        <h6>Notifications</h6>
                        {
                            Object.keys(notifications).length > 0 &&
                            <div>
                                <span className="mr-2" onClick={actions.readAll}>Mark all as read</span>
                                {/* <span onClick={actions.removeAll}>Remove all</span> */}
                            </div>
                        }
                        
                        <NotificationLists notifications={notifications} actions={actions}/>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(UserNotificationPanel);