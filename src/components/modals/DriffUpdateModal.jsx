import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import styled from "styled-components";
import { SvgIconFeather } from "../common";
import { useUserActions, useTranslationActions } from "../hooks";
import { setNewDriffData } from "../../redux/actions/globalActions";

const NotificationBar = styled.div`
  padding: 10px;
  width: 100%;
  background: #000;
  color: #fff;
  height: 40px;
  display: flex;
  place-content: center;
  .feather {
    cursor: pointer;
  }
  position: fixed;
  top: 0;
  z-index: 1000;

  .button-notification {
    background: #8c48ae;
    border: none;
    padding: 0 1rem;
    margin: 0 6px;
  }
`;

const DriffUpdateModal = (props) => {
  const newDriffData = useSelector((state) => state.global.newDriffData);
  const { requirement } = newDriffData;

  const { logout, processBackendLogout } = useUserActions();
  const dispatch = useDispatch();
  const { _t } = useTranslationActions();

  // const refs = {
  //   audio: useRef(null),
  // };

  const dictionary = {
    update: _t("DRIFF.DRIFF_VERSION_UPDATE", "Go!"),
    remindMeAboutThis: _t("DRIFF.REMIND_ME_ABOUT_THIS", "Not right now"),
    updateReload: _t("DRIFF.UPDATE_BODY_RELOAD", "🎉  Driff is updated. Reload now?"),
    updateLogout: _t("DRIFF.UPDATE_BODY_LOGOUT", "🎉 Driff is updated. Logout now?"),
  };

  const toggle = () => {
    dispatch(setNewDriffData({ requirement: requirement, showNewDriffBar: false }));
  };

  const handleConfirm = () => {
    toggle();
    switch (requirement) {
      case "logout":
        logout(processBackendLogout()());
        break;
      default:
        window.location.reload();
        break;
    }
  };

  const getContent = () => {
    switch (requirement) {
      case "logout":
        return dictionary.updateLogout;
      default:
        return dictionary.updateReload;
    }
  };

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     const el = document.querySelector(".modal-backdrop");
  //     if (el && el.classList.contains("show")) {
  //       el.classList.remove("show");
  //       clearInterval(id);
  //     }
  //   }, 100);
  // }, []);

  return (
    <NotificationBar toggle={toggle} size={"m"} centered>
      <div dangerouslySetInnerHTML={{ __html: getContent() }} />
      <Button className="button-notification" onClick={handleConfirm}>
        {dictionary.update}
      </Button>{" "}
      {/* <Button className="button-notification" onClick={handleRemind}>
          {dictionary.remindMeAboutThis}
        </Button> */}
      <SvgIconFeather className="ml-3 align-self-center" icon="x" onClick={toggle} />
    </NotificationBar>
  );
};

export default React.memo(DriffUpdateModal);
