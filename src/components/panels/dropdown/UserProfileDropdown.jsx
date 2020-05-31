import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {Avatar, SvgIconFeather} from "../../common";

const Wrapper = styled.div`
    position: absolute;
    will-change: transform;
    top: 0px;
    right: 0px;
    transform: translate3d(5px, 59px, 0px);
`;

const UserProfileDropdown = (props) => {

    const {className = ""} = props;

    const user = useSelector(state => state.session.user);

    return (
        <Wrapper className={`user-profile-dropdown dropdown-menu dropdown-menu-big ${className}`} x-placement="bottom-end">
            <div className="p-3 text-center" data-backround-image="assets/media/image/image1.jpg"
                 styles="background: rgba(0, 0, 0, 0) url(&quot;assets/media/image/image1.jpg&quot;) repeat scroll 0% 0%;">
                <Avatar name={user.name} imageLink={user.profile_image_link}/>
                <h6 className="d-flex align-items-center justify-content-center">
                    {user.name}
                    <a href="#" className="btn btn-primary btn-sm ml-2" data-toggle="tooltip" title=""
                       data-original-title="Edit profile">
                        <SvgIconFeather icon="edit-2" />
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
                        <div className="progress-bar bg-primary" role="progressbar" styles="width: 35%;"
                             aria-valuenow="35"
                             aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <div className="list-group list-group-flush">
                    <a href="#" className="list-group-item">Profile</a>
                    <a href="#" className="list-group-item d-flex">
                        Followers <span className="text-muted ml-auto">214</span>
                    </a>
                    <a href="#" className="list-group-item d-flex">
                        Inbox <span className="text-muted ml-auto">18</span>
                    </a>
                    <a href="#" className="list-group-item" data-sidebar-target="#settings">Billing</a>
                    <a href="#" className="list-group-item" data-sidebar-target="#settings">Need help?</a>
                    <a href="#" className="list-group-item text-danger" data-sidebar-target="#settings">Sign Out!</a>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(UserProfileDropdown);

