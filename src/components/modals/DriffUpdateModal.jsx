import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { clearModal } from "../../redux/actions/globalActions";
// import { ModalHeaderSection } from "./index";
import styled from "styled-components";
import { useTranslation, useUserActions } from "../hooks";
// import { getDriffName } from "../hooks/useDriff";
import { SvgIconFeather } from "../common";

// const Wrapper = styled(Modal)`
//   position: fixed;
//   right: 20px;
//   display: block;
//   top: 1px;
  
//   .modal-content {
//     border: 1px solid #ffffff14 !important;
//   }
// `;

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
  }
`;

const DriffUpdateModal = (props) => {
  const { type, requirement, handleReminder } = props.data;

  const { logout, processBackendLogout } = useUserActions();
  const dispatch = useDispatch();
  const { _t } = useTranslation();

  const dictionary = {
    update: _t("DRIFF.DRIFF_VERSION_UPDATE", "Go!"),
    remindMeAboutThis: _t("DRIFF.REMIND_ME_ABOUT_THIS", "Not right now"),
    updateReload: _t("DRIFF.UPDATE_BODY_RELOAD", `🎉  Driff is updated. Reload now?`),
    updateLogout: _t("DRIFF.UPDATE_BODY_LOGOUT", `🎉 Driff is updated. Logout now?`)
  };

  const [modal, setModal] = useState(true);

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
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

  const handleRemind = () => {
    toggle();
    handleReminder();
  };

  const getContent = () => {
    switch (requirement) {
      case "logout":
        return dictionary.updateLogout;
      default:
        return dictionary.updateReload;
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      const el = document.querySelector(".modal-backdrop");
      if (el && el.classList.contains("show")) {
        el.classList.remove("show");
        clearInterval(id);
      }
    }, 100);
  }, []);

  return (
    <NotificationBar isOpen={modal} toggle={toggle} size={"m"} centered>
      <div dangerouslySetInnerHTML={{ __html: getContent() }}/>
        <Button className="button-notification" onClick={handleConfirm}>
          {dictionary.update}
        </Button>{" "}
        {/* <Button className="button-notification" onClick={handleRemind}>
          {dictionary.remindMeAboutThis}
        </Button> */}
        <SvgIconFeather className="ml-3 align-self-center" icon="x" onClick={handleRemind}/>
    </NotificationBar>
  );
};

export default React.memo(DriffUpdateModal);
