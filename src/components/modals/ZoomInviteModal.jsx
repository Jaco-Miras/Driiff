import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
//import { useHistory } from "react-router-dom";
import { Button, Modal, ModalBody } from "reactstrap";
import { clearModal } from "../../redux/actions/globalActions";
import { useZoomActions } from "../hooks";

const ButtonsContainer = styled.div`
  margin-top: 1.5rem;
  button:first-child {
    margin-right: 1rem;
  }
`;

const ZoomInviteModal = (props) => {
  const { zoom_data, type, title, host } = props.data;
  const dispatch = useDispatch();
  //const history = useHistory();
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
    // localStorage.setItem("zoomConfig", JSON.stringify(payload));
    // window.open(`https://demo24.drevv.com/zoom/meeting/${channel_id}/${zoom_data.data.id}`, "_blank");
    // dispatch(
    //   incomingZoomData({ ...zoom_data.data }, () => {
    //     history.push(`/zoom/${channel_id}?join=0`);
    //   })
    // );
  };

  return (
    <Modal isOpen={modal} toggle={toggle} centered>
      <ModalBody>
        <h3>
          {host.name} has started a new Zoom Meeting for {title}
        </h3>
        <ButtonsContainer>
          <Button outline color="secondary" onClick={toggle}>
            Reject
          </Button>
          <Button color="primary" onClick={handleJoin}>
            Join
          </Button>
        </ButtonsContainer>
      </ModalBody>
    </Modal>
  );
};

export default React.memo(ZoomInviteModal);
