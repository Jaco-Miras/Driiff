import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";

const Wrapper = styled.div`
`;

const DashboardNavigationTabPanel = (props) => {

    const {className = ""} = props;
    const user = useSelector(state => state.session.user);

    const handleLogout = () => {

    };

    return (
        <Wrapper className={`navigation-menu-tab ${className}`}>
            <div>
                <div className="navigation-menu-tab-header" data-toggle="tooltip" title=""
                     data-placement="right"
                     data-original-title={user.name}>
                    <a href="/" className="nav-link" data-toggle="dropdown" aria-expanded="false">
                        <figure className="avatar avatar-sm">
                            <img src={user.profile_image_link} className="rounded-circle"
                                 alt="avatar"/>
                        </figure>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right dropdown-menu-big">
                        <div className="p-3 text-center"
                             data-backround-image="https://via.placeholder.com/1000X563"
                             styles="background: rgba(0, 0, 0, 0) url(&quot;https://via.placeholder.com/1000X563&quot;) repeat scroll 0% 0%;">
                            <figure className="avatar mb-3">
                                <img src="https://via.placeholder.com/128X128" className="rounded-circle"
                                     alt="fpo-placeholder"/>
                            </figure>
                            <h6 className="d-flex align-items-center justify-content-center">
                                {user.name}
                                <a href="/" className="btn btn-primary btn-sm ml-2" data-toggle="tooltip"
                                   title=""
                                   data-original-title="Edit profile">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="1"
                                         strokeLinecap="round"
                                         strokeLinejoin="round" className="feather feather-edit-2">
                                        <path
                                            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                    </svg>
                                </a>
                            </h6>
                            <small>Balance: <strong>$105</strong></small>
                        </div>
                        <div className="dropdown-menu-body">
                            <div className="border-bottom p-4">
                                <h6 className="text-uppercase font-size-11 d-flex justify-content-between">
                                    Storage
                                    <span>%25</span>
                                </h6>
                                <div className="progress" styles="height: 8px;">
                                    <div className="progress-bar bg-primary" role="progressbar"
                                         styles="width: 35%;"
                                         aria-valuenow="35" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                            <div className="list-group list-group-flush">
                                <a href="/" className="list-group-item">Profile</a>
                                <a href="/" className="list-group-item d-flex">
                                    Followers <span className="text-muted ml-auto">214</span>
                                </a>
                                <a href="/" className="list-group-item d-flex">
                                    Inbox <span className="text-muted ml-auto">18</span>
                                </a>
                                <a href="/" className="list-group-item"
                                   data-sidebar-target="#settings">Billing</a>
                                <a href="/" className="list-group-item" data-sidebar-target="#settings">Need
                                    help?</a>
                                <a href="/" className="list-group-item text-danger"
                                   data-sidebar-target="#settings">Sign
                                    Out!</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-grow-1">
                <ul>
                    <li>
                        <a href="/" data-toggle="tooltip" data-placement="right" title=""
                           data-nav-target="#dashboards"
                           data-original-title="Dashboards">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round"
                                 className="feather feather-bar-chart-2">
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a className="active" href="/" data-toggle="tooltip" data-placement="right" title=""
                           data-nav-target="#apps" data-original-title="Apps">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round"
                                 className="feather feather-command">
                                <path
                                    d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="/" data-toggle="tooltip" data-placement="right" title=""
                           data-nav-target="#elements"
                           data-original-title="UI Elements">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round"
                                 className="feather feather-layers">
                                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                <polyline points="2 17 12 22 22 17"></polyline>
                                <polyline points="2 12 12 17 22 12"></polyline>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="/" data-toggle="tooltip" data-placement="right" title=""
                           data-nav-target="#pages"
                           data-original-title="Pages">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round"
                                 className="feather feather-copy">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>
                        <a href="/" data-toggle="tooltip" data-placement="right" title=""
                           data-original-title="Settings">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round"
                                 className="feather feather-settings">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path
                                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="/logout" onClick={handleLogout} data-toggle="tooltip" data-placement="right" title=""
                           data-original-title="Logout">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                                 strokeLinejoin="round"
                                 className="feather feather-log-out">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>
        </Wrapper>
    );
};

export default React.memo(DashboardNavigationTabPanel);