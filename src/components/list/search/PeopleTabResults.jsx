import React from "react";

const PeopleTabResults = (props) => {

    return (
        <ul className="list-group list-group-flush">
            <li className="list-group-item p-l-r-0">
                <div className="media">
                <figure className="avatar m-r-15">
                    <span className="avatar-title bg-secondary rounded-circle">FS</span>
                </figure>
                <div className="media-body">
                    <h5>Ferrel Skipsea</h5>
                    <p className="m-b-0">Tax Accountant</p>
                </div>
                </div>
            </li>
            <li className="list-group-item p-l-r-0">
                <div className="media">
                <figure className="avatar m-r-15">
                    <img src="assets/media/image/user/man_avatar1.jpg" className="rounded-circle" alt="image" />
                </figure>
                <div className="media-body">
                    <h5>Lorry Lewsey</h5>
                    <p className="m-b-0">Marketing Assistant</p>
                </div>
                </div>
            </li>
            <li className="list-group-item p-l-r-0">
                <div className="media">
                <figure className="avatar m-r-15">
                    <span className="avatar-title bg-success rounded-circle">W</span>
                </figure>
                <div className="media-body">
                    <h5>Winny Lippiatt</h5>
                    <p className="m-b-0">Cost Accountant</p>
                </div>
                </div>
            </li>
            <li className="list-group-item p-l-r-0">
                <div className="media">
                <figure className="avatar m-r-15">
                    <span className="avatar-title bg-danger rounded-circle">SW</span>
                </figure>
                <div className="media-body">
                    <h5>Salim Walklate</h5>
                    <p className="m-b-0">Chemical Engineer</p>
                </div>
                </div>
            </li>
            <li className="list-group-item p-l-r-0">
                <div className="media">
                <figure className="avatar m-r-15">
                    <span className="avatar-title bg-warning rounded-circle">S</span>
                </figure>
                <div className="media-body">
                    <h5>Sena Erangey</h5>
                    <p className="m-b-0">Financial Advisor</p>
                </div>
                </div>
            </li>
            <li className="list-group-item p-l-r-0">
                <div className="media">
                <figure className="avatar m-r-15">
                    <span className="avatar-title bg-info rounded-circle">D</span>
                </figure>
                <div className="media-body">
                    <h5>Decca Thorrington</h5>
                    <p className="m-b-0">Systems Administrator</p>
                </div>
                </div>
            </li>
        </ul>
    );
};

export default PeopleTabResults;