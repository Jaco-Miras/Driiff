import React, { useRef } from "react";
import styled from "styled-components";
import { Avatar } from "../common";
import { useOutsideClick } from "../hooks";
import { useHistory } from "react-router-dom";

const UserListPopUpContainer = styled.div`
  ul {
    margin: 0;
    list-style: none;
    box-shadow: 0 0 3px 0 rgba(26, 26, 26, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    z-index: 5;
    overflow: auto;
    background-color: #ffffff;
    color: #4d4d4d;
    border-radius: 8px;
    padding: 8px 8px;
    cursor: pointer;
    box-shadow: 0 5px 10px -1px rgba(0, 0, 0, 0.15);
    border-top: 1px solid #eeeeee;
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
        color: #972c86;
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
  }
`;

const UserListPopUp = (props) => {
  const { users, className, onShowList } = props;
  const listRef = useRef();
  const history = useHistory();

  const handleShowList = () => {
    if (onShowList) onShowList();
  };

  const handleOnNameClick = (e, user) => {
    history.push(`/profile/${user.id}/${user.name}`);
  };

  useOutsideClick(listRef, handleShowList, true);

  return (
    <UserListPopUpContainer className={className} ref={listRef}>
      <ul>
        {users.map((u, k) => {
          return (
            <li key={u.id}>
              <Avatar size={"xs"} imageLink={u.profile_image_link} userId={u.id} name={u.name ? u.name : u.email} partialName={u.partial_name} hasAccepted={u.has_accepted} noDefaultClick={true} onClick={(e) => handleOnNameClick(e, u)} />
              <span onClick={(e) => handleOnNameClick(e, u)}>{u.name ? u.name : u.email}</span>
            </li>
          );
        })}
      </ul>
    </UserListPopUpContainer>
  );
};

export default UserListPopUp;
