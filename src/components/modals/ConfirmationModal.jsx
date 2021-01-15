import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { clearModal } from "../../redux/actions/globalActions";
import { ModalHeaderSection } from "./index";
import { SvgIconFeather } from "../common";

const ConfirmationModal = (props) => {
  const { submitText, cancelText, headerText, bodyText, type, size = "m" } = props.data;
  const { onSubmit } = props.data.actions;

  const dispatch = useDispatch();
  const [modal, setModal] = useState(true);
  const [showConditionText, setShowConditionText] = useState(false);

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const handleConfirm = () => {
    toggle();
    onSubmit();
  };

  let timeout = null;

  const handleMouseLeave = () => {
    timeout = setTimeout(() => {
      setShowConditionText(false);
    }, 600);
  };

  const handleMouseEnter = () => {
    setShowConditionText(true);
    clearTimeout(timeout);
  };

  return (
    <Modal isOpen={modal} toggle={toggle} size={size} centered>
      <ModalHeaderSection toggle={toggle}>{headerText}</ModalHeaderSection>
      <ModalBody>
        <span dangerouslySetInnerHTML={{ __html: bodyText }} />
        {props.data.generalConditionText && <SvgIconFeather className="ml-2" icon="help-circle" width={16} height={16} onMouseEnter={handleMouseEnter} />}
        {showConditionText && <div onMouseLeave={handleMouseLeave}>{props.data.generalConditionText}</div>}
      </ModalBody>
      <ModalFooter>
        <Button outline color="secondary" onClick={toggle}>
          {cancelText}
        </Button>
        <Button color="primary" onClick={handleConfirm}>
          {submitText}
        </Button>{" "}
      </ModalFooter>
    </Modal>
  );
};

export default React.memo(ConfirmationModal);
