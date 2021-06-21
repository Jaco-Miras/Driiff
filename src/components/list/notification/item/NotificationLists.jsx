import React from "react";
import styled from "styled-components";
import { NotificationListItem } from "./index";
import { useRedirect, useTranslationActions } from "../../../hooks";
import { useSelector } from "react-redux";

const Wrapper = styled.ul`
  overflow: auto;

  &.list-group {
    max-height: 390px !important;
    @media all and (max-width: 620px) {
      max-height: 60vh !important;
      max-height: calc(var(--vh, 1vh) * 100 - 196px) !important;
    }
  }
`;

const NotificationLists = (props) => {
  const { notifications, actions, history, dictionary, removeOverlay } = props;
  const redirect = useRedirect();
  const { _t } = useTranslationActions();
  const user = useSelector((state) => state.session.user);
  if (Object.keys(notifications).length === 0) return null;

  return (
    <Wrapper className={"list-group list-group-flush"}>
      {Object.values(notifications).length === 0 && (
        <li className="text-divider small pb-2 pl-3 pt-3">
          <span>{dictionary.noNotificationsToShow}</span>
        </li>
      )}
      {Object.values(notifications).filter((n) => n.is_read === 0).length > 0 && (
        <>
          <li className="text-divider small pb-2 pl-3 pt-3">
            <span>{dictionary.new}</span>
          </li>
          {Object.values(notifications)
            .filter((n) => n.is_read === 0)
            .sort((a, b) => b.created_at.timestamp - a.created_at.timestamp)
            .map((n) => {
              return <NotificationListItem data-toggle="notification" key={n.id} notification={n} actions={actions} history={history} redirect={redirect} removeOverlay={removeOverlay} _t={_t} user={user} />;
            })}
        </>
      )}
      {Object.values(notifications).filter((n) => n.is_read === 1).length > 0 && (
        <>
          <li className="text-divider small pb-2 pl-3 pt-3">
            <span>{dictionary.oldNotifications}</span>
          </li>
          {Object.values(notifications)
            .filter((n) => n.is_read === 1)
            .sort((a, b) => b.created_at.timestamp - a.created_at.timestamp)
            .map((n) => {
              return <NotificationListItem data-toggle="notification" key={n.id} notification={n} actions={actions} history={history} redirect={redirect} removeOverlay={removeOverlay} _t={_t} user={user} />;
            })}
        </>
      )}
    </Wrapper>
  );
};

export default NotificationLists;
