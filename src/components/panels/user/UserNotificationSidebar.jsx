import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useNotificationActions } from "../../hooks";

const Wrapper = styled.div`
  font-family: Inter;
  letter-spacing: 0;
  text-align: center;
  font-size: 12px;
  p {
    padding: 0 !important;
    margin: 0 !important;
    color: #8b8b8b;
    text-align: center;
    line-height: 15px;
  }
  span {
    text-align: center;
    cursor: pointer;
  }

  .app-sidebar-menu {
    padding: 2em 1em;
    text-align: center;
  }
  .app-sidebar-menu p {
    padding: 0 !important;
    margin: 0 !important;
    color: #8b8b8b;
    line-height: 15px;
  }
  .app-sidebar-menu p:last-child {
    padding-bottom: 1em !important;
  }
  .app-sidebar-menu span {
    text-decoration: underline !important;
    margin-top: 1em;
    display: block;
    cursor: pointer;
  }
  .app-sidebar-menu p:nth-of-type(2) {
    font-weight: bold;
    color: ${(props) => (props.darkMode === "1" ? "#afb8bd" : "#000000")};
  }
`;

const UserNotificationSidebar = (props) => {
  const { className = "", dictionary, user, unreadNotifications, darkMode } = props;
  const history = useHistory();
  const actions = useNotificationActions();
  const markAllRead = (e) => {
    e.preventDefault();
    actions.readAll({});
  };

  const handleSettings = () => {
    history.push("/settings");
  };

  //const removeAll = () => actions.removeAll()

  return (
    <Wrapper className={`bottom-modal-mobile ${className}`} darkMode={darkMode}>
      <div className="card">
        <div className="app-sidebar-menu" tabIndex="1">
          <p>📬</p>
          <p>
            {dictionary.howdy} {user.first_name}
          </p>
          <p>
            {dictionary.notificationCount1} {unreadNotifications} {dictionary.notificationCount2}
          </p>
          <span onClick={markAllRead}>{dictionary.markAllAsRead}</span>
          {/* <span onClick={removeAll}>Clear notifications</span> */}
        </div>
      </div>
      <p>{dictionary.improve}</p>
      <span onClick={handleSettings} style={{ color: "#5B1269" }}>
        {dictionary.viewSettings}
      </span>
    </Wrapper>
  );
};

export default React.memo(UserNotificationSidebar);
