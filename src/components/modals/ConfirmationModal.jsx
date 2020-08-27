import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {Button, Modal, ModalBody, ModalFooter} from "reactstrap";
import {clearModal} from "../../redux/actions/globalActions";
import {ModalHeaderSection} from "./index";

const ConfirmationModal = (props) => {
  const {submitText, cancelText, headerText, bodyText, type} = props.data;
  const {onSubmit} = props.data.actions;

  const dispatch = useDispatch();
  const [modal, setModal] = useState(true);

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({type: type}));
  };

  const handleConfirm = () => {
    toggle();
    onSubmit();
  };

  return (
    <Modal isOpen={modal} toggle={toggle} centered>
      <ModalHeaderSection toggle={toggle}>{headerText}</ModalHeaderSection>
      <ModalBody _html dangerouslySetInnerHTML={{__html: bodyText}}/>
      <ModalFooter>
        <Button color="primary" onClick={handleConfirm}>
          {submitText}
        </Button>{" "}
        <Button outline color="secondary" onClick={toggle}>
          {cancelText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default React.memo(ConfirmationModal);
