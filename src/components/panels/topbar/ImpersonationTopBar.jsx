import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { SvgIconFeather } from "../../common";
import { sessionService } from "redux-react-session";
import { usePageLoader, useSettings, useTranslationActions, useUserActions } from "../../hooks";
import { impersonationLogout } from "../../../redux/actions/userAction";

const Wrapper = styled.div`
  /* display: ${(props) => (props.show ? "block" : "none")}; */
  cursor: pointer;
  padding: 10px;
  width: 100%;
  color: #fff;
  height: 40px;
  display: flex;
  /* position: fixed; */
  top: 0;
  left: 0;
  z-index: 99999;
  text-align: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.fourth};
  .feather {
    cursor: pointer;
  }
`;

const ImpersonationTopBar = (props) => {
  const { _t } = useTranslationActions();
  const { processBackendLogout } = useUserActions();
  const { generalSettings, setGeneralSetting } = useSettings();
  const { user } = useSelector((state) => state.session);
  const dispatch = useDispatch();
  const { show, hide } = usePageLoader();

  const dictionary = {
    body: _t("IMPERSONATION_TOPBAR.BODY", "Your impersonating user ::username:: click here to logout", { username: user.name }),
  };

  const handleLogout = () => {
    show();
    if (generalSettings.impersonationMode) {
      setGeneralSetting({ impersonationMode: false }, () => {
        dispatch(
          impersonationLogout(null, (err, res) => {
            hide();
            processBackendLogout();
          })
        );
      });
    }
  };

  return (
    <Wrapper onClick={handleLogout}>
      <p>{dictionary.body}</p>
    </Wrapper>
  );
};

export default ImpersonationTopBar;
