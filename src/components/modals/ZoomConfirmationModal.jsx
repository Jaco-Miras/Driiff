import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { clearModal } from "../../redux/actions/globalActions";
import { ModalHeaderSection } from "./index";
import { useTranslationActions, useZoomActions, useToaster } from "../hooks";
import { createZoomMeeting, generateZoomSignature } from "../../redux/actions/chatActions";

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

const ZoomConfirmationModal = (props) => {
  const { type, size = "m" } = props.data;

  const dispatch = useDispatch();
  const toaster = useToaster();
  const zoomActions = useZoomActions();
  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const user = useSelector((state) => state.session.user);

  const [startingZoom, setStartingZoom] = useState(false);

  const { _t } = useTranslationActions();

  const dictionary = {
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    yes: _t("YES", "Yes"),
    no: _t("NO", "No"),
    zoomMeeting: _t("CONFIRMATION.ZOOM_MEETING", "Zoom meeting"),
    zoomMeetingConfirmation: _t("CONFIRMATION.ZOOM_MEETING_BODY", "This channel contains ::number:: members and ::online:: are online. Do you want to start this meeting?", {
      number: selectedChannel ? selectedChannel.members.length : "",
      online: selectedChannel ? selectedChannel.members.filter((m) => user.id !== m.id && onlineUsers.some((o) => o.user_id === m.id)).length + 1 : 1,
    }),
    toasterGeneraError: _t("TOASTER.GENERAL_ERROR", "An error has occurred try again!"),
    zoomStartingMeeting: _t("CONFIRMATION.ZOOM_STARTING_MEETING", "Starting meeting, please hold"),
  };

  const [modal, setModal] = useState(true);

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const handleStartZoomMeeting = () => {
    //setStartingZoom(true);
    let payload = {
      channel_id: selectedChannel.id,
    };

    dispatch(
      createZoomMeeting(payload, (err, res) => {
        if (err) {
          if (err.response && err.response.data && err.response.data.errors) {
            if (err.response.data.errors.error_message.length && err.response.data.errors.error_message.find((e) => e === "MEETING_ALREADY_CREATED")) {
              toaster.error(dictionary.meetingInProgress, { autoClose: 5000 });
            } else {
              toaster.error(dictionary.toasterGeneraError);
            }
          } else {
            toaster.error(dictionary.toasterGeneraError);
          }
        }
        if (res && res.data) {
          let sigPayload = {
            meetingNumber: res.data.zoom_data.data.id,
            role: 1,
          };
          const zoomCreateConfig = {
            password: res.data.zoom_data.data.password,
            meetingNumber: res.data.zoom_data.data.id,
            role: 1,
          };

          dispatch(
            generateZoomSignature(
              {
                ...sigPayload,
                channel_id: selectedChannel.id,
                system_message: `ZOOM_MEETING::${JSON.stringify({
                  author: {
                    id: user.id,
                    name: user.name,
                    first_name: user.first_name,
                    partial_name: user.partial_name,
                    profile_image_link: user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link,
                  },
                  password: res.data.zoom_data.data.password,
                  meetingNumber: res.data.zoom_data.data.id,
                  channel_id: selectedChannel.id,
                })}`,
              },
              (e, r) => {
                toggle();
                if (e) return;
                if (r) {
                  //zoomActions.createMessage(selectedChannel.id, zoomCreateConfig);
                  zoomActions.startMeeting(r.data.signature, zoomCreateConfig);
                  //setStartingZoom(false);
                }
              }
            )
          );
        }
      })
    );
  };

  const handleConfirm = () => {
    // toggle();
    setStartingZoom(true);
    handleStartZoomMeeting();
  };

  return (
    <ModalWrapper isOpen={modal} toggle={toggle} size={size} centered>
      <ModalHeaderSection toggle={toggle}>{dictionary.zoomMeeting}</ModalHeaderSection>
      <ModalBody>
        <span dangerouslySetInnerHTML={{ __html: startingZoom ? dictionary.zoomStartingMeeting : dictionary.zoomMeetingConfirmation }} />
      </ModalBody>
      <ModalFooter>
        <Button className="btn btn-outline-secondary" outline color="secondary" onClick={toggle} disabled={startingZoom}>
          {dictionary.no}
        </Button>
        <Button className="btn btn-primary" color="primary" onClick={handleConfirm} disabled={startingZoom}>
          {dictionary.yes}
        </Button>{" "}
      </ModalFooter>
    </ModalWrapper>
  );
};

export default React.memo(ZoomConfirmationModal);
