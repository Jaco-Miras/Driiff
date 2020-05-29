import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
`;

const WorkspaceFilesPanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`container-fluid ${className}`}>
            <div className="row app-block">
                <div className="col-md-3 app-sidebar">
                    <div className="card">
                        <div className="card-body">
                            <button className="btn btn-secondary btn-block file-upload-btn" data-toggle="modal"
                                    data-target="#compose">
                                Upload Files
                            </button>
                            <form className="d-none" id="file-upload">
                                <input type="file" multiple=""/>
                            </form>
                        </div>
                        <div className="app-sidebar-menu"
                             styles="overflow: hidden; outline: currentcolor none medium;" tabIndex="1">
                            <div className="list-group list-group-flush">
                                <a href="/" className="list-group-item active d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                         stroke-linecap="round" stroke-linejoin="round"
                                         className="feather feather-folder width-15 height-15 mr-2">
                                        <path
                                            d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    All Files
                                    <span className="small ml-auto">45</span>
                                </a>
                                <a href="/" className="list-group-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                         stroke-linecap="round" stroke-linejoin="round"
                                         className="feather feather-monitor width-15 height-15 mr-2">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                        <line x1="8" y1="21" x2="16" y2="21"></line>
                                        <line x1="12" y1="17" x2="12" y2="21"></line>
                                    </svg>
                                    My Devices
                                </a>
                                <a href="/" className="list-group-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                         stroke-linecap="round" stroke-linejoin="round"
                                         className="feather feather-upload-cloud width-15 height-15 mr-2">
                                        <polyline points="16 16 12 12 8 16"></polyline>
                                        <line x1="12" y1="12" x2="12" y2="21"></line>
                                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                                        <polyline points="16 16 12 12 8 16"></polyline>
                                    </svg>
                                    Recents
                                </a>
                                <a href="/" className="list-group-item d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                         stroke-linecap="round" stroke-linejoin="round"
                                         className="feather feather-star width-15 height-15 mr-2">
                                        <polygon
                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                    Important
                                    <span className="small ml-auto">10</span>
                                </a>
                                <a href="/" className="list-group-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                         stroke-linecap="round" stroke-linejoin="round"
                                         className="feather feather-trash width-15 height-15 mr-2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path
                                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    Deleted Files
                                </a>
                            </div>
                            <div className="card-body">
                                <h6 className="mb-4">Storage Status</h6>
                                <div className="d-flex align-items-center">
                                    <div className="mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="feather feather-database width-30 height-30">
                                            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                                        </svg>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="progress" styles="height: 10px">
                                            <div className="progress-bar progress-bar-striped" role="progressbar"
                                                 styles="width: 40%" aria-valuenow="10" aria-valuemin="0"
                                                 aria-valuemax="100"></div>
                                        </div>
                                        <div className="line-height-12 small text-muted mt-2">19.5GB used of 25GB
                                        </div>
                                    </div>
                                </div>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="feather feather-plus mr-2">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                        Add
                                    </a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="/">Folder</a>
                                        <a className="dropdown-item" href="/">File</a>
                                    </div>
                                </li>
                                <li className="list-inline-item mb-0">
                                    <a href="/" className="btn btn-outline-light dropdown-toggle"
                                       data-toggle="dropdown">Folders</a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item d-flex justify-content-between" href="/">
                                            Video
                                            <span className="text-muted">21</span>
                                        </a>
                                        <a className="dropdown-item d-flex justify-content-between" href="/">
                                            Image
                                            <span className="text-muted">5</span>
                                        </a>
                                        <a className="dropdown-item d-flex justify-content-between" href="/">
                                            Audio
                                            <span className="text-muted">12</span>
                                        </a>
                                        <a className="dropdown-item d-flex justify-content-between" href="/">
                                            Documents
                                            <span className="text-muted">7</span>
                                        </a>
                                    </div>
                                </li>
                                <li className="list-inline-item mb-0">
                                    <a href="/" className="btn btn-outline-light dropdown-toggle"
                                       data-toggle="dropdown">
                                        Order by
                                    </a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="/">Date</a>
                                        <a className="dropdown-item" href="/">Name</a>
                                        <a className="dropdown-item" href="/">Size</a>
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
                                         className="feather feather-menu">
                                        <line x1="3" y1="12" x2="21" y2="12"></line>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <line x1="3" y1="18" x2="21" y2="18"></line>
                                    </svg>
                                </a>
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Search file"
                                           aria-describedby="button-addon1"/>
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-light" type="button"
                                                id="button-addon1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                 stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                                                 className="feather feather-search">
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="card app-content-body">

                        <div className="card-body">

                            <h6 className="font-size-11 text-uppercase mb-4">Recently Files</h6>

                            <div className="row">
                                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                                    <div className="card app-file-list">
                                        <div className="app-file-icon">
                                            <i className="fa fa-file-pdf-o text-danger"></i>
                                            <div className="dropdown position-absolute top-0 right-0 mr-3">
                                                <a href="/" className="font-size-14" data-toggle="dropdown">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <a href="/" className="dropdown-item">View Details</a>
                                                    <a href="/" className="dropdown-item">Share</a>
                                                    <a href="/" className="dropdown-item">Download</a>
                                                    <a href="/" className="dropdown-item">Copy to</a>
                                                    <a href="/" className="dropdown-item">Move to</a>
                                                    <a href="/" className="dropdown-item">Rename</a>
                                                    <a href="/" className="dropdown-item">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2 small">
                                            <div>resume.pdf</div>
                                            <div className="text-muted">1.2mb</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                                    <div className="card app-file-list">
                                        <div className="app-file-icon">
                                            <i className="fa fa-file-excel-o text-success"></i>
                                            <div className="dropdown position-absolute top-0 right-0 mr-3">
                                                <a href="/" className="font-size-14" data-toggle="dropdown">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <a href="/" className="dropdown-item">View Details</a>
                                                    <a href="/" className="dropdown-item">Share</a>
                                                    <a href="/" className="dropdown-item">Download</a>
                                                    <a href="/" className="dropdown-item">Copy to</a>
                                                    <a href="/" className="dropdown-item">Move to</a>
                                                    <a href="/" className="dropdown-item">Rename</a>
                                                    <a href="/" className="dropdown-item">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2 small">
                                            <div>last-months-report.xlsx</div>
                                            <div className="text-muted">120.85kb</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                                    <div className="card app-file-list">
                                        <div className="app-file-icon">
                                            <i className="fa fa-file-text-o text-warning"></i>
                                            <div className="dropdown position-absolute top-0 right-0 mr-3">
                                                <a href="/" className="font-size-14" data-toggle="dropdown">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <a href="/" className="dropdown-item">View Details</a>
                                                    <a href="/" className="dropdown-item">Share</a>
                                                    <a href="/" className="dropdown-item">Download</a>
                                                    <a href="/" className="dropdown-item">Copy to</a>
                                                    <a href="/" className="dropdown-item">Move to</a>
                                                    <a href="/" className="dropdown-item">Rename</a>
                                                    <a href="/" className="dropdown-item">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2 small">
                                            <div>todo-list.txt</div>
                                            <div className="text-muted">1.85kb</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h6 className="font-size-11 text-uppercase mb-4">Updated Files</h6>

                            <div className="row">
                                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                                    <div className="card app-file-list">
                                        <div className="app-file-icon">
                                            <i className="fa fa-file-powerpoint-o text-secondary"></i>
                                            <div className="dropdown position-absolute top-0 right-0 mr-3">
                                                <a href="/" className="font-size-14" data-toggle="dropdown">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <a href="/" className="dropdown-item">View Details</a>
                                                    <a href="/" className="dropdown-item">Share</a>
                                                    <a href="/" className="dropdown-item">Download</a>
                                                    <a href="/" className="dropdown-item">Copy to</a>
                                                    <a href="/" className="dropdown-item">Move to</a>
                                                    <a href="/" className="dropdown-item">Rename</a>
                                                    <a href="/" className="dropdown-item">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2 small">
                                            <div>presentation-file.pptx</div>
                                            <div className="text-muted">10.50kb</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                                    <div className="card app-file-list">
                                        <div className="app-file-icon">
                                            <i className="fa fa-file-excel-o text-success"></i>
                                            <div className="dropdown position-absolute top-0 right-0 mr-3">
                                                <a href="/" className="font-size-14" data-toggle="dropdown">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <a href="/" className="dropdown-item">View Details</a>
                                                    <a href="/" className="dropdown-item">Share</a>
                                                    <a href="/" className="dropdown-item">Download</a>
                                                    <a href="/" className="dropdown-item">Copy to</a>
                                                    <a href="/" className="dropdown-item">Move to</a>
                                                    <a href="/" className="dropdown-item">Rename</a>
                                                    <a href="/" className="dropdown-item">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2 small">
                                            <div>contact-list.xlsx</div>
                                            <div className="text-muted">8.7mb</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                                    <div className="card app-file-list">
                                        <div className="app-file-icon">
                                            <i className="fa fa-file-zip-o text-primary"></i>
                                            <div className="dropdown position-absolute top-0 right-0 mr-3">
                                                <a href="/" className="font-size-14" data-toggle="dropdown">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <a href="/" className="dropdown-item">View Details</a>
                                                    <a href="/" className="dropdown-item">Share</a>
                                                    <a href="/" className="dropdown-item">Download</a>
                                                    <a href="/" className="dropdown-item">Copy to</a>
                                                    <a href="/" className="dropdown-item">Move to</a>
                                                    <a href="/" className="dropdown-item">Rename</a>
                                                    <a href="/" className="dropdown-item">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2 small">
                                            <div>website-html-files.zip</div>
                                            <div className="text-muted">100mb</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                                    <div className="card app-file-list">
                                        <div className="app-file-icon">
                                            <i className="fa fa-file-word-o text-info"></i>
                                            <div className="dropdown position-absolute top-0 right-0 mr-3">
                                                <a href="/" className="font-size-14" data-toggle="dropdown">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <a href="/" className="dropdown-item">View Details</a>
                                                    <a href="/" className="dropdown-item">Share</a>
                                                    <a href="/" className="dropdown-item">Download</a>
                                                    <a href="/" className="dropdown-item">Copy to</a>
                                                    <a href="/" className="dropdown-item">Move to</a>
                                                    <a href="/" className="dropdown-item">Rename</a>
                                                    <a href="/" className="dropdown-item">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2 small">
                                            <div>articles.docx</div>
                                            <div className="text-muted">100.25kb</div>
                                        </div>
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

export default React.memo(WorkspaceFilesPanel);