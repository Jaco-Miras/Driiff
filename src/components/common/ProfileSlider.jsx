import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { SvgIconFeather } from "./SvgIcon";
//import Badge from "./Badge";
import { useOutsideClick, useUserChannels, useTranslationActions } from "../hooks";
import { useHistory } from "react-router-dom";

const ProfileWrapper = styled.div`
  .info-details span {
    min-height: 14px;
  }
`;
const Icon = styled(SvgIconFeather)`
  opacity: ${(props) => (props.loading ? "0" : "1")};
  width: ${(props) => (props.loading ? "1px !important" : "1rem")};
`;

const ProfileSlider = (props) => {
  const { id, onShowPopup, orientation, profile, classNames = "", sharedUser = null } = props;
  const { loggedUser, selectUserChannel, users } = useUserChannels();
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const inactiveUsers = useSelector((state) => state.users.archivedUsers);
  const externalUsers = useSelector((state) => state.users.externalUsers);

  const botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte", "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot", "huddle_bot"];
  const allUsers = [...Object.values(users), ...inactiveUsers, ...externalUsers].filter((u) => {
    if (u.email && botCodes.includes(u.email)) {
      return false;
    } else {
      return true;
    }
  });

  const sliderRef = useRef(null);

  const { _t } = useTranslationActions();

  const dictionary = {
    companyName: _t("PROFILE.COMPANY_NAME", "Company name"),
    // information: _t("PROFILE.INFORMATION", "Information"),
    firstName: _t("PROFILE.FIRST_NAME", "First name:"),
    middleName: _t("PROFILE.MIDDLE_NAME", "Middle name:"),
    lastName: _t("PROFILE.LAST_NAME", "Last name:"),
    password: _t("PROFILE.PASSWORD", "Password:"),
    position: _t("PROFILE.POSITION", "Position:"),
    city: _t("PROFILE.CITY", "City:"),
    address: _t("PROFILE.ADDRESS", "Address:"),
    phone: _t("PROFILE.PHONE", "Phone:"),
    //email: _t("PROFILE.EMAIL", "Email:"),
    email: _t("LOGIN.EMAIL_PHONE", "Email / Phone number"),
    external: _t("PROFILE.EXTERNAL", "External"),
  };

  let user = null;
  if (sharedUser) {
    user = sharedUser;
  } else {
    if (profile) {
      user = { ...profile };
    } else {
      user = allUsers.find((u) => u.id === id);
    }
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

  const handleWorkspaceClick = () => {
    history.push(`/workspace/search?user-id=${user.id}`);
  };

  // this will attach an empty onclick function on the avatar if the user is shared
  // this is to prevent the default behavior of the avatar component to redirect when the avatar is clicked
  const sharedHandler = {
    ...(sharedUser && { onClick: () => {} }),
  };

  return (
    <ProfileWrapper className={`profile-slider ${classNames} ${orientation ? `${orientation.vertical} ${orientation.horizontal}` : ""}`} ref={sliderRef}>
      <SvgIconFeather onClick={handleClose} icon="x" />
      <div className="avatar-wrapper">
        {user && <Avatar id={user.id} type="USER" imageLink={user.profile_image_link} name={user.name} fromSlider={true} forceThumbnail={false} {...sharedHandler} />}
        <h5>{user?.name}</h5>
        <span className="text-muted small">{user?.designation}</span>
        <div style={{ display: "flex", gap: 8 }}>
          {!sharedUser && user.has_accepted && (
            <button className="ml-1 btn btn-outline-light" onClick={handleWorkspaceClick}>
              {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}
              <Icon icon="compass" loading={loading} />
            </button>
          )}
          {!sharedUser && user && user.type === "internal" && loggedUser.id !== user.id && loggedUser.type === "internal" && (
            <button className="ml-1 btn btn-outline-light" onClick={handleUserChat}>
              {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}
              <Icon icon="message-circle" loading={loading} />
            </button>
          )}
        </div>
        {user && user.type === "external" && loggedUser.type === "internal" && <span className="badge badge-info text-white mt-2">{dictionary.external}</span>}
      </div>
      <div className="information-wrapper">
        {/* <div className="info-x">
          <span>{dictionary.information}</span>
        </div> */}
        <div className="d-flex mt-2">
          <div className="labels-wrapper">
            <label>{dictionary.firstName}</label>
            <label>{dictionary.lastName}</label>
            {!sharedUser && <label>{dictionary.position}</label>}
            {!sharedUser && loggedUser.type === "internal" && <label>{dictionary.email}:</label>}
          </div>
          <div className="info-details ">
            <span>{sharedUser ? sharedUser.first_name : user?.first_name}</span>
            <span>{sharedUser ? sharedUser.last_name : user?.last_name}</span>
            <span>{sharedUser ? null : user?.role && user?.role.display_name}</span>
            {!sharedUser && loggedUser.type === "internal" && <span>{user?.email}</span>}
          </div>
        </div>
      </div>
    </ProfileWrapper>
  );
};

export default ProfileSlider;
