import React, { useRef, useState } from "react";
import styled from "styled-components";
//import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { SvgIconFeather } from "./SvgIcon";
import Badge from "./Badge";
import { useOutsideClick, useUserChannels, useTranslation } from "../hooks";

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

  const { _t } = useTranslation();

  const dictionary = {
    companyName: _t("PROFILE.COMPANY_NAME", "Company name"),
    information: _t("PROFILE.INFORMATION", "Information"),
    firstName: _t("PROFILE.FIRST_NAME", "First name:"),
    middleName: _t("PROFILE.MIDDLE_NAME", "Middle name:"),
    lastName: _t("PROFILE.LAST_NAME", "Last name:"),
    password: _t("PROFILE.PASSWORD", "Password:"),
    position: _t("PROFILE.POSITION", "Position:"),
    city: _t("PROFILE.CITY", "City:"),
    address: _t("PROFILE.ADDRESS", "Address:"),
    phone: _t("PROFILE.Phone", "Phone:"),
    email: _t("PROFILE.EMAIL", "Email:"),
    external: _t("PROFILE.EXTERNAL", "External"),
  };

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
  const handleClose = (e) => {
    e.stopPropagation();
    e.preventDefault();
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
        {user && user.type === "external" && loggedUser.type === "internal" && <span className="badge badge-info text-white mt-2">{dictionary.external}</span>}
      </div>
      <div className="information-wrapper">
        <div className="info-x">
          <span>{dictionary.information}</span>
        </div>
        <div className="d-flex">
          <div className="labels-wrapper">
            <label>{dictionary.firstName}</label>
            <label>{dictionary.lastName}</label>
            <label>{dictionary.position}</label>
            {loggedUser.type === "internal" && <label>{dictionary.email}</label>}
          </div>
          <div className="info-details">
            <span>{user?.first_name}</span>
            <span>{user?.last_name}</span>
            <span>{user?.role && user?.role.display_name}</span>
            {loggedUser.type === "internal" && <span>{user?.email}</span>}
          </div>
        </div>
      </div>
    </ProfileWrapper>
  );
};

export default ProfileSlider;
