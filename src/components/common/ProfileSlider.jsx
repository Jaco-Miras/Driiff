import React, { useRef } from "react";
import styled from "styled-components";
//import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { SvgIconFeather } from "./SvgIcon";
import { useOutsideClick, useUserChannels } from "../hooks";

const ProfileWrapper = styled.div``;

const ProfileSlider = (props) => {
  const { id, onShowPopup } = props;
  const { loggedUser, selectUserChannel, users } = useUserChannels();
  const sliderRef = useRef(null);
  //   const users = useSelector((state) => state.users.users);
  const user = users[id];
  const handleUserChat = () => {
    if (user) {
      selectUserChannel(user);
    }
  };
  const handleClose = () => {};
  useOutsideClick(sliderRef, onShowPopup, true);
  if (user) {
    return (
      <ProfileWrapper className="profile-slider" ref={sliderRef}>
        <div className="avatar-wrapper">
          <Avatar id={user.id} type="USER" imageLink={user.profile_image_link} name={user.name} fromSlider={true} forceThumbnail={false} />
          <h5>{user.name}</h5>
          <span className="text-muted small">{user.designation}</span>
          {user.type === "internal" && loggedUser.id !== user.id && (
            <button className="ml-1 btn btn-outline-light">
              <SvgIconFeather onClick={handleUserChat} icon="message-circle" />
            </button>
          )}
        </div>
        <div className="information-wrapper">
          <div className="info-x">
            <span>Information</span>
            <SvgIconFeather onClick={handleClose} icon="x" />
          </div>
          <div className="d-flex">
            <div className="labels-wrapper">
              <label>First Name</label>
              <label>Last Name</label>
              <label>Position</label>
              <label>Email</label>
            </div>
            <div className="info-details">
              <span>{user.first_name}</span>
              <span>{user.last_name}</span>
              <span>{user.role && user.role.display_name}</span>
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </ProfileWrapper>
    );
  } else {
    return null;
  }
};

export default ProfileSlider;
