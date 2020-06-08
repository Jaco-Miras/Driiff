import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
`;

const TimelinePanel = (props) => {

    const {className = ""} = props;

    return (
        <Wrapper className={`timeline-panel card ${className}`}>
            <div className="card-body">
                <div className="timeline">
                    <div className="timeline-item">
                        <div>
                            <a href="#">
                                <figure className="avatar avatar-sm mr-3 bring-forward">
                                    <img src="https://via.placeholder.com/128X128" className="rounded-circle"
                                         alt="image"/>
                                </figure>
                            </a>
                        </div>
                        <div>
                            <h6 className="d-flex justify-content-between mb-4">
                                            <span>
                                                <a href="#">Martina Ash</a> shared a link
                                            </span>
                                <span className="text-muted font-weight-normal">Tue 8:17pm</span>
                            </h6>
                            <a href="#">
                                <div className="mb-3 border border-radius-1">
                                    <div className="row no-gutters">
                                        <div className="col-1">
                                            <img src="https://via.placeholder.com/600X600" className="w-100"
                                                 alt="image"/>
                                        </div>
                                        <div className="col-10 p-3">
                                            <h5 className="line-height-16">Connection title</h5>
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                            Facilis, voluptatibus.
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div>
                            <figure className="avatar avatar-sm mr-3 bring-forward">
                                <span className="avatar-title bg-success-bright text-success rounded-circle">C</span>
                            </figure>
                        </div>
                        <div>
                            <h6 className="d-flex justify-content-between mb-4">
                                            <span>
                                                <a href="#">Jonny Richie</a> shared a post
                                            </span>
                                <span className="text-muted font-weight-normal">Tue 8:17pm</span>
                            </h6>
                            <a href="#">
                                <div className="mb-3 border p-3 border-radius-1">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid
                                    aperiam commodi culpa debitis deserunt enim itaque laborum minima neque
                                    nostrum pariatur perspiciatis, placeat quidem, ratione recusandae
                                    reiciendis sapiente, ut veritatis vitae. Beatae dolore hic odio! Esse
                                    officiis quidem voluptate.
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div>
                            <figure className="avatar avatar-sm mr-3 bring-forward">
                                <span className="avatar-title bg-info-bright text-info rounded-circle">K</span>
                            </figure>
                        </div>
                        <div>
                            <h6 className="d-flex justify-content-between mb-4">
                                            <span>
                                                <a href="#">Jonny Richie</a> attached file
                                            </span>
                                <span className="text-muted font-weight-normal">Tue 8:17pm</span>
                            </h6>
                            <a href="#">
                                <div className="mb-3 border p-3 border-radius-1">
                                    <i className="fa fa-file-pdf-o mr-2" /> filename12334.pdf
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div>
                            <figure className="avatar avatar-sm mr-3 bring-forward">
                                            <span
                                                className="avatar-title bg-warning-bright text-warning rounded-circle">
                                                <i className="ti-image" />
                                            </span>
                            </figure>
                        </div>
                        <div>
                            <h6 className="d-flex justify-content-between mb-4">
                                            <span>
                                                <a href="#">Jonny Richie</a> shared files
                                            </span>
                                <span className="text-muted font-weight-normal">Tue 8:17pm</span>
                            </h6>
                            <div className="row row-xs">
                                <div className="col-xl-2 col-lg-3 col-md-4 col-sx-6">
                                    <figure>
                                        <img src="https://via.placeholder.com/1200X900"
                                             className="w-100 border-radius-1"
                                             alt="image"/>
                                    </figure>
                                </div>
                                <div className="col-xl-2 col-lg-3 col-md-4 col-sx-6">
                                    <figure>
                                        <img src="https://via.placeholder.com/1200X900"
                                             className="w-100 border-radius-1"
                                             alt="image"/>
                                    </figure>
                                </div>
                                <div className="col-xl-2 col-lg-3 col-md-4 col-sx-6">
                                    <figure>
                                        <img src="https://via.placeholder.com/1200X900"
                                             className="w-100 border-radius-1"
                                             alt="image"/>
                                    </figure>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div>
                            <figure className="avatar avatar-sm mr-3 bring-forward">
                                <span className="avatar-title bg-youtube rounded-circle">Y</span>
                            </figure>
                        </div>
                        <div>
                            <h6 className="d-flex justify-content-between">
                                           <span>
                                               <a href="#">Jonny Richie</a> shared video
                                           </span>
                                <span className="text-muted font-weight-normal">Tue 8:17pm</span>
                            </h6>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, placeat.</p>
                            <div className="row">
                                <div className="col-md-5">
                                    <div className="embed-responsive embed-responsive-16by9 m-t-b-5">
                                        <iframe
                                            title="Responsive item"
                                            className="embed-responsive-item"
                                                src="https://www.youtube.com/embed/l-epKcOA7RQ"
                                                allowFullScreen="" />
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

export default React.memo(TimelinePanel);
