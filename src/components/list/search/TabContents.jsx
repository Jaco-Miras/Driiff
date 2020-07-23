import React from "react";
import { ChatTabResults, PeopleTabResults } from "./index";

const TabContents = (props) => {

    const { activeTab } = props;

    return (
        <div className="tab-content" id="myTabContent">
            <div className={`tab-pane fade ${(activeTab === "chat" || activeTab === null) && "active show"}`} role="tabpanel">
                <ChatTabResults/>
            </div>
            <div className={`tab-pane fade ${activeTab === "files" && "active show"}`} role="tabpanel">
                <div className="row">
                <div className="col-lg-4 col-md-6">
                    <div className="card border">
                    <img className="card-img-top" src="assets/media/image/photo1.jpg" alt="image" />
                    <div className="card-body">
                        <p className="card-text">Some quick example text to build on the card title and make up...</p>
                        <a href="#" className="text-uppercase font-size-11">
                        Read More
                        </a>
                    </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className="card border">
                    <img className="card-img-top" src="assets/media/image/photo2.jpg" alt="image" />
                    <div className="card-body">
                        <p className="card-text">Some quick example text to build on the card title and make up...</p>
                        <a href="#" className="text-uppercase font-size-11">
                        Read More
                        </a>
                    </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className="card border">
                    <img className="card-img-top" src="assets/media/image/photo3.jpg" alt="image" />
                    <div className="card-body">
                        <p className="card-text">Some quick example text to build on the card title and make up...</p>
                        <a href="#" className="text-uppercase font-size-11">
                        Read More
                        </a>
                    </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className="card border">
                    <img className="card-img-top" src="assets/media/image/photo4.jpg" alt="image" />
                    <div className="card-body">
                        <p className="card-text">Some quick example text to build on the card title and make up...</p>
                        <a href="#" className="text-uppercase font-size-11">
                        Read More
                        </a>
                    </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className="card border">
                    <img className="card-img-top" src="assets/media/image/photo5.jpg" alt="image" />
                    <div className="card-body">
                        <p className="card-text">Some quick example text to build on the card title and make up...</p>
                        <a href="#">READ MORE</a>
                    </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className="card border">
                    <img className="card-img-top" src="assets/media/image/photo6.jpg" alt="image" />
                    <div className="card-body">
                        <p className="card-text">Some quick example text to build on the card title and make up...</p>
                        <a href="#" className="text-uppercase font-size-11">
                        Read More
                        </a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className={`tab-pane fade ${activeTab === "posts" && "active show"}`} id="photos" role="tabpanel">
                <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                    <a href="assets/media/image/portfolio-one.jpg" className="image-popup-gallery-item">
                    <img className="img-fluid rounded" src="assets/media/image/portfolio-one.jpg" alt="image" />
                    </a>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                    <a href="assets/media/image/portfolio-two.jpg" className="image-popup-gallery-item">
                    <img className="img-fluid rounded" src="assets/media/image/portfolio-two.jpg" alt="image" />
                    </a>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                    <a href="assets/media/image/portfolio-three.jpg" className="image-popup-gallery-item">
                    <img className="img-fluid rounded" src="assets/media/image/portfolio-three.jpg" alt="image" />
                    </a>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                    <a href="assets/media/image/portfolio-four.jpg" className="image-popup-gallery-item">
                    <img className="img-fluid rounded" src="assets/media/image/portfolio-four.jpg" alt="image" />
                    </a>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                    <a href="assets/media/image/portfolio-five.jpg" className="image-popup-gallery-item">
                    <img className="img-fluid rounded" src="assets/media/image/portfolio-five.jpg" alt="image" />
                    </a>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                    <a href="assets/media/image/portfolio-six.jpg" className="image-popup-gallery-item">
                    <img className="img-fluid rounded" src="assets/media/image/portfolio-six.jpg" alt="image" />
                    </a>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                    <a href="assets/media/image/portfolio-one.jpg" className="image-popup-gallery-item">
                    <img className="img-fluid rounded" src="assets/media/image/portfolio-one.jpg" alt="image" />
                    </a>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                    <a href="assets/media/image/portfolio-two.jpg" className="image-popup-gallery-item">
                    <img className="img-fluid rounded" src="assets/media/image/portfolio-two.jpg" alt="image" />
                    </a>
                </div>
                </div>
            </div>
            <div className={`tab-pane fade ${activeTab === "people" && "active show"}`} id="users" role="tabpanel">
                <PeopleTabResults/>
            </div>
        </div>
    );
};

export default TabContents;