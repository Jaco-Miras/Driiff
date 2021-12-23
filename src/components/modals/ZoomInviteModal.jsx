import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalBody } from "reactstrap";
import { clearModal } from "../../redux/actions/globalActions";
import { useZoomActions, useTranslationActions } from "../hooks";

const ButtonsContainer = styled.div`
  margin-top: 1.5rem;
  button:first-child {
    margin-right: 1rem;
  }
  .btn.btn-primary {
    background-color: ${({ theme }) => theme.colors.primary}!important;
    border-color: ${({ theme }) => theme.colors.primary}!important;
  }
  .btn.btn-outline-secondary {
    color: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.secondary};
  }
  .btn.btn-outline-secondary:not(:disabled):not(.disabled):hover,
  .btn.btn-outline-secondary:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  .btn.btn-outline-secondary:not(:disabled):not(.disabled):hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ZoomInviteModal = (props) => {
  const { zoom_data, type, title, host } = props.data;
  const dispatch = useDispatch();
  const { _t } = useTranslationActions();
  const dictionary = {
    zoomInvite: _t("ZOOM.INVITE_POP_UP", "::host:: has started a new Zoom Meeting for ::title::", { host: host.name, title: title }),
    reject: _t("REJECT", "Reject"),
    join: _t("JOIN", "Join"),
  };
  const [modal, setModal] = useState(true);

  const zoomActions = useZoomActions();

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const handleJoin = () => {
    toggle();
    let payload = {
      meetingNumber: zoom_data.data.id,
      role: 0,
      password: zoom_data.data.password,
    };
    zoomActions.generateSignature(payload);
  };

  return (
    <Modal isOpen={modal} toggle={toggle} centered>
      <ModalBody>
        <h3>{dictionary.zoomInvite}</h3>
        <ButtonsContainer>
          <Button className="btn btn-outline-secondary" outline color="secondary" onClick={toggle}>
            {dictionary.reject}
          </Button>
          <Button className="btn btn-primary" color="primary" onClick={handleJoin}>
            {dictionary.join}
          </Button>
        </ButtonsContainer>
      </ModalBody>
    </Modal>
  );
};

export default React.memo(ZoomInviteModal);
