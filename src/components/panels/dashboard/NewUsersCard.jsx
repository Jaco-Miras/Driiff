import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Avatar } from "../../common";

const Wrapper = styled.div`
  > span {
    display: flex;
    align-items: center;
    font-weight: 600;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      padding-top: 10px;
      display: flex;
      align-items: center;
    }
    li:not(:last-child) {
      border-bottom: 1px solid #f1f2f7;
    }
  }
`;

const NewUsersCard = (props) => {
  const users = useSelector((state) => state.users.users);
  const usersLoaded = useSelector((state) => state.users.usersLoaded);
  const botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte", "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot", "huddle_bot"];
  const allUsers = [...Object.values(users)].filter((u) => {
    if (u.email && botCodes.includes(u.email)) {
      return false;
    } else {
      return u.active && u.has_accepted;
    }
  });
  const lastFiveUsers = allUsers.slice(-5);
  return (
    <Wrapper>
      <span>New users</span>
      <ul className="mt-2">
        {usersLoaded &&
          lastFiveUsers
            .sort((a, b) => {
              return b.id - a.id;
            })
            .map((u) => {
              return (
                <li key={u.id}>
                  <div className="mr-2">
                    <Avatar id={u.id} name={u.name} imageLink={u.profile_image_link} partialName={u.partial_name} noDefaultClick={!u.has_accepted} hasAccepted={true} showSlider={true} />
                  </div>
                  <div>
                    <h6 className="profile-name">{u.name}</h6>
                  </div>
                </li>
              );
            })}
      </ul>
    </Wrapper>
  );
};

export default NewUsersCard;
