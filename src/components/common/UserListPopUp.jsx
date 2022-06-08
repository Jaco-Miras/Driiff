import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Avatar, ProfileSlider, SvgIconFeather } from "../common";
import { useOutsideClick, useWorkspace } from "../hooks";
//import { useHistory } from "react-router-dom";
//import { replaceChar } from "../../helpers/stringFormatter";
import { CSSTransition } from "react-transition-group";

const UserListPopUpContainer = styled.div`
  ul {
    margin: 0;
    list-style: none;
    box-shadow: 0 0 3px 0 rgba(26, 26, 26, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    z-index: 5;
    overflow: auto;
    padding: 8px 8px;
    cursor: pointer;
    box-shadow: 0 5px 10px -1px rgba(0, 0, 0, 0.15);
    max-height: 260px;
  }

  li {
    white-space: nowrap;
    margin-bottom: 10px;
    display: inline-flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
    padding-bottom: 5px;

    span {
      font-weight: 400;
    }

    &:hover {
      span {
        color: ${(props) => props.theme.colors.primary};
      }
    }
    &:last-child {
      border: none;
      padding: 0;
      margin: 0;
    }
  }
  .ico-avatar {
    margin-right: 10px;
  }
  div.ico-avatar img {
    width: 100%;
    height: 100%;
  }
  span {
    font-weight: 600;
    color: #676767;
    .dark & {
      color: #c7c7c7;
    }
  }
  /* slide enter */
  .slide-enter,
  .slide-appear {
    opacity: 0;
    transform: scale(0.97) translateY(50px);
    z-index: 1;
  }
  .slide-enter.slide-enter-active,
  .slide-appear.slide-appear-active {
    opacity: 1;
    transform: scale(1) translateY(0);
    transition: opacity 300ms linear 100ms, transform 300ms ease-in-out 100ms;
  }
  // .slide-enter.slide-enter-done {
  //   opacity: 1;
  //   transform: scale(1) translateY(0);
  //   transition: opacity 300ms linear 100ms, transform 300ms ease-in-out 100ms;
  // }

  /* slide exit */
  .slide-exit {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  .slide-exit.slide-exit-active {
    opacity: 0;
    transform: scale(0.97) translateY(50px);
    transition: opacity 150ms linear, transform 150ms ease-out;
  }
  .slide-exit-done {
    opacity: 0;
  }
`;

const UserListPopUp = (props) => {
  const { users, className, onShowList, sharedUsers = false } = props;
  const listRef = useRef();
  //const history = useHistory();
  const [showSlider, setShowSlider] = useState(false);
  const [user, setUser] = useState(null);

  const { workspace } = useWorkspace();

  const handleShowList = () => {
    if (onShowList) onShowList();
  };

  const handleUserClick = (e, user) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSlider(true);
    setUser(user);
  };

  useOutsideClick(listRef, handleShowList, true);

  const orientation = {
    vertical: "bottom",
    horizontal: "left",
  };

  return (
    <UserListPopUpContainer className={`component-user-list-pop-up-container ${className}`} ref={listRef}>
      <ul>
        {users.map((u, k) => {
          return (
            <li key={u.id} onClick={(e) => handleUserClick(e, u)}>
              <Avatar
                size={"xs"}
                imageLink={u.profile_image_link}
                userId={u.id}
                name={u.name ? u.name : u.email}
                partialName={u.partial_name}
                hasAccepted={u.has_accepted}
                id={u.id}
                showSlider={false}
                //noDefaultClick={true}
                onClick={(e) => handleUserClick(e, u)}
              />
              <span className={"user-list-name"} onClick={(e) => handleUserClick(e, u)}>
                {u.name ? u.name : u.email} {workspace.sharedSlug && workspace.members.find((mem) => mem.id === u.id).slug !== workspace.slug.slice(0, -7) && <SvgIconFeather icon="repeat" height={14} />}
              </span>
            </li>
          );
        })}
      </ul>
      {showSlider && (
        <CSSTransition appear in={showSlider} timeout={300} classNames="slide">
          <ProfileSlider sharedUser={sharedUsers ? user : null} id={user ? user.id : null} onShowPopup={() => setShowSlider((prevState) => !prevState)} showPopup={showSlider} orientation={orientation} />
        </CSSTransition>
      )}
    </UserListPopUpContainer>
  );
};

export default React.memo(UserListPopUp);
