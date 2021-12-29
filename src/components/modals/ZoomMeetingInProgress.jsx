import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { clearModal } from "../../redux/actions/globalActions";
import { useTranslationActions } from "../hooks";
import { ModalHeaderSection } from "./index";

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
    <Modal isOpen={modal} toggle={toggle} size={size} centered>
      <ModalHeaderSection toggle={toggle}>{dictionary.meetingInProgressHeader}</ModalHeaderSection>
      <ModalBody>{dictionary.meetingInProgressBody}</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleConfirm}>
          {dictionary.closeButton}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default React.memo(ZoomMeetingInProgress);
