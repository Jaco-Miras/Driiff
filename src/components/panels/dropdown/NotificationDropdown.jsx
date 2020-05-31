import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
`;

const NotificationDropdown = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`dropdown-menu dropdown-menu-right dropdown-menu-big notification-drop-down ${className}`}
                 styles="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-252px, 38px, 0px);">
                <div className="p-4 text-center d-flex justify-content-between" data-backround-image="assets/media/image/image1.jpg"
                     styles="background: rgba(0, 0, 0, 0) url(&quot;assets/media/image/image1.jpg&quot;) repeat scroll 0% 0%;">
                    <h6 className="mb-0">Notifications</h6>
                    <small className="font-size-11 opacity-7">1 unread notifications</small>
                </div>
                <div>
                    <ul className="list-group list-group-flush" styles="overflow: hidden; outline: currentcolor none medium;"
                        tabIndex="4">
                        <li>
                            <a href="#" className="list-group-item d-flex hide-show-toggler">
                                <div>
                                    <figure className="avatar avatar-sm m-r-15">
                                                <span
                                                    className="avatar-title bg-success-bright text-success rounded-circle">
                                                    <i className="ti-user"></i>
                                                </span>
                                    </figure>
                                </div>
                                <div className="flex-grow-1">
                                    <p className="mb-0 line-height-20 d-flex justify-content-between">
                                        New customer registered
                                        <i title="" data-toggle="tooltip"
                                           className="hide-show-toggler-item fa fa-circle-o font-size-11"
                                           data-original-title="Mark as read"></i>
                                    </p>
                                    <span className="text-muted small">20 min ago</span>
                                </div>
                            </a>
                        </li>
                        <li className="text-divider small pb-2 pl-3 pt-3">
                            <span>Old notifications</span>
                        </li>
                        <li>
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
                        </li>
                    </ul>
                </div>
                <div className="p-2 text-right">
                    <ul className="list-inline small">
                        <li className="list-inline-item">
                            <a href="#">Mark All Read</a>
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