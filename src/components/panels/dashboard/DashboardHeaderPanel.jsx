import React from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {setNavMode} from "../../../redux/actions/globalActions";

const Wrapper = styled.div`
    ${props => {
    switch (props.navMode) {
        case 0:
            return `margin-left: 0;`;
        case 1:
            return `margin-left: 75px;`;
        default:
            return ``;
    }
}}
`;

const DashboardHeaderPanel = (props) => {

    const {className = ""} = props;

    const dispatch = useDispatch();
    const navMode = useSelector(state => state.global.navMode);

    const handleToggleNavigation = (e) => {
        e.preventDefault();

        const mode = navMode - 1;
        dispatch(
            setNavMode({mode: mode < 0 ? 2 : mode}),
        );
    };

    return (
        <Wrapper className={`header ${className}`} navMode={navMode}>
            <div>
                <ul className="navbar-nav">

                    <li className="nav-item navigation-toggler">
                        <a href="/" onClick={handleToggleNavigation} className="nav-link" title="Hide navigation">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round" className="feather feather-arrow-left">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                        </a>
                    </li>
                    <li className="nav-item navigation-toggler mobile-toggler">
                        <a href="/" className="nav-link" title="Show navigation">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round" className="feather feather-menu">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </a>
                    </li>

                    <li className="nav-item">
                        <a href="/" className="nav-link dropdown-toggle" data-toggle="dropdown">Create</a>
                        <div className="dropdown-menu">
                            <a href="/" className="dropdown-item">User</a>
                            <a href="/" className="dropdown-item">Category</a>
                            <a href="/" className="dropdown-item">Product</a>
                            <a href="/" className="dropdown-item">Report</a>
                        </div>
                    </li>
                    <li className="nav-item dropdown">
                        <a href="/" className="nav-link dropdown-toggle" data-toggle="dropdown">Apps</a>
                        <div className="dropdown-menu dropdown-menu-big">
                            <div className="p-3">
                                <div className="row row-xs">
                                    <div className="col-6">
                                        <a href="chat.html">
                                            <div className="p-3 border-radius-1 border text-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-message-circle width-23 height-23">
                                                    <path
                                                        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                                </svg>
                                                <div className="mt-2">Chat</div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-6">
                                        <a href="inbox.html">
                                            <div className="p-3 border-radius-1 border text-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-mail width-23 height-23">
                                                    <path
                                                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                    <polyline points="22,6 12,13 2,6"></polyline>
                                                </svg>
                                                <div className="mt-2">Mail</div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-6">
                                        <a href="app-todo.html">
                                            <div className="p-3 border-radius-1 border text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-check-circle width-23 height-23">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg>
                                                <div className="mt-2">Todo</div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-6">
                                        <a href="file-manager.html">
                                            <div className="p-3 border-radius-1 border text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-file width-23 height-23">
                                                    <path
                                                        d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                                    <polyline points="13 2 13 9 20 9"></polyline>
                                                </svg>
                                                <div className="mt-2">File Manager</div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <div>
                <ul className="navbar-nav">

                    <li className="nav-item">
                        <a href="/" className="nav-link dropdown-toggle" data-toggle="dropdown">
                            <img className="mr-2" src="assets/media/image/flags/261-china.png" alt="flag"
                                 width="18"/> China
                        </a>
                        <div className="dropdown-menu">
                            <a href="/" className="dropdown-item">
                                <img src="assets/media/image/flags/003-tanzania.png" className="mr-2" alt="flag"
                                     width="18"/>
                                Tanzania
                            </a>
                            <a href="/" className="dropdown-item">
                                <img src="assets/media/image/flags/262-united-kingdom.png" className="mr-2"
                                     alt="flag" width="18"/> United Kingdom
                            </a>
                            <a href="/" className="dropdown-item">
                                <img src="assets/media/image/flags/013-tunisia.png" className="mr-2" alt="flag"
                                     width="18"/>
                                Tunisia
                            </a>
                            <a href="/" className="dropdown-item">
                                <img src="assets/media/image/flags/044-spain.png" className="mr-2" alt="flag"
                                     width="18"/> Spain
                            </a>
                        </div>
                    </li>

                    <li className="nav-item">
                        <a href="/" className="nav-link" title="Search" data-toggle="dropdown">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round" className="feather feather-search">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </a>
                        <div className="dropdown-menu p-2 dropdown-menu-right">
                            <form>
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Search"/>
                                    <div className="input-group-prepend">
                                        <button className="btn" type="button">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                 strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                 className="feather feather-search">
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </li>

                    <li className="nav-item dropdown">
                        <a href="/" className="nav-link" title="Fullscreen" data-toggle="fullscreen">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round" className="feather feather-maximize maximize">
                                <path
                                    d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round" className="feather feather-minimize minimize">
                                <path
                                    d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                            </svg>
                        </a>
                    </li>

                    <li className="nav-item dropdown">
                        <a href="/" className="nav-link nav-link-notify" title="Chats" data-toggle="dropdown">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round" className="feather feather-message-circle">
                                <path
                                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right dropdown-menu-big">
                            <div className="p-4 text-center d-flex justify-content-between"
                                 data-backround-image="https://via.placeholder.com/1000X563"
                                 styles="background: rgba(0, 0, 0, 0) url(&quot;https://via.placeholder.com/1000X563&quot;) repeat scroll 0% 0%;">
                                <h6 className="mb-0">Chats</h6>
                                <small className="font-size-11 opacity-7">2 unread chats</small>
                            </div>
                            <div>
                                <ul className="list-group list-group-flush"
                                    styles="overflow: hidden; outline: currentcolor none medium;" tabIndex="2">
                                    <li>
                                        <a href="/" className="list-group-item d-flex hide-show-toggler">
                                            <div>
                                                <figure className="avatar avatar-sm m-r-15">
                                                    <img src="https://via.placeholder.com/128X128"
                                                         className="rounded-circle" alt="user"/>
                                                </figure>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-0 line-height-20 d-flex justify-content-between">
                                                    Herbie Pallatina
                                                    <i title="" data-toggle="tooltip"
                                                       className="hide-show-toggler-item fa fa-circle-o font-size-11"
                                                       data-original-title="Mark as read"></i>
                                                </p>
                                                <div className="small text-muted">
                                                    <span className="mr-2">02:30 PM</span>
                                                    <span>Have you madimage</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/"
                                           className="list-group-item d-flex align-items-center hide-show-toggler">
                                            <div>
                                                <figure className="avatar avatar-sm m-r-15">
                                                    <img src="https://via.placeholder.com/128X128"
                                                         className="rounded-circle" alt="user"/>
                                                </figure>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-0 line-height-20 d-flex justify-content-between">
                                                    Andrei Miners
                                                    <i title="" data-toggle="tooltip"
                                                       className="hide-show-toggler-item fa fa-circle-o font-size-11"
                                                       data-original-title="Mark as read"></i>
                                                </p>
                                                <div className="small text-muted">
                                                    <span className="mr-2">08:36 PM</span>
                                                    <span>I have a meetinimage</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="text-divider small pb-2 pl-3 pt-3">
                                        <span>Old chats</span>
                                    </li>
                                    <li>
                                        <a href="/"
                                           className="list-group-item d-flex align-items-center hide-show-toggler">
                                            <div>
                                                <figure className="avatar avatar-sm m-r-15">
                                                    <img src="https://via.placeholder.com/128X128"
                                                         className="rounded-circle" alt="user"/>
                                                </figure>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-0 line-height-20 d-flex justify-content-between">
                                                    Kevin added
                                                    <i title="" data-toggle="tooltip"
                                                       className="hide-show-toggler-item fa fa-check font-size-11"
                                                       data-original-title="Mark as unread"></i>
                                                </p>
                                                <div className="small text-muted">
                                                    <span className="mr-2">11:09 PM</span>
                                                    <span>Have you madimage</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/" className="list-group-item d-flex hide-show-toggler">
                                            <div>
                                                <figure className="avatar avatar-sm m-r-15">
                                                    <img src="https://via.placeholder.com/128X128"
                                                         className="rounded-circle" alt="user"/>
                                                </figure>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-0 line-height-20 d-flex justify-content-between">
                                                    Eugenio Carnelley
                                                    <i title="" data-toggle="tooltip"
                                                       className="hide-show-toggler-item fa fa-check font-size-11"
                                                       data-original-title="Mark as unread"></i>
                                                </p>
                                                <div className="small text-muted">
                                                    <span className="mr-2">Yesterday</span>
                                                    <span>I have a meetinimage</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/"
                                           className="list-group-item d-flex align-items-center hide-show-toggler">
                                            <div>
                                                <figure className="avatar avatar-sm m-r-15">
                                                    <img src="https://via.placeholder.com/128X128"
                                                         className="rounded-circle" alt="user"/>
                                                </figure>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-0 line-height-20 d-flex justify-content-between">
                                                    Neely Ferdinand
                                                    <i title="" data-toggle="tooltip"
                                                       className="hide-show-toggler-item fa fa-check font-size-11"
                                                       data-original-title="Mark as unread"></i>
                                                </p>
                                                <div className="small text-muted">
                                                    <span className="mr-2">Yesterday</span>
                                                    <span>I have a meetinimage</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-2 text-right">
                                <ul className="list-inline small">
                                    <li className="list-inline-item">
                                        <a href="/">Mark All Read</a>
                                    </li>
                                </ul>
                            </div>
                            <div id="ascrail2001" className="nicescroll-rails nicescroll-rails-vr"
                                 styles="width: 8px; z-index: 1000; cursor: default; position: absolute; top: 65.8px; left: 292px; height: 300px; opacity: 0; display: block;">
                                <div
                                    styles="position: relative; top: 0px; float: right; width: 6px; height: 262px; background-color: rgb(66, 66, 66); border: 1px solid rgb(255, 255, 255); background-clip: padding-box; border-radius: 5px;"
                                    className="nicescroll-cursors"></div>
                            </div>
                            <div id="ascrail2001-hr" className="nicescroll-rails nicescroll-rails-hr"
                                 styles="height: 8px; z-index: 1000; top: 357.8px; left: 0px; position: absolute; cursor: default; display: none; width: 292px; opacity: 0;">
                                <div
                                    styles="position: absolute; top: 0px; height: 6px; width: 300px; background-color: rgb(66, 66, 66); border: 1px solid rgb(255, 255, 255); background-clip: padding-box; border-radius: 5px; left: 0px;"
                                    className="nicescroll-cursors"></div>
                            </div>
                        </div>
                    </li>
                    <li className="nav-item dropdown">
                        <a href="/" className="nav-link nav-link-notify" title="Notifications"
                           data-toggle="dropdown">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round" className="feather feather-bell">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right dropdown-menu-big">
                            <div className="p-4 text-center d-flex justify-content-between"
                                 data-backround-image="https://via.placeholder.com/1000X563"
                                 styles="background: rgba(0, 0, 0, 0) url(&quot;https://via.placeholder.com/1000X563&quot;) repeat scroll 0% 0%;">
                                <h6 className="mb-0">Notifications</h6>
                                <small className="font-size-11 opacity-7">1 unread notifications</small>
                            </div>
                            <div>
                                <ul className="list-group list-group-flush"
                                    styles="overflow: hidden; outline: currentcolor none medium;" tabIndex="3">
                                    <li>
                                        <a href="/" className="list-group-item d-flex hide-show-toggler">
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
                                        <a href="/" className="list-group-item d-flex hide-show-toggler">
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
                                        <a href="/"
                                           className="list-group-item d-flex align-items-center hide-show-toggler">
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
                                        <a href="/"
                                           className="list-group-item d-flex align-items-center hide-show-toggler">
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
                                        <a href="/">Mark All Read</a>
                                    </li>
                                </ul>
                            </div>
                            <div id="ascrail2002" className="nicescroll-rails nicescroll-rails-vr"
                                 styles="width: 8px; z-index: 1000; cursor: default; position: absolute; top: 65.8px; left: 292px; height: 296.7px; display: none;">
                                <div
                                    styles="position: relative; top: 0px; float: right; width: 6px; height: 0px; background-color: rgb(66, 66, 66); border: 1px solid rgb(255, 255, 255); background-clip: padding-box; border-radius: 5px;"
                                    className="nicescroll-cursors"></div>
                            </div>
                            <div id="ascrail2002-hr" className="nicescroll-rails nicescroll-rails-hr"
                                 styles="height: 8px; z-index: 1000; top: 354.5px; left: 0px; position: absolute; cursor: default; display: none;">
                                <div
                                    styles="position: absolute; top: 0px; height: 6px; width: 0px; background-color: rgb(66, 66, 66); border: 1px solid rgb(255, 255, 255); background-clip: padding-box; border-radius: 5px;"
                                    className="nicescroll-cursors"></div>
                            </div>
                        </div>
                    </li>
                    <li className="nav-item dropdown">
                        <a href="/" className="nav-link" title="User menu" data-toggle="dropdown">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round" className="feather feather-settings">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path
                                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right dropdown-menu-big">
                            <div className="p-4 text-center d-flex justify-content-between"
                                 data-backround-image="https://via.placeholder.com/1000X563"
                                 styles="background: rgba(0, 0, 0, 0) url(&quot;https://via.placeholder.com/1000X563&quot;) repeat scroll 0% 0%;">
                                <h6 className="mb-0">Settings</h6>
                            </div>
                            <div>
                                <ul className="list-group list-group-flush"
                                    styles="overflow: hidden; outline: currentcolor none medium;" tabIndex="4">
                                    <li className="list-group-item">
                                        <div className="custom-control custom-switch">
                                            <input type="checkbox" className="custom-control-input"
                                                   id="customSwitch1" checked="" readOnly/>
                                            <label className="custom-control-label" htmlFor="customSwitch1">Allow
                                                notifications.</label>
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="custom-control custom-switch">
                                            <input type="checkbox" className="custom-control-input"
                                                   id="customSwitch2"/>
                                            <label className="custom-control-label" htmlFor="customSwitch2">Hide
                                                user requests</label>
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="custom-control custom-switch">
                                            <input type="checkbox" className="custom-control-input"
                                                   id="customSwitch3" checked="" readOnly/>
                                            <label className="custom-control-label" htmlFor="customSwitch3">Speed
                                                up demands</label>
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="custom-control custom-switch">
                                            <input type="checkbox" className="custom-control-input"
                                                   id="customSwitch4" checked="" readOnly/>
                                            <label className="custom-control-label" htmlFor="customSwitch4">Hide
                                                menus</label>
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="custom-control custom-switch">
                                            <input type="checkbox" className="custom-control-input"
                                                   id="customSwitch5" readOnly/>
                                            <label className="custom-control-label" htmlFor="customSwitch5">Remember
                                                next visits</label>
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="custom-control custom-switch">
                                            <input type="checkbox" className="custom-control-input"
                                                   id="customSwitch6" readOnly/>
                                            <label className="custom-control-label" htmlFor="customSwitch6">Enable
                                                report generation.</label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div id="ascrail2003" className="nicescroll-rails nicescroll-rails-vr"
                                 styles="width: 8px; z-index: 1000; cursor: default; position: absolute; top: 65.8px; left: 292px; height: 299px; display: none;">
                                <div
                                    styles="position: relative; top: 0px; float: right; width: 6px; height: 0px; background-color: rgb(66, 66, 66); border: 1px solid rgb(255, 255, 255); background-clip: padding-box; border-radius: 5px;"
                                    className="nicescroll-cursors"></div>
                            </div>
                            <div id="ascrail2003-hr" className="nicescroll-rails nicescroll-rails-hr"
                                 styles="height: 8px; z-index: 1000; top: 356.8px; left: 0px; position: absolute; cursor: default; display: none;">
                                <div
                                    styles="position: absolute; top: 0px; height: 6px; width: 0px; background-color: rgb(66, 66, 66); border: 1px solid rgb(255, 255, 255); background-clip: padding-box; border-radius: 5px;"
                                    className="nicescroll-cursors"></div>
                            </div>
                        </div>
                    </li>
                </ul>

                <ul className="navbar-nav d-flex align-items-center">
                    <li className="nav-item header-toggler">
                        <a href="/" className="nav-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round" className="feather feather-arrow-down">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <polyline points="19 12 12 19 5 12"></polyline>
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>
        </Wrapper>
    );
};

export default React.memo(DashboardHeaderPanel);