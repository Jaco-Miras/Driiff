import React from "react";
import styled from "styled-components";
import {NotificationListItem} from "./index";

const Wrapper = styled.ul`
    overflow: hidden;
`;

const NotificationLists = props => {

    const { notifications, actions } = props;

    if (Object.keys(notifications).length === 0) return null;

    return (
        <Wrapper className={`list-group list-group-flush`}>
            {
                Object.values(notifications).filter(n => n.is_read === 0).map(n => {
                    return <NotificationListItem key={n.id} notification={n} actions={actions}/>
                })
            }
            {
                Object.values(notifications).filter(n => n.is_read === 1).length > 0 &&
                <>
                    <li className="text-divider small pb-2 pl-3 pt-3">
                        <span>Old notifications</span>
                    </li>
                    {
                        Object.values(notifications).filter(n => n.is_read === 1).map(n => {
                            return <NotificationListItem key={n.id} notification={n} actions={actions}/>
                        })
                    }
                </>
            }
            {/* <li>
                <a href="#" className="list-group-item d-flex hide-show-toggler">
                    <div>
                        <figure className="avatar avatar-sm m-r-15">
                                    <span
                                        className="avatar-title bg-warning-bright text-warning rounded-circle">
                                        <i className="ti-package"></i>
                                    </span>
                        </figure>
                    </div>
                    <div className="flex-grow-1">
                        <p className="mb-0 line-height-20 d-flex justify-content-between">
                            New Order Recieved
                            <i title="" data-toggle="tooltip"
                                className="hide-show-toggler-item fa fa-check font-size-11"
                                data-original-title="Mark as unread"></i>
                        </p>
                        <span className="text-muted small">45 sec ago</span>
                    </div>
                </a>
            </li>
            <li>
                <a href="#" className="list-group-item d-flex align-items-center hide-show-toggler">
                    <div>
                        <figure className="avatar avatar-sm m-r-15">
                                    <span
                                        className="avatar-title bg-danger-bright text-danger rounded-circle">
                                        <i className="ti-server"></i>
                                    </span>
                        </figure>
                    </div>
                    <div className="flex-grow-1">
                        <p className="mb-0 line-height-20 d-flex justify-content-between">
                            Server Limit Reached!
                            <i title="" data-toggle="tooltip"
                                className="hide-show-toggler-item fa fa-check font-size-11"
                                data-original-title="Mark as unread"></i>
                        </p>
                        <span className="text-muted small">55 sec ago</span>
                    </div>
                </a>
            </li>
            <li>
                <a href="#" className="list-group-item d-flex align-items-center hide-show-toggler">
                    <div>
                        <figure className="avatar avatar-sm m-r-15">
                                    <span className="avatar-title bg-info-bright text-info rounded-circle">
                                        <i className="ti-layers"></i>
                                    </span>
                        </figure>
                    </div>
                    <div className="flex-grow-1">
                        <p className="mb-0 line-height-20 d-flex justify-content-between">
                            Apps are ready for update
                            <i title="" data-toggle="tooltip"
                                className="hide-show-toggler-item fa fa-check font-size-11"
                                data-original-title="Mark as unread"></i>
                        </p>
                        <span className="text-muted small">Yesterday</span>
                    </div>
                </a>
            </li> */}
        </Wrapper>
    )
};

export default NotificationLists;