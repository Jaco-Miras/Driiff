import React from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../common";

const Wrapper = styled.div`    
    overflow: auto;  
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;    
`;

const UserProfilePanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`user-profile-panel container-fluid h-100 ${className}`}>
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <figure className="avatar avatar-lg m-b-20">
                                <img src="https://via.placeholder.com/128X128" className="rounded-circle" alt="..."/>
                            </figure>
                            <h5 className="mb-1">Roxana Roussell</h5>
                            <p className="text-muted small">Web Developer</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus repudiandae
                                eveniet
                                harum.</p>
                            <a href="#" className="btn btn-outline-primary">
                                <SvgIconFeather icon="edit-2" />
                                Edit Profile
                            </a>
                        </div>
                        <hr className="m-0"/>
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-4 text-info">
                                    <h4 className="font-weight-bold">291</h4>
                                    <span>Post</span>
                                </div>
                                <div className="col-4 text-success">
                                    <h4 className="font-weight-bold">10.596</h4>
                                    <span>Followers</span>
                                </div>
                                <div className="col-4 text-warning">
                                    <h4 className="font-weight-bold">7.896</h4>
                                    <span>Likes</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title d-flex justify-content-between align-items-center">
                                Information
                                <a href="#" className="btn btn-outline-light btn-sm">
                                    <SvgIconFeather icon="edit-2" />
                                    Edit
                                </a>
                            </h6>
                            <div className="row mb-2">
                                <div className="col-6 text-muted">First Name:</div>
                                <div className="col-6">Johnatan</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-6 text-muted">Last Name:</div>
                                <div className="col-6">Due</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-6 text-muted">Age:</div>
                                <div className="col-6">26</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-6 text-muted">Position:</div>
                                <div className="col-6">Web Designer</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-6 text-muted">City:</div>
                                <div className="col-6">New York, USA</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-6 text-muted">Address:</div>
                                <div className="col-6">228 Park Ave Str.</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-6 text-muted">Phone:</div>
                                <div className="col-6">+1-202-555-0134</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-6 text-muted">Email:</div>
                                <div className="col-6">johndue@gmail.com</div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title d-flex justify-content-between align-items-center">
                                Photos
                                <a href="#" className="btn btn-outline-light btn-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
                                         strokeLinecap="round" strokeLinejoin="round"
                                         className="feather feather-upload mr-2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                    Upload
                                </a>
                            </h6>
                            <div className="row row-xs">
                                <div className="col-lg-4 mb-3">
                                    <img className="img-fluid rounded" src="https://via.placeholder.com/1200X900"
                                         alt="image"/>
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <img className="img-fluid rounded" src="https://via.placeholder.com/1200X900"
                                         alt="image"/>
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <img className="img-fluid rounded" src="https://via.placeholder.com/1200X900"
                                         alt="image"/>
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <img className="img-fluid rounded" src="https://via.placeholder.com/1200X900"
                                         alt="image"/>
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <img className="img-fluid rounded" src="https://via.placeholder.com/1200X900"
                                         alt="image"/>
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <img className="img-fluid rounded" src="https://via.placeholder.com/1200X900"
                                         alt="image"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title">Skills</h6>
                            <div className="mb-4">
                                <div className="text-muted mb-2">
                                    <div
                                        className="icon-block icon-block-sm icon-block-floating icon-block-outline-primary text-primary m-r-10">
                                        <i className="fa fa-user"></i>
                                    </div>
                                    <span className="text-uppercase font-size-11">Graphic Design</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="progress flex-grow-1" styles="height: 5px">
                                        <div className="progress-bar bg-primary" role="progressbar"
                                             styles="width: 42%;" aria-valuenow="42" aria-valuemin="0"
                                             aria-valuemax="100"></div>
                                    </div>
                                    <span className="h6 mb-0 ml-3">42%</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="text-muted mb-2">
                                    <div
                                        className="icon-block icon-block-sm icon-block-floating icon-block-outline-danger text-danger m-r-10">
                                        <i className="fa fa-star"></i>
                                    </div>
                                    <span className="text-uppercase font-size-11">Web Design</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="progress flex-grow-1" styles="height: 5px">
                                        <div className="progress-bar bg-danger" role="progressbar"
                                             styles="width: 75%;" aria-valuenow="75" aria-valuemin="0"
                                             aria-valuemax="100"></div>
                                    </div>
                                    <span className="h6 mb-0 ml-3">75%</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="text-muted mb-2">
                                    <div
                                        className="icon-block icon-block-sm icon-block-floating icon-block-outline-warning text-warning m-r-10">
                                        <i className="fa fa-bar-chart"></i>
                                    </div>
                                    <span className="text-uppercase font-size-11">Software</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="progress flex-grow-1" styles="height: 5px">
                                        <div className="progress-bar bg-warning" role="progressbar"
                                             styles="width: 50%;" aria-valuenow="50" aria-valuemin="0"
                                             aria-valuemax="100"></div>
                                    </div>
                                    <span className="h6 mb-0 ml-3">50%</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="text-muted mb-2">
                                    <div
                                        className="icon-block icon-block-sm icon-block-floating icon-block-outline-success text-success m-r-10">
                                        <i className="fa fa-cloud-upload"></i>
                                    </div>
                                    <span className="text-uppercase font-size-11">Contact Management</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="progress flex-grow-1" styles="height: 7px">
                                        <div className="progress-bar bg-success" role="progressbar"
                                             styles="width: 22%;" aria-valuenow="22" aria-valuemin="0"
                                             aria-valuemax="100"></div>
                                    </div>
                                    <span className="h6 mb-0 ml-3">22%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-md-8">

                    <div className="card">
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                        <textarea rows="2" className="form-control"
                                                  placeholder="Create something"></textarea>
                                </div>
                                <div className="text-right">
                                    <ul className="list-inline">
                                        <li className="list-inline-item">
                                            <a href="#" data-toggle="tooltip" title=""
                                               className="btn btn-outline-light" data-original-title="Add Image">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-image">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                    <polyline points="21 15 16 10 5 21"></polyline>
                                                </svg>
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#" data-toggle="tooltip" title=""
                                               className="btn btn-outline-light" data-original-title="Add Video">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-video">
                                                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                                </svg>
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#" data-toggle="tooltip" title=""
                                               className="btn btn-outline-light" data-original-title="Add File">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-file">
                                                    <path
                                                        d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                                    <polyline points="13 2 13 9 20 9"></polyline>
                                                </svg>
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <button className="btn btn-primary">Submit</button>
                                        </li>
                                    </ul>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <ul className="nav nav-pills flex-column flex-sm-row" id="myTab" role="tablist">
                                <li className="flex-sm-fill text-sm-center nav-item">
                                    <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home"
                                       role="tab" aria-selected="true">Posts</a>
                                </li>
                                <li className="flex-sm-fill text-sm-center nav-item">
                                    <a className="nav-link" id="timeline-tab" data-toggle="tab" href="#timeline"
                                       role="tab" aria-selected="true">Timeline</a>
                                </li>
                                <li className="flex-sm-fill text-sm-center nav-item">
                                    <a className="nav-link" id="connections-tab1" data-toggle="tab"
                                       href="#connections" role="tab" aria-selected="false">
                                        Connections <span className="badge badge-light m-l-5">6</span>
                                    </a>
                                </li>
                                <li className="flex-sm-fill text-sm-center nav-item">
                                    <a className="nav-link" id="earnings-tab" data-toggle="tab" href="#earnings"
                                       role="tab" aria-selected="false">Earnings</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="home" role="tabpanel">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex mb-3">
                                        <div className="d-flex align-items-center">
                                            <figure className="avatar avatar-sm mr-3">
                                                <img src="https://via.placeholder.com/128X128"
                                                     className="rounded-circle" alt="..."/>
                                            </figure>
                                            <div className="d-inline-block">
                                                <div><strong>Martina Ash</strong> shared a link</div>
                                                <small className="text-muted">7 hours ago</small>
                                            </div>
                                        </div>
                                        <div className="dropdown ml-auto">
                                            <a href="#" data-toggle="dropdown">
                                                <i className="fa fa-ellipsis-v"></i>
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <a href="#" className="dropdown-item">Share</a>
                                                <a href="#" className="dropdown-item">Edit</a>
                                                <a href="#" className="dropdown-item">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolor eos id
                                        ipsa
                                        nobis omnis, tenetur? Dolor officiis omnis quo?</p>
                                    <a href="#">
                                        <div className="row no-gutters border border-radius-1">
                                            <div className="col-3">
                                                <img src="https://via.placeholder.com/600X600" className="img-fluid"
                                                     alt="image"/>
                                            </div>
                                            <div className="col-9 p-3">
                                                <h5>Algolia Integration</h5>
                                                <p className="mb-0">Lorem ipsum dolor sit amet, consectetur
                                                    adipisicing
                                                    elit. Cumque dolor, eos laudantium maxime perferendis
                                                    veritatis.</p>
                                                <small className="text-primary">https://themeforest.net/</small>
                                            </div>
                                        </div>
                                    </a>
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <div>
                                            <a href="#" title="" data-toggle="tooltip" data-original-title="Like">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-heart width-17 height-17 mr-1">
                                                    <path
                                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                </svg>
                                                42
                                            </a>
                                        </div>
                                        <div>
                                            <a href="#" title="" data-toggle="tooltip"
                                               data-original-title="Comments">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-message-square width-17 height-17 mr-1">
                                                    <path
                                                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                </svg>
                                                3
                                            </a>
                                            <a href="#" className="ml-3" title="" data-toggle="tooltip"
                                               data-original-title="Share">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-share-2 width-17 height-17 mr-1">
                                                    <circle cx="18" cy="5" r="3"></circle>
                                                    <circle cx="6" cy="12" r="3"></circle>
                                                    <circle cx="18" cy="19" r="3"></circle>
                                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                                </svg>
                                                1
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex mb-3">
                                        <div className="d-flex align-items-center">
                                            <figure className="avatar avatar-sm mr-3">
                                                <img src="https://via.placeholder.com/128X128"
                                                     className="rounded-circle" alt="..."/>
                                            </figure>
                                            <div className="d-inline-block">
                                                <div><strong>Martina Ash</strong> shared a link</div>
                                                <small className="text-muted">7 hours ago</small>
                                            </div>
                                        </div>
                                        <div className="dropdown ml-auto">
                                            <a href="#" data-toggle="dropdown">
                                                <i className="fa fa-ellipsis-v"></i>
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <a href="#" className="dropdown-item">Share</a>
                                                <a href="#" className="dropdown-item">Edit</a>
                                                <a href="#" className="dropdown-item">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam doloremque
                                        eveniet illo minus nemo obcaecati, voluptatem? At corporis cum dolorem eos
                                        impedit in magni officiis quibusdam, ratione sequi totam voluptatum.</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolor eos id
                                        ipsa
                                        nobis omnis, tenetur? Dolor officiis omnis quo?</p>
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <div>
                                            <a href="#" title="" data-toggle="tooltip" data-original-title="Like">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-heart width-17 height-17 mr-1 text-danger">
                                                    <path
                                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                </svg>
                                                142
                                            </a>
                                        </div>
                                        <div>
                                            <a href="#" title="" data-toggle="tooltip"
                                               data-original-title="Comments">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-message-square width-17 height-17 mr-1">
                                                    <path
                                                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                </svg>
                                                13
                                            </a>
                                            <a href="#" className="ml-3" title="" data-toggle="tooltip"
                                               data-original-title="Share">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-share-2 width-17 height-17 mr-1">
                                                    <circle cx="18" cy="5" r="3"></circle>
                                                    <circle cx="6" cy="12" r="3"></circle>
                                                    <circle cx="18" cy="19" r="3"></circle>
                                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                                </svg>
                                                4
                                            </a>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="card card-body border p-3">
                                            <div className="d-flex mb-3">
                                                <div className="d-flex align-items-center">
                                                    <figure className="avatar avatar-sm mr-3">
                                                        <img src="https://via.placeholder.com/128X128"
                                                             className="rounded-circle" alt="..."/>
                                                    </figure>
                                                    <div className="d-inline-block">
                                                        <div><strong>Martina Ash</strong> shared a link</div>
                                                        <small className="text-muted">7 hours ago</small>
                                                    </div>
                                                </div>
                                                <div className="dropdown ml-auto">
                                                    <a href="#" data-toggle="dropdown">
                                                        <i className="fa fa-ellipsis-v"></i>
                                                    </a>
                                                    <div className="dropdown-menu dropdown-menu-right">
                                                        <a href="#" className="dropdown-item">Share</a>
                                                        <a href="#" className="dropdown-item">Edit</a>
                                                        <a href="#" className="dropdown-item">Delete</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus,
                                                ducimus?</p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <a href="#" title="" data-toggle="tooltip"
                                                       data-original-title="Like">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                             height="24" viewBox="0 0 24 24" fill="none"
                                                             stroke="currentColor" strokeWidth="1"
                                                             strokeLinecap="round" strokeLinejoin="round"
                                                             className="feather feather-heart width-17 height-17 mr-1">
                                                            <path
                                                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                        </svg>
                                                        3
                                                    </a>
                                                    <a href="#" className="ml-3">
                                                        Reply
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card card-body border p-3">
                                            <div className="d-flex mb-3">
                                                <div className="d-flex align-items-center">
                                                    <figure className="avatar avatar-sm mr-3">
                                                        <img src="https://via.placeholder.com/128X128"
                                                             className="rounded-circle" alt="..."/>
                                                    </figure>
                                                    <div className="d-inline-block">
                                                        <div><strong>Martina Ash</strong> shared a link</div>
                                                        <small className="text-muted">7 hours ago</small>
                                                    </div>
                                                </div>
                                                <div className="dropdown ml-auto">
                                                    <a href="#" data-toggle="dropdown">
                                                        <i className="fa fa-ellipsis-v"></i>
                                                    </a>
                                                    <div className="dropdown-menu dropdown-menu-right">
                                                        <a href="#" className="dropdown-item">Share</a>
                                                        <a href="#" className="dropdown-item">Edit</a>
                                                        <a href="#" className="dropdown-item">Delete</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, ad,
                                                assumenda at atque corporis culpa earum id illum impedit laborum
                                                maxime
                                                minus nisi omnis quod sequi suscipit totam veritatis voluptatum.</p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <a href="#" title="" data-toggle="tooltip"
                                                       data-original-title="Like">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                             height="24" viewBox="0 0 24 24" fill="none"
                                                             stroke="currentColor" strokeWidth="1"
                                                             strokeLinecap="round" strokeLinejoin="round"
                                                             className="feather feather-heart width-17 height-17 mr-1">
                                                            <path
                                                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                        </svg>
                                                        1
                                                    </a>
                                                    <a href="#" className="ml-3">
                                                        Reply
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <form className="d-flex">
                                            <div>
                                                <figure className="avatar avatar-sm mr-3">
                                                    <img src="https://via.placeholder.com/128X128"
                                                         className="rounded-circle" alt="..."/>
                                                </figure>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="form-group">
                                                        <textarea rows="2" className="form-control"
                                                                  placeholder="Post comment for @Martina"></textarea>
                                                </div>
                                                <button className="btn btn-primary">Submit</button>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex mb-3">
                                        <div className="d-flex align-items-center">
                                            <figure className="avatar avatar-sm mr-3">
                                                <img src="https://via.placeholder.com/128X128"
                                                     className="rounded-circle" alt="..."/>
                                            </figure>
                                            <div className="d-inline-block">
                                                <div>Anna Mull</div>
                                                <small className="text-muted">7 hours ago</small>
                                            </div>
                                        </div>
                                        <div className="dropdown ml-auto">
                                            <a href="#" data-toggle="dropdown">
                                                <i className="fa fa-ellipsis-v"></i>
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <a href="#" className="dropdown-item">Share</a>
                                                <a href="#" className="dropdown-item">Edit</a>
                                                <a href="#" className="dropdown-item">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolor eos id
                                        ipsa
                                        nobis omnis, tenetur? Dolor officiis omnis quo?</p>
                                    <div className="row row-xs">
                                        <div className="col-6">
                                            <img src="https://via.placeholder.com/600X600"
                                                 className="w-100 border-radius-1" alt="image"/>
                                        </div>
                                        <div className="col-6">
                                            <img src="https://via.placeholder.com/600X600"
                                                 className="w-100 border-radius-1" alt="image"/>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <div>
                                            <a href="#" title="" data-toggle="tooltip" data-original-title="Like">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-heart width-17 height-17 mr-1">
                                                    <path
                                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                </svg>
                                                311
                                            </a>
                                        </div>
                                        <div>
                                            <a href="#" title="" data-toggle="tooltip"
                                               data-original-title="Comments">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-message-square width-17 height-17 mr-1">
                                                    <path
                                                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                </svg>
                                                33
                                            </a>
                                            <a href="#" className="ml-3" title="" data-toggle="tooltip"
                                               data-original-title="Share">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                     className="feather feather-share-2 width-17 height-17 mr-1">
                                                    <circle cx="18" cy="5" r="3"></circle>
                                                    <circle cx="6" cy="12" r="3"></circle>
                                                    <circle cx="18" cy="19" r="3"></circle>
                                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                                </svg>
                                                14
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade show" id="timeline" role="tabpanel">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">Timeline</h6>
                                    <div className="timeline">
                                        <div className="timeline-item">
                                            <div>
                                                <a href="#">
                                                    <figure className="avatar avatar-sm mr-3 bring-forward">
                                                        <img src="https://via.placeholder.com/128X128"
                                                             className="rounded-circle" alt="image"/>
                                                    </figure>
                                                </a>
                                            </div>
                                            <div>
                                                <h6 className="d-flex justify-content-between mb-4">
                                            <span>
                                                <a href="#">Martina Ash</a> shared a link
                                            </span>
                                                    <span
                                                        className="text-muted font-weight-normal">Tue 8:17pm</span>
                                                </h6>
                                                <a href="#">
                                                    <div className="mb-3 border border-radius-1">
                                                        <div className="row no-gutters">
                                                            <div className="col-2">
                                                                <img src="https://via.placeholder.com/600X600"
                                                                     className="w-100" alt="image"/>
                                                            </div>
                                                            <div className="col-10 p-3">
                                                                <h5 className="line-height-16">Connection title</h5>
                                                                Lorem ipsum dolor sit amet, consectetur adipisicing
                                                                elit. Facilis, voluptatibus.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="timeline-item">
                                            <div>
                                                <figure className="avatar avatar-sm mr-3 bring-forward">
                                                        <span
                                                            className="avatar-title bg-success-bright text-success rounded-circle">C</span>
                                                </figure>
                                            </div>
                                            <div>
                                                <h6 className="d-flex justify-content-between mb-4">
                                            <span>
                                                <a href="#">Jonny Richie</a> shared a post
                                            </span>
                                                    <span
                                                        className="text-muted font-weight-normal">Tue 8:17pm</span>
                                                </h6>
                                                <a href="#">
                                                    <div className="mb-3 border p-3 border-radius-1">
                                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                                                        aliquid aperiam commodi culpa debitis deserunt enim itaque
                                                        laborum minima neque nostrum pariatur perspiciatis, placeat
                                                        quidem, ratione recusandae reiciendis sapiente, ut veritatis
                                                        vitae. Beatae dolore hic odio! Esse officiis quidem
                                                        voluptate.
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="timeline-item">
                                            <div>
                                                <figure className="avatar avatar-sm mr-3 bring-forward">
                                                        <span
                                                            className="avatar-title bg-info-bright text-info rounded-circle">K</span>
                                                </figure>
                                            </div>
                                            <div>
                                                <h6 className="d-flex justify-content-between mb-4">
                                            <span>
                                                <a href="#">Jonny Richie</a> attached file
                                            </span>
                                                    <span
                                                        className="text-muted font-weight-normal">Tue 8:17pm</span>
                                                </h6>
                                                <a href="#">
                                                    <div className="mb-3 border p-3 border-radius-1">
                                                        <i className="fa fa-file-pdf-o mr-2"></i> filename12334.pdf
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="timeline-item">
                                            <div>
                                                <figure className="avatar avatar-sm mr-3 bring-forward">
                                            <span
                                                className="avatar-title bg-warning-bright text-warning rounded-circle">
                                                <i className="ti-image"></i>
                                            </span>
                                                </figure>
                                            </div>
                                            <div>
                                                <h6 className="d-flex justify-content-between mb-4">
                                            <span>
                                                <a href="#">Jonny Richie</a> shared files
                                            </span>
                                                    <span
                                                        className="text-muted font-weight-normal">Tue 8:17pm</span>
                                                </h6>
                                                <div className="row row-xs">
                                                    <div className="col-xl-3 col-lg-4 col-md-6">
                                                        <figure>
                                                            <img src="https://via.placeholder.com/1200X900"
                                                                 className="w-100 border-radius-1" alt="image"/>
                                                        </figure>
                                                    </div>
                                                    <div className="col-xl-3 col-lg-4 col-md-6">
                                                        <figure>
                                                            <img src="https://via.placeholder.com/1200X900"
                                                                 className="w-100 border-radius-1" alt="image"/>
                                                        </figure>
                                                    </div>
                                                    <div className="col-xl-3 col-lg-4 col-md-6">
                                                        <figure>
                                                            <img src="https://via.placeholder.com/1200X900"
                                                                 className="w-100 border-radius-1" alt="image"/>
                                                        </figure>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="timeline-item">
                                            <div>
                                                <figure className="avatar avatar-sm mr-3 bring-forward">
                                                        <span
                                                            className="avatar-title bg-youtube rounded-circle">Y</span>
                                                </figure>
                                            </div>
                                            <div>
                                                <h6 className="d-flex justify-content-between">
                                           <span>
                                               <a href="#">Jonny Richie</a> shared video
                                           </span>
                                                    <span
                                                        className="text-muted font-weight-normal">Tue 8:17pm</span>
                                                </h6>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto,
                                                    placeat.</p>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div
                                                            className="embed-responsive embed-responsive-16by9 m-t-b-5">
                                                            <iframe className="embed-responsive-item"
                                                                    src="https://www.youtube.com/embed/l-epKcOA7RQ"
                                                                    allowFullScreen=""></iframe>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="connections" role="tabpanel">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">Connections</h6>
                                    <div className="row">
                                        <div className="col-lg-6 col-md-12">
                                            <div className="card border">
                                                <div className="card-body p-3">
                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <figure className="avatar mr-3">
                                                                <img src="https://via.placeholder.com/128X128"
                                                                     className="rounded-circle" alt="..."/>
                                                            </figure>
                                                        </div>
                                                        <div>
                                                            <p className="mb-0">Rosemary Krout</p>
                                                            <p className="small text-muted mb-0 line-height-15">
                                                                Team Leader
                                                            </p>
                                                        </div>
                                                        <a href="#" className="ml-auto" title=""
                                                           data-toggle="tooltip" data-original-title="Message">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24" viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="1"
                                                                 strokeLinecap="round" strokeLinejoin="round"
                                                                 className="feather feather-message-circle">
                                                                <path
                                                                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12">
                                            <div className="card border">
                                                <div className="card-body p-3">
                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <figure className="avatar mr-3">
                                                                <img src="https://via.placeholder.com/128X128"
                                                                     className="rounded-circle" alt="..."/>
                                                            </figure>
                                                        </div>
                                                        <div>
                                                            <p className="mb-0">Miller Edwins</p>
                                                            <p className="small text-muted mb-0 line-height-15">
                                                                Team Leader
                                                            </p>
                                                        </div>
                                                        <a href="#" className="ml-auto" title=""
                                                           data-toggle="tooltip" data-original-title="Message">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24" viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="1"
                                                                 strokeLinecap="round" strokeLinejoin="round"
                                                                 className="feather feather-message-circle">
                                                                <path
                                                                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12">
                                            <div className="card border">
                                                <div className="card-body p-3">
                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <figure className="avatar mr-3">
                                                                <img src="https://via.placeholder.com/128X128"
                                                                     className="rounded-circle" alt="..."/>
                                                            </figure>
                                                        </div>
                                                        <div>
                                                            <p className="mb-0">Cahra Smiz</p>
                                                            <p className="small text-muted mb-0 line-height-15">
                                                                Agent
                                                            </p>
                                                        </div>
                                                        <a href="#" className="ml-auto" title=""
                                                           data-toggle="tooltip" data-original-title="Message">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24" viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="1"
                                                                 strokeLinecap="round" strokeLinejoin="round"
                                                                 className="feather feather-message-circle">
                                                                <path
                                                                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12">
                                            <div className="card border">
                                                <div className="card-body p-3">
                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <figure className="avatar mr-3">
                                                                <img src="https://via.placeholder.com/128X128"
                                                                     className="rounded-circle" alt="..."/>
                                                            </figure>
                                                        </div>
                                                        <div>
                                                            <p className="mb-0">Burgess Attwool</p>
                                                            <p className="small text-muted mb-0 line-height-15">
                                                                Contact
                                                            </p>
                                                        </div>
                                                        <a href="#" className="ml-auto" title=""
                                                           data-toggle="tooltip" data-original-title="Message">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24" viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="1"
                                                                 strokeLinecap="round" strokeLinejoin="round"
                                                                 className="feather feather-message-circle">
                                                                <path
                                                                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12">
                                            <div className="card border">
                                                <div className="card-body p-3">
                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <figure className="avatar mr-3">
                                                                <img src="https://via.placeholder.com/128X128"
                                                                     className="rounded-circle" alt="..."/>
                                                            </figure>
                                                        </div>
                                                        <div>
                                                            <p className="mb-0">Allx Life</p>
                                                            <p className="small text-muted mb-0 line-height-15">
                                                                Agent
                                                            </p>
                                                        </div>
                                                        <a href="#" className="ml-auto" title=""
                                                           data-toggle="tooltip" data-original-title="Message">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24" viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="1"
                                                                 strokeLinecap="round" strokeLinejoin="round"
                                                                 className="feather feather-message-circle">
                                                                <path
                                                                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12">
                                            <div className="card border">
                                                <div className="card-body p-3">
                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <figure className="avatar mr-3">
                                                                <img src="https://via.placeholder.com/128X128"
                                                                     className="rounded-circle" alt="..."/>
                                                            </figure>
                                                        </div>
                                                        <div>
                                                            <p className="mb-0">Marti Sorbey</p>
                                                            <p className="small text-muted mb-0 line-height-15">
                                                                Contact
                                                            </p>
                                                        </div>
                                                        <a href="#" className="ml-auto" title=""
                                                           data-toggle="tooltip" data-original-title="Message">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24" viewBox="0 0 24 24" fill="none"
                                                                 stroke="currentColor" strokeWidth="1"
                                                                 strokeLinecap="round" strokeLinejoin="round"
                                                                 className="feather feather-message-circle">
                                                                <path
                                                                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="earnings" role="tabpanel">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">Earnings</h6>
                                    <div className="table-responsive" tabIndex="1"
                                         styles="overflow: hidden; outline: none;">
                                        <table className="table table-hover">
                                            <thead className="thead-light">
                                            <tr>
                                                <th>Date</th>
                                                <th>Item Sales Count</th>
                                                <th>Earnings</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>monday, 12</td>
                                                <td>
                                                    3
                                                </td>
                                                <td>$400</td>
                                            </tr>
                                            <tr>
                                                <td>tuesday, 13</td>
                                                <td>
                                                    2
                                                </td>
                                                <td>$400</td>
                                            </tr>
                                            <tr>
                                                <td>wednesday, 14</td>
                                                <td>
                                                    3
                                                </td>
                                                <td>$420</td>
                                            </tr>
                                            <tr>
                                                <td>thursday, 15</td>
                                                <td>
                                                    5
                                                </td>
                                                <td>$500</td>
                                            </tr>
                                            <tr>
                                                <td>friday, 15</td>
                                                <td>
                                                    3
                                                </td>
                                                <td>$400</td>
                                            </tr>
                                            <tr>
                                                <td>saturday, 16</td>
                                                <td>
                                                    3
                                                </td>
                                                <td>$400</td>
                                            </tr>
                                            <tr>
                                                <td>sunday, 17</td>
                                                <td>
                                                    3
                                                </td>
                                                <td>$400</td>
                                            </tr>
                                            <tr>
                                                <td>monday, 18</td>
                                                <td>
                                                    3
                                                </td>
                                                <td>$500</td>
                                            </tr>
                                            <tr>
                                                <td>tuesday, 19</td>
                                                <td>
                                                    3
                                                </td>
                                                <td>$400</td>
                                            </tr>
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <th></th>
                                                <th>28</th>
                                                <th>$3720</th>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>);
};

export default React.memo(UserProfilePanel);