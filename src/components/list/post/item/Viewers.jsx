import React, { memo, useState } from "react";
import { Avatar, ProfileSlider } from "../../../common";
import { CSSTransition } from "react-transition-group";
import { uniqBy } from "lodash";

const Viewers = ({ users }) => {
  const [showSlider, setShowSlider] = useState(false);
  const [user, setUser] = useState(null);

  const handleUserClick = (e, user) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSlider(true);
    setUser(user);
  };

  const orientation = {
    vertical: "bottom",
    horizontal: "left",
  };

  const filteredUsers = uniqBy(users, "id");
  return (
    <>
      <span className="hover read-users-container">
        {filteredUsers.map((u) => {
          return (
            <span key={u.id}>
              <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_thumbnail_link ? u.profile_image_thumbnail_link : u.profile_image_link} id={u.id} onClick={(e) => handleUserClick(e, u)} />{" "}
              <span className="name">{u.name}</span>
            </span>
          );
        })}
      </span>
      {showSlider && (
        <CSSTransition appear in={showSlider} timeout={300} classNames="slide">
          <ProfileSlider id={user ? user.id : null} onShowPopup={() => setShowSlider((prevState) => !prevState)} showPopup={showSlider} orientation={orientation} />
        </CSSTransition>
      )}
    </>
  );
};

export default memo(Viewers);
