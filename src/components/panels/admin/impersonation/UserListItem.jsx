import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { addToModals } from "../../../../redux/actions/globalActions";
import { getCurrentUserImpersonation, impersonationLogin } from "../../../../redux/actions/userAction";
import { Avatar, SvgIconFeather } from "../../../common";
import { usePageLoader, useSettings, useTranslationActions, useUserActions } from "../../../hooks";
import { sessionService } from "redux-react-session";

const Wrapper = styled.a`
  .icon {
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    &:hover {
      background: rgba(67, 67, 67, 0.125);
      svg {
        stroke: ${({ theme }) => theme.colors.primary};
      }
    }
    svg {
      width: 0;
      height: 0;
      transition: 0.3s;
    }
  }
  &:hover {
    cursor: default;
    .icon {
      svg {
        width: 24px;
        height: 24px;
      }
    }
  }
`;

const UserListItem = (props) => {
  const { _t } = useTranslationActions();
  const dispatch = useDispatch();
  const { setGeneralSetting } = useSettings();
  const userActions = useUserActions();
  const { show, hide } = usePageLoader();

  const dictionary = {
    guestBadge: _t("IMPERSONATION_BADGE.GUEST", "Guest"),
  };

  const handleClick = (e) => {
    e.preventDefault();
    let modalPayload = {
      type: "impersonation_login",
      actions: {
        user: props.user,
        onSubmit: (credentials, cb) => {
          show();
          dispatch(
            impersonationLogin(credentials, (err, res) => {
              if (err) return;
              userActions.storeLoginToken(res.data);
              let dataSet = res.data;
              sessionService
                .saveSession({
                  token: `${dataSet.token_type} ${dataSet.access_token}`,
                  xsrf_token: `XSRF-TOKEN=${dataSet.access_token}`,
                  access_broadcast_token: `${dataSet.access_broadcast_token}`,
                  download_token: `${dataSet.download_token}`,
                })
                .then(() => {
                  dispatch(getCurrentUserImpersonation());
                  sessionService
                    .saveUser({
                      ...dataSet.user_auth,
                    })
                    .then(() => {
                      cb();

                      setGeneralSetting({ impersonationMode: true }, () => {
                        userActions.processBackendLogin(res.data, "/dashboard");
                        hide();
                      });
                    });
                });
            })
          );
        },
      },
    };

    dispatch(addToModals(modalPayload));
  };

  const isExternal = props.user.type === "external";
  return (
    <>
      <Wrapper href="#" className="list-group-item list-group-item-action py-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Avatar name={props.user.name} imageLink={props.user.profile_image_link} onClick={() => {}} />
          <div className="ml-3">
            <div>
              <span>{props.user.name}</span>
            </div>
            <div>
              {props.user.email} {isExternal && <span className="badge badge-warning">{dictionary.guestBadge}</span>}
            </div>
          </div>
        </div>
        <div className="icon" onClick={handleClick}>
          <SvgIconFeather icon="log-in" />
        </div>
      </Wrapper>
    </>
  );
};

export default UserListItem;
