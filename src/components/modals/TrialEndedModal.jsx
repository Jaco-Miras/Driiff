import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { ModalHeaderSection } from "./index";

const TrialEndedModal = (props) => {
  const { type } = props.data;

  const dispatch = useDispatch();
  const [modal, setModal] = useState(true);
  const componentIsMounted = useRef(true);

  const toggle = () => {
    //dispatch(clearModal({ type: type }));
  };

  return (
    <Modal isOpen={modal} toggle={toggle} size={"l"} centered className="post-modal">
      <ModalHeaderSection toggle={toggle} showCloseButton={false}>
        Driff trial subscription ended
      </ModalHeaderSection>
      <ModalBody>
        <p>Please subscribe to continue using driff.</p>
        <button className="btn btn-primary">Go to subscription page</button>
      </ModalBody>
    </Modal>
  );
};

export default React.memo(TrialEndedModal);
