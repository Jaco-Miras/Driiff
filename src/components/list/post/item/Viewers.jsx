import React, { memo, useRef, useState } from "react";
import { Avatar, ProfileSlider } from "../../../common";
import { CSSTransition } from "react-transition-group";
import { useOutsideClick } from "../../../hooks";
import { uniqBy } from "lodash";
import styled from "styled-components";

const Wrapper = styled.span`
  ::-webkit-scrollbar {
    width: 7px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

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
  const filteredUsers = uniqBy(users, "id");
  return (
    <>
      <Wrapper ref={userContainerRef} className="hover read-users-container" style={{ opacity: show ? 1 : 0, maxHeight: show ? 175 : 0 }}>
        {filteredUsers.map((u) => {
          return (
            <span key={u.id}>
              <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_link} id={u.id} onClick={(e) => handleUserClick(e, u)} /> <span className="name">{u.name}</span>
            </span>
          );
        })}
      </Wrapper>
      {showSlider && (
        <CSSTransition appear in={showSlider} timeout={300} classNames="slide">
          <ProfileSlider id={user ? user.id : null} onShowPopup={() => setShowSlider((prevState) => !prevState)} showPopup={showSlider} orientation={orientation} />
        </CSSTransition>
      )}
    </>
  );
};

export default memo(Viewers);
