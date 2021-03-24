import React, { useRef, useState } from "react";
import styled from "styled-components";
//import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { SvgIconFeather } from "./SvgIcon";
import { useOutsideClick, useUserChannels } from "../hooks";

const ProfileWrapper = styled.div``;
const Icon = styled(SvgIconFeather)`
  opacity: ${(props) => (props.loading ? "0" : "1")};
  width: ${(props) => (props.loading ? "1px !important" : "1rem")};
`;

const ProfileSlider = (props) => {
  const { id, onShowPopup, orientation, profile, classNames = "" } = props;
  const { loggedUser, selectUserChannel, users } = useUserChannels();
  const [loading, setLoading] = useState(false);

  const sliderRef = useRef(null);

  let user = null;
  if (profile) {
    user = { ...profile };
  } else {
    user = { ...users[id] };
  }
  const handleUserChat = (e) => {
    e.stopPropagation();
    e.preventDefault();

    setLoading(true);
    const cb = () => {
      setLoading(false);
      onShowPopup();
    };
    if (!loading) selectUserChannel(user, cb);
  };
  const handleClose = () => {
    onShowPopup();
  };

  useOutsideClick(sliderRef, onShowPopup, true);

  return (
    <ProfileWrapper className={`profile-slider ${classNames} ${orientation ? `${orientation.vertical} ${orientation.horizontal}` : ""}`} ref={sliderRef}>
      <SvgIconFeather onClick={handleClose} icon="x" />
      <div className="avatar-wrapper">
        {user && <Avatar id={user.id} type="USER" imageLink={user.profile_image_link} name={user.name} fromSlider={true} forceThumbnail={false} />}
        <h5>{user?.name}</h5>
        <span className="text-muted small">{user?.designation}</span>
        {user && user.type === "internal" && loggedUser.id !== user.id && loggedUser.type === "internal" && (
          <button className="ml-1 btn btn-outline-light" onClick={handleUserChat}>
            {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}
            <Icon icon="message-circle" loading={loading} />
          </button>
        )}
      </div>
      <div className="information-wrapper">
        <div className="info-x">
          <span>Information</span>
        </div>
        <div className="d-flex">
          <div className="labels-wrapper">
            <label>First Name</label>
            <label>Last Name</label>
            <label>Position</label>
            <label>Email</label>
          </div>
          <div className="info-details">
            <span>{user?.first_name}</span>
            <span>{user?.last_name}</span>
            <span>{user?.role && user?.role.display_name}</span>
            <span>{user?.email}</span>
          </div>
        </div>
      </div>
    </ProfileWrapper>
  );
};

export default ProfileSlider;
