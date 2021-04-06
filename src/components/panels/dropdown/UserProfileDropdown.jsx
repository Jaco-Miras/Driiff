import React, { useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { replaceChar } from "../../../helpers/stringFormatter";
import { Avatar, SvgIconFeather } from "../../common";
import { useTranslation, useUserActions } from "../../hooks";

const Wrapper = styled.div`
  position: absolute;
  will-change: transform;
  top: 0px;
  right: 0px;
  transform: translate3d(5px, 59px, 0px);

  .list-group-item {
    color: #828282;
  }
`;

const UserProfileDropdown = (props) => {
  const { className = "", user } = props;

  const history = useHistory();
  const { processBackendLogout } = useUserActions();

  const refs = {
    container: useRef(null),
  };

  const handleEditProfile = useCallback(() => {
    refs.container.current.classList.remove("show");
    document.querySelector(".overlay").classList.remove("show");
    history.push(`/profile/${user.id}/${replaceChar(user.name)}/edit`);
  }, [user]);

  const handleSignOut = useCallback(() => {
    refs.container.current.classList.remove("show");
    document.querySelector(".overlay").classList.remove("show");
    processBackendLogout();
  }, []);

  const handleProfile = useCallback(() => {
    refs.container.current.classList.remove("show");
    document.querySelector(".overlay").classList.remove("show");
    history.push(`/profile/${user.id}/${replaceChar(user.name)}/view`);
  }, [user]);

  const handleSettings = useCallback(() => {
    refs.container.current.classList.remove("show");
    document.querySelector(".overlay").classList.remove("show");
    history.push("/settings");
  }, []);

  const { _t } = useTranslation();

  const dictionary = {
    profile: _t("PROFILE.PROFILE", "Profile"),
    settings: _t("PROFILE.SETTINGS", "Settings"),
    signOut: _t("PROFILE.SIGN_OUT", "Sign out!"),
  };

  return (
    <Wrapper ref={refs.container} className={`user-profile-dropdown dropdown-menu dropdown-menu-big show ${className}`} x-placement="bottom-end">
      <div className="p-3 text-center">
        <Avatar name={user.name} imageLink={user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link} id={user.id} partialName={user.partial_name} showSlider={false} />
        <h6 className="d-flex align-items-center justify-content-center">
          {user.name}
          <span className="btn btn-primary btn-sm ml-2" data-toggle="tooltip" title="" data-original-title="Edit profile" onClick={handleEditProfile}>
            <SvgIconFeather icon="edit-2" />
          </span>
        </h6>
      </div>
      <div className="dropdown-menu-body">
        <div className="list-group list-group-flush">
          <span className="cursor-pointer list-group-item" onClick={handleProfile}>
            {dictionary.profile}
          </span>
          <span className="cursor-pointer list-group-item" onClick={handleSettings}>
            {dictionary.settings}
          </span>
          {/* <span className="cursor-pointer list-group-item">Billing</span>
          <span className="cursor-pointer list-group-item">Need help?</span> */}
          <span className="cursor-pointer list-group-item text-danger" onClick={handleSignOut}>
            {dictionary.signOut}
          </span>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(UserProfileDropdown);
