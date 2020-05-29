import React from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {addToModals} from "../../../redux/actions/globalActions";
import PostItemPanel from "../post/PostItemPanel";

const Wrapper = styled.div`
`;

const WorkspacePostsPanel = (props) => {

    const {className = ""} = props;
    const dispatch = useDispatch();
    const topic = useSelector(state => state.workspaces.activeTopic);

    const handleShowWorkspacePostModal = (e) => {
        let payload = {
            type: "workspace_post_create_edit",
            mode: "create",
            item: {
                workspace: topic,
            },
        };

        dispatch(
            addToModals(payload),
        );
    };

    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="row app-block">
                <div className="col-md-3 app-sidebar">
                    <div className="card">
                        <div className="card-body">
                            <button className="btn btn-secondary btn-block" onClick={handleShowWorkspacePostModal}>
                                Create new post
                            </button>
                        </div>
                        <div className="app-sidebar-menu"
                             styles="overflow: hidden; outline: currentcolor none medium;" tabIndex="2">
                            <div className="list-group list-group-flush">
                                <a href="/" className="list-group-item active d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                         stroke-linecap="round" stroke-linejoin="round"
                                         className="feather feather-mail mr-2 width-15 height-15">
                                        <path
                                            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    All
                                </a>
                                <a href="/" className="list-group-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                         stroke-linecap="round" stroke-linejoin="round"
                                         className="feather feather-send mr-2 width-15 height-15">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                    My posts
                                </a>
                            </div>
                            <div className="card-body">
                                <h6 className="mb-0">Tags</h6>
                            </div>
                            <div className="list-group list-group-flush">
                                <a href="/" className="list-group-item d-flex align-items-center">
                                    <span className="text-warning fa fa-circle mr-2"></span>
                                    Theme Support
                                    <span className="small ml-auto">5</span>
                                </a>
                                <a href="/" className="list-group-item d-flex align-items-center">
                                    <span className="text-success fa fa-circle mr-2"></span>
                                    Freelance
                                </a>
                                <a href="/" className="list-group-item d-flex align-items-center">
                                    <span className="text-danger fa fa-circle mr-2"></span>
                                    Social
                                </a>
                                <a href="/" className="list-group-item d-flex align-items-center">
                                    <span className="text-info fa fa-circle mr-2"></span>
                                    Friends
                                </a>
                                <a href="/" className="list-group-item d-flex align-items-center">
                                    <span className="text-secondary fa fa-circle mr-2"></span>
                                    Coding
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-9 app-content">
                    <div className="app-content-overlay"></div>
                    <div className="app-action">
                        <div className="action-left">
                            <ul className="list-inline">
                                <li className="list-inline-item mb-0">
                                    <a href="/" className="btn btn-outline-light dropdown-toggle"
                                       data-toggle="dropdown">
                                        Filter
                                    </a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="/">Favourites</a>
                                        <a className="dropdown-item" href="/">Done</a>
                                        <a className="dropdown-item" href="/">Deleted</a>
                                    </div>
                                </li>
                                <li className="list-inline-item mb-0">
                                    <a href="/" className="btn btn-outline-light dropdown-toggle"
                                       data-toggle="dropdown">
                                        Sort
                                    </a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="/">Ascending</a>
                                        <a className="dropdown-item" href="/">Descending</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="action-right">
                            <form className="d-flex mr-3">
                                <a href="/" className="app-sidebar-menu-button btn btn-outline-light">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                         stroke-linecap="round" stroke-linejoin="round"
                                         className="feather feather-menu width-15 height-15">
                                        <line x1="3" y1="12" x2="21" y2="12"></line>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <line x1="3" y1="18" x2="21" y2="18"></line>
                                    </svg>
                                </a>
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Post search"
                                           aria-describedby="button-addon1"/>
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-light" type="button"
                                                id="button-addon1">
                                            <i className="ti-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <div className="app-pager d-flex align-items-center">
                                <div className="mr-3">1-50 of 253</div>
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination">
                                        <li className="page-item">
                                            <a className="page-link" href="/" aria-label="Previous">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                                                     className="feather feather-chevron-left width-15 height-15">
                                                    <polyline points="15 18 9 12 15 6"></polyline>
                                                </svg>
                                            </a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="/" aria-label="Next">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                                                     className="feather feather-chevron-right width-15 height-15">
                                                    <polyline points="9 18 15 12 9 6"></polyline>
                                                </svg>
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="card card-body app-content-body">
                        <div className="app-lists" styles="overflow: hidden; outline: currentcolor none medium;"
                             tabIndex="1">
                            <ul className="list-group list-group-flush ui-sortable">
                                <PostItemPanel/>
                            </ul>
                        </div>

                        <div className="card app-detail">
                            <div className="card-header">
                                <div className="app-detail-action-left">
                                    <a className="app-detail-close-button" href="/">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="feather feather-arrow-left mr-3">
                                            <line x1="19" y1="12" x2="5" y2="12"></line>
                                            <polyline points="12 19 5 12 12 5"></polyline>
                                        </svg>
                                    </a>
                                    <h5 className="mb-0">Draw design and presentation for customers. </h5>
                                </div>
                                <div className="app-detail-action-right">
                                    <div>
                                        <a href="/" className="btn btn-success" data-toggle="tooltip" title=""
                                           data-original-title="2:44 AM">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                 stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                                                 className="feather feather-check mr-2">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            Completed
                                        </a>
                                        <span data-toggle="modal" data-target="#editTaskModal">
                                        <a href="/" className="btn btn-outline-light ml-2" title=""
                                           data-toggle="tooltip" data-original-title="Edit Task">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                                 stroke-linecap="round" stroke-linejoin="round"
                                                 className="feather feather-edit-3"><path d="M12 20h9"></path><path
                                                d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                        </a>
                                    </span>
                                        <a href="/" className="btn btn-outline-light ml-2" data-toggle="tooltip"
                                           title="" data-original-title="Delete Task">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                 stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                                                 className="feather feather-trash">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path
                                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="app-detail-article">
                                <div className="card-body">
                                    <div className="d-flex align-items-center p-l-r-0 m-b-20">
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-group">
                                                <div className="avatar avatar-sm" title="" data-toggle="tooltip"
                                                     data-original-title="Polly Everist">
                                                        <span
                                                            className="avatar-title bg-primary rounded-circle">P</span>
                                                </div>
                                                <div className="avatar avatar-sm" title="" data-toggle="tooltip"
                                                     data-original-title="Godwin Adanez">
                                                        <span
                                                            className="avatar-title bg-success rounded-circle">G</span>
                                                </div>
                                                <figure className="avatar avatar-sm" title="" data-toggle="tooltip"
                                                        data-original-title="Lisle Essam">
                                                    <img src="https://via.placeholder.com/128X128"
                                                         className="rounded-circle" alt="image"/>
                                                </figure>
                                                <figure className="avatar avatar-sm" title="" data-toggle="tooltip"
                                                        data-original-title="Baxie Roseblade">
                                                    <img src="https://via.placeholder.com/128X128"
                                                         className="rounded-circle" alt="image"/>
                                                </figure>
                                                <figure className="avatar avatar-sm" title="" data-toggle="tooltip"
                                                        data-original-title="Mella Mixter">
                                                    <img src="https://via.placeholder.com/128X128"
                                                         className="rounded-circle" alt="image"/>
                                                </figure>
                                            </div>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="badge bg-warning badge-pill mr-2">Theme Support</span>
                                            <a href="/" data-toggle="tooltip" title="" className="mr-2"
                                               data-original-title="Files">
                                                <i className="fa fa-paperclip"></i>
                                            </a>
                                            <a href="/" className="mr-2">
                                                <i className="fa fa-star font-size-16 text-warning"></i>
                                            </a>
                                            <span className="text-muted">4:14 AM</span>
                                        </div>
                                    </div>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                                        corporis
                                        incidunt labore modi numquam omnis pariatur possimus suscipit vitae
                                        voluptas?</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi aperiam
                                        asperiores
                                        error esse fugiat fugit laboriosam necessitatibus officia, placeat, quam
                                        quis
                                        reprehenderit similique soluta suscipit tempore! Consequuntur eligendi hic
                                        in
                                        libero
                                        nostrum rem ut? At itaque laboriosam natus provident reprehenderit.</p>
                                </div>

                                <hr className="m-0"/>
                                <div className="card-body">
                                    <h6 className="mb-3 font-size-11 text-uppercase">Files</h6>
                                    <ul className="list-unstyled mb-0">
                                        <li className="small">
                                            <a href="/">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     stroke-width="1" stroke-linecap="round"
                                                     stroke-linejoin="round"
                                                     className="feather feather-paperclip mr-1 width-15 height-15">
                                                    <path
                                                        d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                                                </svg>
                                                uikit-design.psd
                                            </a>
                                        </li>
                                        <li className="small">
                                            <a href="/">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     stroke-width="1" stroke-linecap="round"
                                                     stroke-linejoin="round"
                                                     className="feather feather-paperclip mr-1 width-15 height-15">
                                                    <path
                                                        d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                                                </svg>
                                                uikit-design.sketch
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <hr className="m-0"/>
                                <div className="card-body">
                                    <h6 className="mb-3 font-size-11 text-uppercase">Comment</h6>
                                    <div className="reply-email-quill-editor mb-3 ql-container ql-snow">
                                        <div className="ql-editor ql-blank" data-gramm="false"
                                             data-placeholder="Type something... " contentEditable="true">
                                            <p><br/></p></div>
                                        <div className="ql-clipboard" tabIndex="-1"
                                             contentEditable="true"></div>
                                        <div className="ql-tooltip ql-hidden"><a className="ql-preview"
                                                                                 target="_blank"
                                                                                 href="about:blank"></a><input
                                            type="text" data-formula="e=mc^2"
                                            data-link="https://quilljs.com" data-video="Embed URL"/><a
                                            className="ql-action"></a><a className="ql-remove"></a></div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div className="reply-email-quill-toolbar ql-toolbar ql-snow">
                                        <span className="ql-formats mr-0">
                                          <button className="ql-bold" type="button"><svg viewBox="0 0 18 18"> <path
                                              className="ql-stroke"
                                              d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"></path> <path
                                              className="ql-stroke"
                                              d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"></path> </svg></button>
                                          <button className="ql-italic" type="button"><svg viewBox="0 0 18 18"> <line
                                              className="ql-stroke" x1="7" x2="13" y1="4" y2="4"></line> <line
                                              className="ql-stroke" x1="5" x2="11" y1="14" y2="14"></line> <line
                                              className="ql-stroke" x1="8" x2="10" y1="14"
                                              y2="4"></line> </svg></button>
                                          <button className="ql-underline" type="button"><svg viewBox="0 0 18 18"> <path
                                              className="ql-stroke"
                                              d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3"></path> <rect
                                              className="ql-fill" height="1" rx="0.5" ry="0.5" width="12" x="3"
                                              y="15"></rect> </svg></button>
                                          <button className="ql-link" type="button"><svg viewBox="0 0 18 18"> <line
                                              className="ql-stroke" x1="7" x2="11" y1="7" y2="11"></line> <path
                                              className="ql-even ql-stroke"
                                              d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z"></path> <path
                                              className="ql-even ql-stroke"
                                              d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z"></path> </svg></button>
                                          <button className="ql-image" type="button"><svg viewBox="0 0 18 18"> <rect
                                              className="ql-stroke" height="10" width="12" x="3" y="4"></rect> <circle
                                              className="ql-fill" cx="6" cy="7" r="1"></circle> <polyline
                                              className="ql-even ql-fill"
                                              points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg></button>
                                        </span>
                                        </div>
                                        <button className="btn btn-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                 stroke-width="1" stroke-linecap="round"
                                                 stroke-linejoin="round"
                                                 className="feather feather-send mr-2">
                                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                            </svg>
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspacePostsPanel);