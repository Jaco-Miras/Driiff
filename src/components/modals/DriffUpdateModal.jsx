import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { clearModal } from "../../redux/actions/globalActions";
import { ModalHeaderSection } from "./index";
import styled from "styled-components";
import { useTranslation, useUserActions } from "../hooks";
import { getDriffName } from "../hooks/useDriff";

const Wrapper = styled(Modal)`
  position: fixed;
  right: 20px;
  display: block;
  top: 1px;
  
  .modal-content {
    border: 1px solid #ffffff14 !important;
  }
`;

const DriffUpdateModal = (props) => {
  const { type, requirement, handleReminder } = props.data;

  const { logout, processBackendLogout } = useUserActions();
  const dispatch = useDispatch();
  const { _t } = useTranslation();

  const dictionary = {
    update: _t("DRIFF.DRIFF_VERSION_UPDATE", "Update"),
    remindMeAboutThis: _t("DRIFF.REMIND_ME_ABOUT_THIS", "Remind me about this in 30 minutes"),
    updateReload: _t("DRIFF.UPDATE_BODY_RELOAD", `Good news, a new version of Driff is available.<br/>
          Would you like to reload the page?`),
    updateLogout: _t("DRIFF.UPDATE_BODY_LOGOUT", `<p>Good news, a new version of Driff is available.<br/>
            This will force to logout you out.</p>
          <p>Would you like to apply the change?</p>`)
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
    <Wrapper isOpen={modal} toggle={toggle} size={"m"} centered>
      <ModalHeaderSection toggle={toggle}>{getDriffName()} Driff - Update</ModalHeaderSection>
      <ModalBody dangerouslySetInnerHTML={{ __html: getContent() }}/>
      <ModalFooter>
        <Button color="primary" onClick={handleConfirm}>
          {dictionary.update}
        </Button>{" "}
        <Button outline color="secondary" onClick={handleRemind}>
          {dictionary.remindMeAboutThis}
        </Button>
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(DriffUpdateModal);
