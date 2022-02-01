import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { clearModal } from "../../redux/actions/globalActions";
import { useTranslationActions } from "../hooks";
import { ModalHeaderSection } from "./index";

const ModalWrapper = styled(Modal)`
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

const ZoomMeetingInProgress = (props) => {
  const { type, size = "m" } = props.data;

  const { _t } = useTranslationActions();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(true);

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const handleConfirm = () => {
    toggle();
  };

  const dictionary = {
    closeButton: _t("BUTTON.CLOSE", "Close"),
    meetingInProgressHeader: _t("MODAL.MEETING_IN_PROGRESS_HEADER", "Meeting in progress"),
    meetingInProgressBody: _t("MODAL.MEETING_IN_PROGRESS_BODY", "Zoom meeting already in progress."),
  };

  return (
    <ModalWrapper isOpen={modal} toggle={toggle} size={size} centered>
      <ModalHeaderSection toggle={toggle}>{dictionary.meetingInProgressHeader}</ModalHeaderSection>
      <ModalBody>{dictionary.meetingInProgressBody}</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleConfirm}>
          {dictionary.closeButton}
        </Button>
      </ModalFooter>
    </ModalWrapper>
  );
};

export default React.memo(ZoomMeetingInProgress);
