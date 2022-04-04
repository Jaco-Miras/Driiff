import React, { useRef, useState } from "react";
import { Avatar, ProfileSlider } from "../../../common";
import { CSSTransition } from "react-transition-group";
import { useOutsideClick } from "../../../hooks";

const Viewers = ({ users, show, close }) => {
  const [showSlider, setShowSlider] = useState(false);
  const [user, setUser] = useState(null);
  const userContainerRef = useRef();

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

  useOutsideClick(userContainerRef, close, show);

  return (
    <>
      <span ref={userContainerRef} className="hover read-users-container" style={{ opacity: show ? 1 : 0, maxHeight: show ? 175 : 0 }}>
        {users.map((u) => {
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

export default Viewers;
