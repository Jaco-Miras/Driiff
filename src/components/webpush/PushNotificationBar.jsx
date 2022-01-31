import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../common";

const NotificationBar = styled.div`
  padding: 10px;
  width: 100%;
  background: #000;
  color: #fff;
  height: 40px;
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.colors.primary};
  .feather {
    cursor: pointer;
  }
`;

const NotificationButton = styled.span`
  text-decoration: underline;
  cursor: pointer;
`;

const PushNotificationBar = (props) => {
  const { onClickAskUserPermission, onClickRemindLater } = props;

  return (
    <NotificationBar>
      <p>
        Please enable notification to get real-time updates. <NotificationButton onClick={onClickAskUserPermission}>Enable notification</NotificationButton>
      </p>
      <SvgIconFeather icon="x" onClick={onClickRemindLater} />
    </NotificationBar>
  );
};

export default PushNotificationBar;
