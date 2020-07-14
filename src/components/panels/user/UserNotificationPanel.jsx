import React from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {useNotificationActions, useNotifications} from "../../hooks";
import {NotificationTimelineItem} from "../../list/notification/item";
import {SvgEmptyState} from "../../common";

const Wrapper = styled.div`
  .empty-notification {
    h4 {
      margin: 2rem auto;
      text-align: center;    
      color: #972C86
    }
  }
`;

const UserNotificationPanel = (props) => {
  const {className = ""} = props;

  const history = useHistory();
  const actions = useNotificationActions();
  const {notifications} = useNotifications();


  const newNotifications = Object.values(notifications)
      .filter((n) => n.is_read === 0)
      .sort((a, b) => b.created_at.timestamp - a.created_at.timestamp);

  const oldNotifications = Object.values(notifications)
      .filter((n) => n.is_read === 1)
      .sort((a, b) => b.created_at.timestamp - a.created_at.timestamp);

  return (
      <Wrapper className={`user-profile-panel container-fluid h-100 ${className}`}>
        <div className="row row-user-profile-panel justify-content-center">
          <div className="col-md-6">
            {
              newNotifications.length > 0 && (
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title d-flex justify-content-between align-items-center">
                        <div>New</div>
                        <div>
                    <span className="cursor-pointer" onClick={actions.readAll}>
                      <i className="hide-show-toggler-item fa fa-check font-size-16 mr-2"/>
                      Mark all as read
                    </span>
                        </div>
                      </h6>
                      <div className="timeline">
                        {newNotifications.map((n) => {
                          return <NotificationTimelineItem key={n.id} notification={n} actions={actions}
                                                           history={history}/>;
                        })}
                      </div>
                    </div>
                  </div>
              )
            }
            {oldNotifications.length > 0 && (
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title d-flex justify-content-between align-items-center">
                      <div>Old Notifications</div>
                      <div>
                    <span className="cursor-pointer" onClick={actions.readAll}>
                      <i className="hide-show-toggler-item fa fa-check font-size-16 mr-2"/>
                      Mark all as unread
                    </span>
                      </div>
                    </h6>
                    <div className="timeline">
                      {oldNotifications.map((n) => {
                        return <NotificationTimelineItem key={n.id} notification={n} actions={actions}
                                                         history={history}/>;
                      })}
                    </div>
                  </div>
                </div>
            )}
            {
              newNotifications.length === 0 && oldNotifications.length === 0 &&
              <div className="card empty-notification">
                <h4>There are no notifications to show.</h4>
                <div className="card-body d-flex justify-content-center align-items-center">
                  <SvgEmptyState icon={1} height={330}/>
                </div>
              </div>
            }
          </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(UserNotificationPanel);
