import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
`;

const Blank = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`navigation-menu-body ${className}`}>
            <div className="" styles="overflow: hidden; outline: currentcolor none medium;"
                 tabIndex="3">

                <div>
                    <div id="navigation-logo">
                        <a href="/">
                            <img className="logo" src="assets/media/image/logo.png" alt="logo"/>
                            <img className="logo-light" src="assets/media/image/logo-light.png"
                                 alt="light logo"/>
                        </a>
                    </div>
                </div>
                <div className="navigation-menu-group">

                    <div id="dashboards">
                        <ul>
                            <li className="navigation-divider">Dashboards</li>
                            <li><a href="index.html">CRM System</a></li>
                            <li><a href="dashboard-two.html">Ecommerce <span className="badge badge-danger">2</span></a>
                            </li>
                            <li><a href="dashboard-three.html">Analytics</a></li>
                            <li><a href="dashboard-four.html">Project Management</a></li>
                            <li><a href="dashboard-five.html">Helpdesk Management</a></li>
                            <li className="navigation-divider">Contacts</li>
                            <li>
                                <div className="list-group list-group-flush">
                                    <a href="/" className="list-group-item d-flex align-items-center">
                                        <div>
                                            <div className="avatar avatar-sm m-r-10">
                                                <img src="https://via.placeholder.com/128X128"
                                                     className="rounded-circle"
                                                     alt="fpo-placeholder"/>
                                            </div>
                                        </div>
                                        <span>Valentine Maton</span>
                                    </a>
                                    <a href="/" className="list-group-item d-flex align-items-center">
                                        <div>
                                            <div className="avatar avatar-sm m-r-10">
                                                <img src="https://via.placeholder.com/128X128"
                                                     className="rounded-circle"
                                                     alt="fpo-placeholder"/>
                                            </div>
                                        </div>
                                        <span>Holmes Cherryman</span>
                                    </a>
                                    <a href="/" className="list-group-item d-flex align-items-center">
                                        <div>
                                            <div className="avatar avatar-sm m-r-10">
                                                <img src="https://via.placeholder.com/128X128"
                                                     className="rounded-circle"
                                                     alt="fpo-placeholder"/>
                                            </div>
                                        </div>
                                        <span>Kenneth Hune</span>
                                    </a>
                                </div>
                            </li>
                            <li className="navigation-divider">Followers</li>
                            <li>
                                <div className="avatar-group ml-4">
                                    <a href="/" className="avatar">
                                        <span className="avatar-title bg-success rounded-circle">E</span>
                                    </a>
                                    <a href="/" className="avatar">
                                        <img src="https://via.placeholder.com/128X128" className="rounded-circle"
                                             alt="avatar"/>
                                    </a>
                                    <a href="/" className="avatar">
                                        <img src="https://via.placeholder.com/128X128" className="rounded-circle"
                                             alt="avatar"/>
                                    </a>
                                    <a href="/" className="avatar">
                                        <span className="avatar-title bg-info rounded-circle">C</span>
                                    </a>
                                    <a href="/" className="avatar">
                                        <span className="avatar-title bg-dark rounded-circle">+30</span>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="open" id="apps">
                        <ul>
                            <li className="navigation-divider">Web Apps</li>
                            <li>
                                <a className="active" href="chat.html">
                                    <span>Chat</span>
                                    <span className="badge badge-danger">5</span>
                                </a>
                            </li>
                            <li>
                                <a href="inbox.html">
                                    <span>Mail</span>
                                </a>
                            </li>
                            <li>
                                <a href="app-todo.html">
                                    <span>Todo</span>
                                    <span className="badge badge-warning">2</span>
                                </a>
                            </li>
                            <li>
                                <a href="file-manager.html">
                                    <span>File Manager</span>
                                </a>
                            </li>
                            <li>
                                <a href="calendar.html">
                                    <span>Calendar</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div id="elements">
                        <ul>
                            <li className="navigation-divider">UI Elements</li>
                            <li>
                                <a href="/">Basic<i className="sub-menu-arrow ti-angle-up"></i></a>
                                <ul>
                                    <li><a href="alerts.html">Alert</a></li>
                                    <li><a href="accordion.html">Accordion</a></li>
                                    <li><a href="buttons.html">Buttons</a></li>
                                    <li><a href="dropdown.html">Dropdown</a></li>
                                    <li><a href="list-group.html">List Group</a></li>
                                    <li><a href="pagination.html">Pagination</a></li>
                                    <li><a href="typography.html">Typography</a></li>
                                    <li><a href="media-object.html">Media Object</a></li>
                                    <li><a href="progress.html">Progress</a></li>
                                    <li><a href="modal.html">Modal</a></li>
                                    <li><a href="spinners.html">Spinners</a></li>
                                    <li><a href="navs.html">Navs</a></li>
                                    <li><a href="tab.html">Tab</a></li>
                                    <li><a href="tooltip.html">Tooltip</a></li>
                                    <li><a href="popovers.html">Popovers</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="/">Cards<i className="sub-menu-arrow ti-angle-up"></i></a>
                                <ul>
                                    <li><a href="basic-cards.html">Basic Cards </a></li>
                                    <li><a href="image-cards.html">Image Cards </a></li>
                                    <li><a href="card-scroll.html">Card Scroll </a></li>
                                    <li><a href="other-cards.html">Others </a></li>
                                </ul>
                            </li>
                            <li><a href="avatar.html">Avatar</a></li>
                            <li><a href="icons.html">Icons</a></li>
                            <li><a href="colors.html">Colors</a></li>
                            <li>
                                <a href="/">Plugins<i className="sub-menu-arrow ti-angle-up"></i></a>
                                <ul>
                                    <li><a href="sweet-alert.html">Sweet Alert</a></li>
                                    <li><a href="lightbox.html">Lightbox</a></li>
                                    <li><a href="toast.html">Toast</a></li>
                                    <li><a href="tour.html">Tour</a></li>
                                    <li><a href="slick-slide.html">Slick Slide</a></li>
                                    <li><a href="nestable.html">Nestable</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="/">Forms<i className="sub-menu-arrow ti-angle-up"></i></a>
                                <ul>
                                    <li><a href="basic-form.html">Form Layouts</a></li>
                                    <li><a href="custom-form.html">Custom Forms</a></li>
                                    <li><a href="advanced-form.html">Advanced Form</a></li>
                                    <li><a href="form-validation.html">Validation</a></li>
                                    <li><a href="form-wizard.html">Wizard</a></li>
                                    <li><a href="file-upload.html">File Upload</a></li>
                                    <li><a href="datepicker.html">Datepicker</a></li>
                                    <li><a href="timepicker.html">Timepicker</a></li>
                                    <li><a href="colorpicker.html">Colorpicker</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="/">Tables<i className="sub-menu-arrow ti-angle-up"></i></a>
                                <ul>
                                    <li><a href="tables.html">Basic Tables</a></li>
                                    <li><a href="data-table.html">Datatable</a></li>
                                    <li><a href="responsive-table.html">Responsive Tables</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="/">Charts<i className="sub-menu-arrow ti-angle-up"></i></a>
                                <ul>
                                    <li><a href="apexchart.html">Apex</a></li>
                                    <li><a href="chartjs.html">Chartjs</a></li>
                                    <li><a href="justgage.html">Justgage</a></li>
                                    <li><a href="morsis.html">Morsis</a></li>
                                    <li><a href="peity.html">Peity</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="/">Maps<i className="sub-menu-arrow ti-angle-up"></i></a>
                                <ul>
                                    <li><a href="google-map.html">Google</a></li>
                                    <li><a href="vector-map.html">Vector</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div id="pages">
                        <ul>
                            <li className="navigation-divider">Pages</li>
                            <li><a href="login.html">Login</a></li>
                            <li><a href="register.html">Register</a></li>
                            <li><a href="recover-password.html">Recovery Password</a></li>
                            <li><a href="lock-screen.html">Lock Screen</a></li>
                            <li><a href="profile.html">Profile</a></li>
                            <li><a href="timeline.html">Timeline</a></li>
                            <li><a href="invoice.html">Invoice</a></li>

                            <li><a href="pricing-table.html">Pricing Table</a></li>
                            <li><a href="search-result.html">Search Result</a></li>
                            <li>
                                <a href="/">Error Pages<i className="sub-menu-arrow ti-angle-up"></i></a>
                                <ul>
                                    <li><a href="404.html">404</a></li>
                                    <li><a href="404-2.html">404 V2</a></li>
                                    <li><a href="503.html">503</a></li>
                                    <li><a href="mean-at-work.html">Mean at Work</a></li>
                                </ul>
                            </li>
                            <li><a href="blank-page.html">Starter Page</a></li>
                            <li>
                                <a href="/">Email Templates<i className="sub-menu-arrow ti-angle-up"></i></a>
                                <ul>
                                    <li><a href="email-template-basic.html">Basic</a></li>
                                    <li><a href="email-template-alert.html">Alert</a></li>
                                    <li><a href="email-template-billing.html">Billing</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="/">Menu Level<i className="sub-menu-arrow ti-angle-up"></i></a>
                                <ul>
                                    <li>
                                        <a href="/">Menu Level<i className="sub-menu-arrow ti-angle-up"></i></a>
                                        <ul>
                                            <li>
                                                <a href="/">Menu Level </a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(Blank);