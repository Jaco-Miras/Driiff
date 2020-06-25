import React, {useCallback, useRef} from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {Avatar, SvgIconFeather} from "../../common";
import {ProgressBar} from "../common";
import {replaceChar} from "../../../helpers/stringFormatter";

const Wrapper = styled.div`
    position: absolute;
    will-change: transform;
    top: 0px;
    right: 0px;
    transform: translate3d(5px, 59px, 0px);
`;

const UserProfileDropdown = (props) => {

    const {className = "", user} = props;

    const history = useHistory();

    const refs = {
        container: useRef(null),
    };

    const handleEditProfile = useCallback((e) => {
        e.preventDefault();

        refs.container.current.classList.remove("show");
        history.push(`/profile/${user.id}/${replaceChar(user.name)}`);
    }, [user]);

    const handleSignOut = useCallback((e) => {
        e.preventDefault();
        history.push("/logout");
    }, []);

    const handleRedirect = () => {
        history.push(`/profile/${user.id}/${replaceChar(user.name)}`);
    }

    return (
        <Wrapper ref={refs.container} className={`user-profile-dropdown dropdown-menu dropdown-menu-big ${className}`}
                 x-placement="bottom-end">
            <div className="p-3 text-center">
                <Avatar 
                    name={user.name} 
                    imageLink={user.profile_image_link}
                    id={user.id}
                    partialName={user.partial_name}
                />
                <h6 className="d-flex align-items-center justify-content-center">
                    {user.name}
                    <span className="btn btn-primary btn-sm ml-2" data-toggle="tooltip" title=""
                          data-original-title="Edit profile" onClick={handleEditProfile}>
                        <SvgIconFeather icon="edit-2"/>
                    </span>
                </h6>
                <small>Balance: <strong>$105</strong></small>
            </div>
            <div className="dropdown-menu-body">
                <div className="border-bottom p-4">
                    <h6 className="text-uppercase font-size-11 d-flex justify-content-between">
                        Storage
                        <span>%5</span>
                    </h6>
                    <ProgressBar height={15} amount={5} limit={100}/>
                </div>
                <div className="list-group list-group-flush">
                    <a className="list-group-item" onClick={handleRedirect}>Profile</a>
                    <a href="#" className="list-group-item d-flex">
                        Followers <span className="text-muted ml-auto">214</span>
                    </a>
                    <a href="#" className="list-group-item d-flex">
                        Inbox <span className="text-muted ml-auto">18</span>
                    </a>
                    <a href="#" className="list-group-item" data-sidebar-target="#settings">Billing</a>
                    <a href="#" className="list-group-item" data-sidebar-target="#settings">Need help?</a>
                    <a href="#" className="list-group-item text-danger" data-sidebar-target="#settings"
                       onClick={handleSignOut}>Sign Out!</a>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(UserProfileDropdown);

